import { NextRequest, NextResponse } from "next/server";
import DynamicPart from "@/models/DynamicPart";
import dbConnect from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";

type Params = { id: string };
type RouteCtx = { params: Promise<Params> };

async function saveImageFile(
  file: File,
  folder: string,
  subPrefix = ""
): Promise<string> {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed");
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const unique = `${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}${subPrefix}`;
  const filename = `${unique}${ext}`;
  const destPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  return `/uploads/${folder}/${filename}`;
}

function getStringU(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v : undefined;
}
function getNumberU(form: FormData, key: string) {
  const v = form.get(key);
  if (typeof v !== "string") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function getBoolU(form: FormData, key: string) {
  const v = form.get(key);
  if (typeof v !== "string") return undefined;
  return v === "true" || v === "1" || v === "on";
}

export async function GET(_req: NextRequest, { params }: RouteCtx) {
  await dbConnect();
  const { id } = await params;
  const doc = await DynamicPart.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function POST(req: NextRequest, { params }: RouteCtx) {
  try {
    await dbConnect();
    const { id } = await params;
    const existing = await DynamicPart.findById(id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const form = await req.formData();

    const keyVal = getStringU(form, "key") ?? existing.key;
    const pageVal = getStringU(form, "page") ?? existing.page;
    const folder = path
      .join("DYNAMIC_PARTS", pageVal, keyVal)
      .replaceAll(path.sep, "/");

    async function pickUrlOrUploadUpdate(field: string, suffix: string) {
      const entry = form.get(field);
      if (entry instanceof File && entry.size > 0) {
        return await saveImageFile(entry, folder, suffix);
      }
      if (typeof entry === "string") {
        return entry;
      }
      return undefined;
    }

    const patch: any = {
      key: getStringU(form, "key"),
      page: getStringU(form, "page"),
      title: getStringU(form, "title"),
      title_en: getStringU(form, "title_en"),
      secondTitle: getStringU(form, "secondTitle"),
      secondTitle_en: getStringU(form, "secondTitle_en"),
      description: getStringU(form, "description"),
      description_en: getStringU(form, "description_en"),
      secondDescription: getStringU(form, "secondDescription"),
      secondDescription_en: getStringU(form, "secondDescription_en"),
      order: getNumberU(form, "order"),
      published: getBoolU(form, "published"),
      image: await pickUrlOrUploadUpdate("image", "_image"),
      mobileImage: await pickUrlOrUploadUpdate("mobileImage", "_mobile"),
      image2: await pickUrlOrUploadUpdate("image2", "_image2"),
      mobileImage2: await pickUrlOrUploadUpdate("mobileImage2", "_mobile2"),
      image3: await pickUrlOrUploadUpdate("image3", "_image3"),
      mobileImage3: await pickUrlOrUploadUpdate("mobileImage3", "_mobile3"),
    };

    Object.keys(patch).forEach(
      (k) => patch[k] === undefined && delete patch[k]
    );

    const updated = await DynamicPart.findByIdAndUpdate(id, patch, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("POST /api/dynamic-parts/:id (update) error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params;
    await dbConnect();

    const existing = await DynamicPart.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const childrenCount = await DynamicPart.countDocuments({
      parentId: (existing as any)._id,
    });
    if (childrenCount > 0) {
      return NextResponse.json(
        {
          error:
            "این آیتم زیرمجموعه دارد. ابتدا پست‌های وابسته را حذف یا منتقل کنید.",
        },
        { status: 409 }
      );
    }

    const fields = [
      "image",
      "mobileImage",
      "image2",
      "mobileImage2",
      "image3",
      "mobileImage3",
    ] as const;

    const filePaths: string[] = [];
    for (const f of fields) {
      const url = (existing as any)[f] as string | undefined;
      if (url && typeof url === "string" && url.startsWith("/uploads/")) {
        const abs = path.join(process.cwd(), "public", url.replace(/^\//, ""));
        filePaths.push(abs);
      }
    }

    await DynamicPart.findByIdAndDelete(id);
    await Promise.allSettled(filePaths.map((p) => fs.unlink(p)));

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/dynamic-parts/:id error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
