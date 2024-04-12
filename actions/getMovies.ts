import { db } from '@/lib/db';
import { Movie } from '@prisma/client';

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
          mode: 'insensitive', // Case-insensitive search
        },
        posterUrl: {
          not: null || 'N/A',
        },
        ...(genreName && {
          genres: {
            has: genreName,
          },
        }),
        ...(language && {
          language: {
            contains: language,
            mode: 'insensitive',
          },
        }),
        ...(director && {
          director: {
            contains: director,
            mode: 'insensitive',
          },
        }),
        ...(actors && {
          actors: {
            hasSome: actors.map((actor) => ({
              contains: actor,
              mode: 'insensitive',
            })),
          },
        }),
        ...(imdbRating && {
          imdbRating: {
            gte: imdbRating, // Greater than or equal to
          },
        }),
      },
      orderBy: {
        releaseDate: 'desc',
      },
      take: 100,
    });

    return movies;
  } catch (error) {
    console.log('[GET_MOVIES]', error);
    return [];
  }
};
