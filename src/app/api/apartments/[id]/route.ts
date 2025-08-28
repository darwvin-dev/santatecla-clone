import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Apartment from "@/models/Apartment";
import path from "path";
import fs from "fs/promises";

/* ---------- Helpers ---------- */

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
}

function safeJson<T>(value: FormDataEntryValue | null): T | undefined {
  if (typeof value !== "string") return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

async function deleteIfExists(absPath: string) {
  try {
    await fs.unlink(absPath);
  } catch {}
}

async function saveImageFile(
  file: File,
  subPrefix = "",
  title = ""
): Promise<string> {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed");
  }

  const safeTitle = slugify(title || "APARTMENTS");

  const uploadDir = path.join(process.cwd(), "public", "uploads", safeTitle);
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const unique = `${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}${subPrefix}`;
  const filename = `${unique}${ext}`;
  const destPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  return `/uploads/${safeTitle}/${filename}`;
}

type IdCtx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: IdCtx) {
  try {
    await dbConnect();

    const { id } = await params;

    const apartment = await Apartment.findOne({
      $or: [{ title: id }, { slug: id }],
    });
    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(apartment);
  } catch (e: any) {
    console.error("GET /api/apartments/[id] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: IdCtx) {
  try {
    await dbConnect();

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const title = (formData.get("title") as string) ?? apartment.title;
    const title_en = (formData.get("title_en") as string) ?? apartment.title_en;
    const guests = formData.get("guests")
      ? Number(formData.get("guests"))
      : apartment.guests;
    const sizeSqm = formData.get("sizeSqm")
      ? Number(formData.get("sizeSqm"))
      : apartment.sizeSqm;
    const bathrooms = formData.get("bathrooms")
      ? Number(formData.get("bathrooms"))
      : apartment.bathrooms;
    const floor = (formData.get("floor") as string) ?? apartment.floor;
    const floor_en = (formData.get("floor_en") as string) ?? apartment.floor_en;
    const address = (formData.get("address") as string) ?? apartment.address;
    const address_en =
      (formData.get("address_en") as string) ?? apartment.address_en;
    const addressDetail =
      (formData.get("addressDetail") as string) ?? apartment.addressDetail;
    const addressDetail_en =
      (formData.get("addressDetail_en") as string) ??
      apartment.addressDetail_en;
    const description =
      (formData.get("description") as string) ?? apartment.description;
    const description_en =
      (formData.get("description_en") as string) ?? apartment.description_en;
    const details = (formData.get("details") as string) ?? apartment.details;
    const details_en =
      (formData.get("details_en") as string) ?? apartment.details_en;
    const cin = (formData.get("cin") as string) ?? apartment.cin;
    const cir = (formData.get("cir") as string) ?? apartment.cir;

    apartment.title = title;
    apartment.title_en = title_en;
    apartment.guests = guests;
    apartment.sizeSqm = sizeSqm;
    apartment.bathrooms = bathrooms;
    apartment.floor = floor;
    apartment.floor_en = floor_en;
    apartment.address = address;
    apartment.address_en = address_en;
    apartment.addressDetail = addressDetail;
    apartment.addressDetail_en = addressDetail_en;
    apartment.description = description;
    apartment.description_en = description_en;
    apartment.details = details;
    apartment.details_en = details_en;
    apartment.cin = cin;
    apartment.cir = cir;

    const lat = formData.get("lat") ? Number(formData.get("lat")) : undefined;
    const lng = formData.get("lng") ? Number(formData.get("lng")) : undefined;
    if (
      typeof lat === "number" &&
      !Number.isNaN(lat) &&
      typeof lng === "number" &&
      !Number.isNaN(lng)
    ) {
      apartment.location = { type: "Point", coordinates: [lng, lat] } as any;
      apartment.lat = lat;
      apartment.lng = lng;
    }

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

    const amenities = safeJson<Amenity[]>(formData.get("amenities"));
    if (amenities) apartment.amenities = amenities;

    const rules = safeJson<{
      checkInFrom: string;
      checkInTo: string;
      checkOutBy: string;
    }>(formData.get("rules"));
    if (rules) apartment.rules = rules;

    const cancellation = safeJson<{
      policy: "free_until_5_days" | "flexible" | "strict";
      note?: string;
      note_en?: string;
    }>(formData.get("cancellation"));
    if (cancellation) apartment.cancellation = cancellation;

    const coverFile = formData.get("image") as File | null;
    if (coverFile && typeof coverFile === "object" && coverFile.size > 0) {
      if (apartment.image) {
        await deleteIfExists(
          path.join(process.cwd(), "public", apartment.image)
        );
      }
      apartment.image = await saveImageFile(coverFile, "_cover", title);
    }

    const galleryOrder = safeJson<string[]>(formData.get("galleryOrder"));
    const galleryNewFiles = formData.getAll("galleryNew[]") as File[];
    const currentGallery: string[] = Array.isArray(apartment.gallery)
      ? apartment.gallery
      : [];

    if (Array.isArray(galleryOrder) && galleryOrder.length > 0) {
      const existingTokens = new Set(
        galleryOrder.filter((t) => !t.startsWith("new:"))
      );
      const toDelete = currentGallery.filter((url) => !existingTokens.has(url));
      for (const url of toDelete) {
        await deleteIfExists(path.join(process.cwd(), "public", url));
      }

      const nextGallery: string[] = [];
      const usedNew = new Set<number>();

      for (const token of galleryOrder) {
        if (token.startsWith("new:")) {
          const idxStr = token.split(":")[1] ?? "";
          const idx = Number(idxStr);
          const f = galleryNewFiles[idx];

          if (
            Number.isFinite(idx) &&
            !usedNew.has(idx) &&
            f &&
            typeof f === "object" &&
            "type" in f &&
            f.type?.startsWith("image/")
          ) {
            const p = await saveImageFile(f, "_gallery", title);
            nextGallery.push(p);
            usedNew.add(idx);
          }
        } else {
          nextGallery.push(token);
        }
      }

      apartment.gallery = nextGallery;
    } else {
      const keepGallery = safeJson<string[]>(formData.get("keepGallery")) ?? [];
      const toDelete = currentGallery.filter(
        (url) => !keepGallery.includes(url)
      );
      for (const url of toDelete) {
        await deleteIfExists(path.join(process.cwd(), "public", url));
      }

      let nextGallery = [...keepGallery];
      for (const gf of galleryNewFiles) {
        if (
          gf &&
          typeof gf === "object" &&
          "type" in gf &&
          gf.type?.startsWith("image/")
        ) {
          const p = await saveImageFile(gf, "_gallery", title);
          nextGallery.push(p);
        }
      }
      apartment.gallery = nextGallery;
    }

    const removePlan = (formData.get("removePlan") as string) === "true";
    const planFile = formData.get("plan") as File | null;

    if (removePlan && apartment.plan) {
      await deleteIfExists(path.join(process.cwd(), "public", apartment.plan));
      apartment.plan = undefined as any;
    }
    if (
      !removePlan &&
      planFile &&
      typeof planFile === "object" &&
      planFile.size > 0
    ) {
      if (apartment.plan) {
        await deleteIfExists(
          path.join(process.cwd(), "public", apartment.plan)
        );
      }
      apartment.plan = await saveImageFile(planFile, "_plan", title);
    }

    await apartment.save();
    return NextResponse.json(apartment, { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/apartments/[id] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, ctx: IdCtx) {
  return PUT(req, ctx);
}

/* ---------- DELETE ---------- */
export async function DELETE(_req: NextRequest, { params }: IdCtx) {
  try {
    await dbConnect();

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    if (apartment.image) {
      await deleteIfExists(path.join(process.cwd(), "public", apartment.image));
    }
    if (apartment.plan) {
      await deleteIfExists(path.join(process.cwd(), "public", apartment.plan));
    }
    if (Array.isArray(apartment.gallery)) {
      for (const url of apartment.gallery) {
        await deleteIfExists(path.join(process.cwd(), "public", url));
      }
    }

    await Apartment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/apartments/[id] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
