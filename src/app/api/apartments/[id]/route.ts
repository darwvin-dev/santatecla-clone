import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Apartment from "@/models/Apartment";
import path from "path";
import fs from "fs/promises";

/* ---------- Helpers ---------- */

function safeJson<T>(value: FormDataEntryValue | null): T | undefined {
  if (typeof value !== "string") return undefined;
  try { return JSON.parse(value) as T; } catch { return undefined; }
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function deleteIfExists(absPath: string) {
  try { await fs.unlink(absPath); } catch { /* ignore */ }
}

async function saveImageFile(file: File, folder: string, suffix = ""): Promise<string> {
  if (!file.type?.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed");
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await ensureDir(uploadDir);

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}${suffix}${ext}`;
  const destPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    await dbConnect();

    const { name } = params;

    const apartment = await Apartment.findOne({name});
    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json(apartment);
  } catch (e: any) {
    console.error("GET /api/apartments/[id] error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const title = (formData.get("title") as string) ?? apartment.title;
    const guests = formData.get("guests") ? Number(formData.get("guests")) : apartment.guests;
    const sizeSqm = formData.get("sizeSqm") ? Number(formData.get("sizeSqm")) : apartment.sizeSqm;
    const bathrooms = formData.get("bathrooms") ? Number(formData.get("bathrooms")) : apartment.bathrooms;
    const floor = (formData.get("floor") as string) ?? apartment.floor;
    const address = (formData.get("address") as string) ?? apartment.address;
    const addressDetail = (formData.get("addressDetail") as string) ?? apartment.addressDetail;
    const description = (formData.get("description") as string) ?? apartment.description;
    const details = (formData.get("details") as string) ?? apartment.details;

    apartment.title = title;
    apartment.guests = guests;
    apartment.sizeSqm = sizeSqm;
    apartment.bathrooms = bathrooms;
    apartment.floor = floor;
    apartment.address = address;
    apartment.addressDetail = addressDetail;
    apartment.description = description;
    apartment.details = details;

    const lat = formData.get("lat") ? Number(formData.get("lat")) : undefined;
    const lng = formData.get("lng") ? Number(formData.get("lng")) : undefined;
    if (typeof lat === "number" && !Number.isNaN(lat) && typeof lng === "number" && !Number.isNaN(lng)) {
      apartment.location = { type: "Point", coordinates: [lng, lat] } as any;
      apartment.lat = lat;
      apartment.lng = lng;
    }

    type Amenity =
      | "macchina_caffe" | "aria_condizionata" | "bollitore" | "tostapane" | "lavastoviglie"
      | "self_check_in" | "tv" | "lavatrice" | "set_di_cortesia" | "microonde" | "biancheria"
      | "culla_su_richiesta" | "wifi" | "parcheggio_esterno" | "animali_ammessi" | "asciugacapelli" | "balcone";

    const amenities = safeJson<Amenity[]>(formData.get("amenities"));
    if (amenities) apartment.amenities = amenities;

    const rules = safeJson<{ checkInFrom: string; checkInTo: string; checkOutBy: string }>(formData.get("rules"));
    if (rules) apartment.rules = rules;

    const cancellation = safeJson<{ policy: "free_until_5_days" | "flexible" | "strict"; note?: string }>(
      formData.get("cancellation")
    );
    if (cancellation) apartment.cancellation = cancellation;

    const folder = (title?.trim() ? title.trim() : `APT_${id}`).replace(/[/\\?%*:|"<>]/g, "_");

    const coverFile = formData.get("image") as File | null;
    if (coverFile && typeof coverFile === "object" && coverFile.size > 0) {
      if (apartment.image) {
        await deleteIfExists(path.join(process.cwd(), "public", apartment.image));
      }
      apartment.image = await saveImageFile(coverFile, folder, "_cover");
    }

    const keepGallery = safeJson<string[]>(formData.get("keepGallery")) ?? [];
    const currentGallery: string[] = Array.isArray(apartment.gallery) ? apartment.gallery : [];

    const toDelete = currentGallery.filter((url) => !keepGallery.includes(url));
    for (const url of toDelete) {
      await deleteIfExists(path.join(process.cwd(), "public", url));
    }

    let nextGallery = [...keepGallery];

    const galleryNew = formData.getAll("galleryNew[]") as File[];
    for (const gf of galleryNew) {
      if (gf && typeof gf === "object" && "type" in gf && gf.type.startsWith("image/")) {
        const p = await saveImageFile(gf, folder, "_gallery");
        nextGallery.push(p);
      }
    }
    apartment.gallery = nextGallery;

    const removePlan = (formData.get("removePlan") as string) === "true";
    const planFile = formData.get("plan") as File | null;

    if (removePlan && apartment.plan) {
      await deleteIfExists(path.join(process.cwd(), "public", apartment.plan));
      apartment.plan = undefined as any;
    }
    if (!removePlan && planFile && typeof planFile === "object" && planFile.size > 0) {
      if (apartment.plan) {
        await deleteIfExists(path.join(process.cwd(), "public", apartment.plan));
      }
      apartment.plan = await saveImageFile(planFile, folder, "_plan");
    }

    await apartment.save();
    return NextResponse.json(apartment, { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/apartments/[id] error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  return PUT(req, ctx);
}

/* ---------- DELETE ---------- */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    // حذف کاور
    if (apartment.image) {
      await deleteIfExists(path.join(process.cwd(), "public", apartment.image));
    }
    // حذف پلان
    if (apartment.plan) {
      await deleteIfExists(path.join(process.cwd(), "public", apartment.plan));
    }
    // حذف گالری
    if (Array.isArray(apartment.gallery)) {
      for (const url of apartment.gallery) {
        await deleteIfExists(path.join(process.cwd(), "public", url));
      }
    }

    await Apartment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/apartments/[id] error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
