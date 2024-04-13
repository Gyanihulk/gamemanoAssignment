import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";


export async function GET(req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    const order = await db.order.findUnique({
      where: {
        id: params.orderId
      },
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Not Found" }), { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[GET_ORDER_INFO]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    const { status } = await req.json();

    if (!status) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const order = await db.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!order) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedOrder = await db.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[UPDATE_ORDER_STATUS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
