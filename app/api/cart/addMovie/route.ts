import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Movie, CartItem } from "@/types";
export async function PUT(request: Request) {
    try {
        const user = await currentUser();
        if (user === null) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { movieId } = await request.json();

        // Get the user's cart or create a new one
        let cart = await db.cart.findUnique({
            where: { userId: user.id },
            include: { cartItems: { include: { movie: true } } },
        });

        if (!cart) {
            cart = await db.cart.create({
                data: { userId: user.id!, total: 0 ,cartItems: {
                    create: [], 
                }, }, include: {
                    cartItems: { include: { movie: true } }
                },
            });
        }
        const existingCartItem = cart.cartItems.find(
            // @ts-ignore
            (item: CartItem) => item.movieId  === movieId
        );

        if (existingCartItem) {
            await db.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: { increment: 1 } },
            });
        } else {
            await db.cartItem.create({
                data: {
                    movieId,
                    cartId: cart.id,
                },
            });
        }
     
        const updatedCartItems = await db.cartItem.findMany({
            where: { cartId: cart.id },
            include: { movie: true },
        });

        const total = updatedCartItems.reduce(
            // @ts-ignore
            (acc: any, item: CartItem) => acc + (item.movie.price || 0) * item.quantity,
            0
        );

        await db.cart.update({
            where: { id: cart.id },
            // @ts-ignore
            data: { total  },
        });

        return new NextResponse("Movie added to cart", { status: 200 });
    } catch (error) {
        console.error("[ADD_TO_CART_API]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
