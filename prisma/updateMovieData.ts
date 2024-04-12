// prisma/updateMovies.ts

const { PrismaClient } = require('@prisma/client');
const axios=require("axios")

const prisma = new PrismaClient();
const OMDB_API_KEY = '7a80d0a3'; // Replace with your actual OMDb API key

async function updateMovieDetails() {
  const movies = await prisma.movie.findMany({
    skip: 2000, // Skip the first 2000 records
    take: 1000,  // Fetch top 1000 movies
    orderBy: {
      releaseDate: 'desc',
    },
  });

  for (const movie of movies) {
    try {
      const omdbResponse = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}`);
      const omdbData = omdbResponse.data;

      // Parsing the runtime to get only the numeric part
      const runtime = omdbData.Runtime ? parseInt(omdbData.Runtime) : null;

      // Update the movie in the database with the new details
      await prisma.movie.update({
        where: {
          id: movie.id,
        },
        data: {
          title: omdbData.Title,
          language: omdbData.Language,
          director: omdbData.Director,
          writers: omdbData.Writer.split(', '),
          actors: omdbData.Actors.split(', '),
          plot: omdbData.Plot,
          imdbRating: omdbData.imdbRating ? parseFloat(omdbData.imdbRating) : null,
          posterUrl: omdbData.Poster,
          originalTitle: omdbData.Title, // Assuming originalTitle is the same as Title
          isAdult: omdbData.Rated === 'R' || omdbData.Rated === 'NC-17', // Adjust as necessary based on your criteria for isAdult
        },
      });

      console.log(`Updated movie:`,{
        title: omdbData.Title,
        releaseDate: new Date(omdbData.Released),
        runtime: runtime,
        genres: omdbData.Genre.split(', '),
        language: omdbData.Language,
        director: omdbData.Director,
        writers: omdbData.Writer.split(', '),
        actors: omdbData.Actors.split(', '),
        plot: omdbData.Plot,
        imdbRating: omdbData.imdbRating ? parseFloat(omdbData.imdbRating) : null,
        posterUrl: omdbData.Poster,
        originalTitle: omdbData.Title, // Assuming originalTitle is the same as Title
        isAdult: omdbData.Rated === 'R' || omdbData.Rated === 'NC-17', // Adjust as necessary based on your criteria for isAdult
      });
    } catch (error) {
      console.error(`Error updating movie: ${movie.title}`, error);
    }
  }
}

updateMovieDetails()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
