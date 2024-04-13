import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Authenticate the user
    const user = await currentUser();
  
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Check if the order exists and belongs to the current user
    const order = await db.order.findUnique({
      where: {
        id: params.orderId,
        userId: user.id, // Ensure the order belongs to the current user
      },
    });

    // If the order does not exist or does not belong to the user, return a 404 response
    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Not Found" }), { status: 404 });
    }

    // Update the order status to "DELIVERED"
    const updatedOrder = await db.order.update({
      where: { id: params.orderId },
      data: { status: "DELIVERED" },
    });

    // Return the updated order as a JSON response
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[SET_ORDER_STATUS_DELIVERED]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
