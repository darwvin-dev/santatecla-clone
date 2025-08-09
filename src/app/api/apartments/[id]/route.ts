import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/Apartment";
import dbConnect from "@/lib/mongodb";
import { Types } from "mongoose";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const apartment = await Apartment.findById(id);

  if (!apartment) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(apartment);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const { id } = params;

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

    const title = formData.get("title") as string;
    const guests = parseInt(formData.get("guests") as string);
    const beds = parseInt(formData.get("beds") as string);
    const size = formData.get("size") as string;
    const address = formData.get("address") as string;
    const description = formData.get("description") as string;

    apartment.title = title || apartment.title;
    apartment.guests = guests || apartment.guests;
    apartment.beds = beds || apartment.beds;
    apartment.size = size || apartment.size;
    apartment.address = address || apartment.address;
    apartment.description = description || apartment.description;

    const imageFile = formData.get("image") as File;

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      if (apartment.image) {
        const oldImagePath = path.join(process.cwd(), "public", apartment.image);
        try {
          await fs.unlink(oldImagePath); 
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await fs.mkdir(uploadDir, { recursive: true });
      const savePath = path.join(uploadDir, fileName);
      await fs.writeFile(savePath, buffer);

      apartment.image = `/uploads/${fileName}`;
    }

    await apartment.save();

    return NextResponse.json(apartment, { status: 200 });
  } catch (error: any) {
    console.error("Error during POST request:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const apartment = await Apartment.findById(id);

  if (!apartment) {
    return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
  }

  if (apartment.image) {
    const imagePath = path.join(process.cwd(), "public", apartment.image);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  }

  await Apartment.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
