// prisma/seed.ts

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const prisma = new PrismaClient();

async function seedMovies() {
  const tsvFilePath = path.resolve(__dirname, './filteredMovies.tsv'); 
  const fileContent = fs.readFileSync(tsvFilePath, 'utf8');

  Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    complete: async (result:any) => {
      for (const row of result.data) {
        const { tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres } = row;
        if (titleType === 'movie' && parseInt(startYear, 10) >= 2020) {
          try {
            await prisma.movie.create({
              data: {
                imdbID: tconst,
                title: primaryTitle,
                originalTitle,
                isAdult: isAdult === '1',
                releaseDate: new Date(`${startYear}-01-01`), // Approximate release date
                runtime: runtimeMinutes !== '\\N' ? parseInt(runtimeMinutes, 10) : null,
                genres: genres !== '\\N' ? genres.split(',') : [],
             
              },
            });
            console.log(`Added movie: ${primaryTitle}`);
          } catch (error) {
            console.error(`Error adding movie: ${primaryTitle}`, error);
          }
        }
      }
    },
  });
}

seedMovies()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
