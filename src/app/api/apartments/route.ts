import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/Apartment";
import dbConnect from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    await dbConnect();
    const apartments = await Apartment.find();
    return NextResponse.json(apartments);
  } catch (error) {
    console.error("GET /api/apartments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }
    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}${ext}`;
    const newPath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(newPath, buffer);

    const apartmentData = {
      title: (formData.get("title") as string) ?? "",
      guests: Number(formData.get("guests") ?? 0),
      beds: Number(formData.get("beds") ?? 0),
      size: (formData.get("size") as string) ?? "",
      address: (formData.get("address") as string) ?? "",
      description: (formData.get("description") as string) ?? "",
      image: `/uploads/${filename}`,
    };

    if (!apartmentData.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
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
