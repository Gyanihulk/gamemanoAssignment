import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { addressId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { street, city, state, zipCode, country, phone } = await request.json();
    const { addressId } = params;

    // Validate required fields
    if (!street || !city || !state || !zipCode || !country || !phone) {
      return new NextResponse(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Check if the address exists and belongs to the user
    const address = await db.address.findUnique({
      where: { id: addressId, userId: user.id },
    });

    if (!address) {
      return new NextResponse(JSON.stringify({ message: "Address not found or not owned by user" }), { status: 404 });
    }

    // Update the address
    const updatedAddress = await db.address.update({
      where: { id: addressId },
      data: { street, city, state, zipCode, country, phone },
    });

    return new NextResponse(JSON.stringify(updatedAddress), { status: 200 });
  } catch (error) {
    console.error("[UPDATE_ADDRESS_API]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
