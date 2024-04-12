import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.cartItemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedCartItem = await db.cartItem.update({
      where: { id: params.cartItemId },
      data: { quantity },
      include: {
        movie: true, // Include the movie details
      },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error("[UPDATE_CART_ITEM_QUANTITY]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.cartItemId,
        cart: {
          userId: user.id,
        },
      },
    });

    if (!cartItem) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await db.cartItem.delete({
      where: { id: params.cartItemId },
    });

    return new NextResponse("Cart item deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DELETE_CART_ITEM]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
