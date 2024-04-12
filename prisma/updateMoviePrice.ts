// prisma/updateMoviePrices.ts

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateMoviePrices() {
  const movies = await prisma.movie.findMany({
    take: 3000,
    orderBy: {
      releaseDate: 'desc',
    }, // Fetch the first 3000 movies
  });

  for (const movie of movies) {
    try {
      // Generate a random price between 100 and 500
      const randomPrice = Math.floor(Math.random() * 401) + 100;

      // Update the movie with the new price
      await prisma.movie.update({
        where: {
          id: movie.id,
        },
        data: {
          price: randomPrice,
        },
      });

      console.log(`Updated price for movie: ${movie.title} - New price: $${randomPrice}`);
    } catch (error) {
      console.error(`Error updating price for movie: ${movie.title}`, error);
    }
  }
}

updateMoviePrices()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
