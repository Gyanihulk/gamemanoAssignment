import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Movie, CartItem } from "@/types";
export async function PUT(request: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { movieId } = await request.json();

        // Get the user's cart or create a new one
        let cart = await db.cart.findUnique({
            where: { userId: user.id },
            include: { cartItems: true },
        });

        if (!cart) {
            cart = await db.cart.create({
                data: { userId: user.id },
            });
        }
       
        // Check if the movie is already in the cart
        const existingCartItem = cart.cartItems.find(
            (item: Movie) => item.id === movieId
        );

        if (existingCartItem) {
            // If the movie is already in the cart, update the quantity
            await db.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: { increment: 1 } },
            });
        } else {
            // If the movie is not in the cart, add a new cart item
            await db.cartItem.create({
                data: {
                    movieId,
                    cartId: cart.id,
                },
            });
        }
     
        // Update the cart total
        const updatedCartItems = await db.cartItem.findMany({
            where: { cartId: cart.id },
            include: { movie: true },
        });
        const total = updatedCartItems.reduce(
            (acc: any, item: CartItem) => acc + (item.movie.price || 0) * item.quantity,
            0
        );

        await db.cart.update({
            where: { id: cart.id },
            data: { total },
        });

        return new NextResponse("Movie added to cart", { status: 200 });
    } catch (error) {
        console.error("[ADD_TO_CART_API]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
