import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const { movieId } = params;

    // Fetch the movie by ID
    const movie = await db.movie.findUnique({
      where: { id: movieId },
    });

    // Check if the movie exists
    if (!movie) {
      return new NextResponse(JSON.stringify({ message: "Movie not found" }), { status: 404 });
    }

    // Return the movie data
    return new NextResponse(JSON.stringify(movie), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("[GET_MOVIE_BY_ID_API]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
