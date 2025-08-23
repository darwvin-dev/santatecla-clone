import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/Apartment";
import dbConnect from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";

type Locale = "it" | "en";
type Order =
  | "date_desc"
  | "date_asc"
  | "alpha_asc"
  | "alpha_desc";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const order = (searchParams.get("order") || "date_desc") as Order;
    const locale = (searchParams.get("locale") || "it") as Locale;

    const sort =
      order === "date_asc"
        ? { createdAt: 1 }
        : order === "alpha_asc"
        ? { title: 1 }
        : order === "alpha_desc"
        ? { title: -1 }
        : { createdAt: -1 };

    // داده‌ها
    const docs = await Apartment.find().sort(sort).lean();

    // نگاشت بر اساس زبان (فیلدهای *_en اگر بود)
    const mapped = docs.map((doc: any) => ({
      ...doc,
      title: locale === "en" ? doc.title_en || doc.title : doc.title,
      description:
        locale === "en" ? doc.description_en || doc.description : doc.description,
      details: locale === "en" ? doc.details_en || doc.details : doc.details,
      address: locale === "en" ? doc.address_en || doc.address : doc.address,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/apartments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


function safeJson<T>(value: FormDataEntryValue | null): T | undefined {
  if (typeof value !== "string") return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

async function saveImageFile(
  file: File,
  subPrefix = "",
  title = ""
): Promise<string> {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed");
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    title || "APARTMENTS"
  );
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const unique = `${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}${subPrefix}`;
  const filename = `${unique}${ext}`;
  const destPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  return `/uploads/${title || "APARTMENTS"}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = (formData.get("title") as string) ?? "";
    if (!title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const coverFile = formData.get("image") as File | null;
    if (!coverFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }
    if (!coverFile.type || !coverFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    const coverPath = await saveImageFile(coverFile, "_cover", title);

    const galleryFiles = formData.getAll("gallery[]") as File[];
    const galleryPaths: string[] = [];
    for (const gf of galleryFiles) {
      if (
        gf &&
        typeof gf === "object" &&
        "type" in gf &&
        gf.type.startsWith("image/")
      ) {
        const p = await saveImageFile(gf, "_gallery", title);
        galleryPaths.push(p);
      }
    }

    const planFile = formData.get("plan") as File | null;
    let planPath: string | undefined;
    if (planFile && planFile.type && planFile.type.startsWith("image/")) {
      planPath = await saveImageFile(planFile, "_plan", title);
    }

    const guests = Number(formData.get("guests") ?? 0);
    const sizeSqm = Number(formData.get("sizeSqm") ?? 0);
    const bathrooms = Number(formData.get("bathrooms") ?? 0);
    const floor = (formData.get("floor") as string) ?? "";
    const address = (formData.get("address") as string) ?? "";
    const addressDetail = (
      (formData.get("addressDetail") as string) ?? ""
    ).trim();
    const description = (formData.get("description") as string) ?? "";
    const details = (formData.get("details") as string) ?? "";
    const cin = (formData.get("cin") as string) ?? "";
    const cir = (formData.get("cir") as string) ?? "";
    const lat = formData.get("lat") ? Number(formData.get("lat")) : undefined;
    const lng = formData.get("lng") ? Number(formData.get("lng")) : undefined;

    type Amenity =
      | "macchina_caffe"
      | "aria_condizionata"
      | "bollitore"
      | "tostapane"
      | "lavastoviglie"
      | "self_check_in"
      | "tv"
      | "lavatrice"
      | "set_di_cortesia"
      | "microonde"
      | "biancheria"
      | "culla_su_richiesta"
      | "wifi"
      | "parcheggio_esterno"
      | "animali_ammessi"
      | "asciugacapelli"
      | "balcone";

    const amenities = safeJson<Amenity[]>(formData.get("amenities")) ?? [];
    const rules = safeJson<{
      checkInFrom: string;
      checkInTo: string;
      checkOutBy: string;
    }>(formData.get("rules"));
    const cancellation = safeJson<{ policy: string; note?: string }>(
      formData.get("cancellation")
    );

    const apartmentData: any = {
      title,
      guests,
      sizeSqm,
      floor,
      bathrooms,
      address,
      addressDetail,
      description,
      details,
      image: coverPath,
      gallery: galleryPaths,
      plan: planPath,
      amenities,
      rules,
      cancellation,
      cir,
      cin,
    };

    if (typeof lat === "number" && typeof lng === "number") {
      apartmentData.location = { type: "Point", coordinates: [lng, lat] };
      apartmentData.lat = lat;
      apartmentData.lng = lng;
    }

    const sizeLegacy = formData.get("size");
    if (sizeLegacy && !sizeSqm) {
      apartmentData.size = String(sizeLegacy);
    }

    const apartment = await Apartment.create(apartmentData);
    return NextResponse.json(apartment, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/apartments upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
