import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/Apartment";
import dbConnect from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const apartment = await Apartment.findById(params.id);
    
    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }
    
    return NextResponse.json(apartment);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    // Create upload directory if needed
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const filename = `${"86546853485664"}${fileExtension}`;
    const newPath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(newPath, buffer);
    const imagePath = `/uploads/${filename}`;

    // Extract form data
    const apartmentData = {
      title: formData.get("title") as string,
      guests: parseInt(formData.get("guests") as string),
      beds: parseInt(formData.get("beds") as string),
      size: formData.get("size") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
      image: imagePath,
    };

    // Create new apartment
    const apartment = await Apartment.create(apartmentData);

    return NextResponse.json(apartment, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const apartment = await Apartment.findById(params.id);

    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    // Delete associated image
    if (apartment.image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        apartment.image
      );
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await Apartment.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}