import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/Apartment";
import dbConnect from "@/lib/mongodb";
import { Types } from "mongoose";

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
