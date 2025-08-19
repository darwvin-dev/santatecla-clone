import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/mongodb";
import DynamicPart from "@/models/DynamicPart";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function saveImageFile(file: File, folder: string, subPrefix = ""): Promise<string> {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed");
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}${subPrefix}`;
  const filename = `${unique}${ext}`;
  const destPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || undefined;
    const key  = searchParams.get("key")  || undefined;
    const parentIdRaw = searchParams.get("parentId");

    const filter: any = {};
    if (page) filter.page = page;
    if (key)  filter.key  = key;

    if (parentIdRaw === "null" || parentIdRaw === "none") {
      filter.parentId = null;
    } else if (parentIdRaw && Types.ObjectId.isValid(parentIdRaw)) {
      filter.parentId = new Types.ObjectId(parentIdRaw);
    }

    const docs = await DynamicPart.find(filter).sort({ order: 1, updatedAt: -1 }).lean();
    return NextResponse.json(docs);
  } catch (e: any) {
    console.error("GET /api/dynamic-parts error:", e);
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const form = await req.formData();

    const key  = String(form.get("key") || "");
    const page = String(form.get("page") || "");
    if (!key || !page) return NextResponse.json({ error: "key and page are required" }, { status: 400 });

    const parentIdStr = (form.get("parentId") as string) || "";
    const parentId =
      parentIdStr && Types.ObjectId.isValid(parentIdStr) ? new Types.ObjectId(parentIdStr) :
      parentIdStr === "null" || parentIdStr === "none" ? null :
      undefined; 

    const folder = path.join("DYNAMIC_PARTS", page, key, String(parentId ?? "_root")).replaceAll(path.sep, "/");

    async function pickUrlOrUpload(field: string, suffix: string) {
      const entry = form.get(field);
      if (entry instanceof File && entry.size > 0) return await saveImageFile(entry, folder, suffix);
      if (typeof entry === "string") return entry;
      return "";
    }

    const doc: any = {
      key, page,
      title: String(form.get("title") || ""),
      secondTitle: String(form.get("secondTitle") || ""),
      description: String(form.get("description") || ""),
      secondDescription: String(form.get("secondDescription") || ""),
      order: Number(form.get("order") || 0),
      published: ["true", "1", "on"].includes(String(form.get("published") || "true")),
      image: await pickUrlOrUpload("image", "_image"),
      mobileImage: await pickUrlOrUpload("mobileImage", "_mobile"),
      image2: await pickUrlOrUpload("image2", "_image2"),
      mobileImage2: await pickUrlOrUpload("mobileImage2", "_mobile2"),
      image3: await pickUrlOrUpload("image3", "_image3"),
      mobileImage3: await pickUrlOrUpload("mobileImage3", "_mobile3"),
    };

    if (parentId !== undefined) doc.parentId = parentId;

    const created = await DynamicPart.create(doc);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/dynamic-parts error:", e);
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 });
  }
}
