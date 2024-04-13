import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const role = await currentRole();
  
    if (role !== UserRole.ADMIN) {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    const orders = await db.order.findMany({
      include: {
        address: true,
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
    console.error("[GET_ALL_ORDERS_API]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
