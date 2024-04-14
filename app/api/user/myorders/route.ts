import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        address:true,
        _count: {
            select: {
              orderItems: true, 
            },
          },
      },
    orderBy: {
      createdAt: "desc",
    },
    });
    return new NextResponse(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("[GET_MY_ORDERS_API]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
