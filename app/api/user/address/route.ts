import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Address } from "@/types"; // Ensure this type reflects your Prisma model

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { street, city, state, zipCode, country, phone } = await request.json();

 
    if (!street) return new NextResponse(JSON.stringify({ message: "Street is required" }), { status: 400 });
    if (!city) return new NextResponse(JSON.stringify({ message: "City is required" }), { status: 400 });
    if (!state) return new NextResponse(JSON.stringify({ message: "State is required" }), { status: 400 });
    if (!zipCode) return new NextResponse(JSON.stringify({ message: "Zip code is required" }), { status: 400 });
    if (!country) return new NextResponse(JSON.stringify({ message: "Country is required" }), { status: 400 });
    if (!phone) return new NextResponse(JSON.stringify({ message: "Phone is required" }), { status: 400 });

    const newAddress = await db.address.create({
      // @ts-ignore
      data: {
        userId: user.id,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("[CREATE_ADDRESS_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const address = await db.address.findFirst({
      where: { userId: user.id },
    });

    if (!address) {
      return new NextResponse(JSON.stringify({ message: "Address not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(address), { status: 200 });
  } catch (error) {
    console.error("[GET_ADDRESS_API]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
