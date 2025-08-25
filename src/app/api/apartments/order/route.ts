import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/Apartment";
import dbConnect from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { order } = body; 

    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const bulkOps = order.map((item: { id: string; orderShow: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { orderShow: item.orderShow } },
      },
    }));

    if (bulkOps.length > 0) {
      await Apartment.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/apartments/order error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
