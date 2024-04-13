import { db } from "@/lib/db";
import { Movie } from "@prisma/client";

type GetMovies = {
  title?: string;
  genreName?: string;
  language?: string;
  director?: string;
  actors?: string[];
  imdbRating?: number;
};

export const getMovies = async ({
  title,
  genreName,
  language,
  director,
  actors,
  imdbRating,
}: GetMovies): Promise<Movie[]> => {
  try {
    const movies = await db.movie.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
        posterUrl: {
          not: null || "N/A",
        },
        ...(language && {
          language: {
            contains: language,
            mode: "insensitive",
          },
        }),
      },
      orderBy: {
        releaseDate: "desc",
      },
      take: 100,
    });

    // Filter the movies in JavaScript
    let filteredMovies = movies.filter((movie: Movie) => {
      // Filter by genreName if provided
      const matchesGenre = genreName
        ? movie.genres.some((genre: string) =>
            genre.toLowerCase().includes(genreName.toLowerCase())
          )
        : true;

      // Filter by director if provided
      const matchesDirector = director
        ? movie.director?.toLowerCase().includes(director.toLowerCase())
        : true;

      // Filter by actors if provided
      const matchesActors = actors
        ? actors.some((actor) =>
            movie.actors?.some((movieActor) =>
              movieActor.toLowerCase().includes(actor.toLowerCase())
            )
          )
        : true;

      // Only include movies that match all provided filters
      return matchesGenre && matchesDirector && matchesActors;
    });


    return filteredMovies;
  } catch (error) {
    console.log("[GET_MOVIES]", error);
    return [];
  }
};
