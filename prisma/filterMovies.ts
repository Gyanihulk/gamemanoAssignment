const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const tsvFilePath = path.resolve('D:/new', 'title.basics.tsv');

const fileStream = fs.createReadStream(tsvFilePath, 'utf8');

let filteredMovies:any = [];

Papa.parse(fileStream, {
  header: true,
  skipEmptyLines: true,
  step: (result:any) => {
    const movie = result.data;
    const startYear = parseInt(movie.startYear, 10);
    if (startYear >= 2020) {
      filteredMovies.push(movie);
    }
  },
  complete: () => {
    // Convert the filtered data back to TSV format
    const updatedTSV = Papa.unparse(filteredMovies, {
      header: true,
      skipEmptyLines: true,
    });

    // Write the updated TSV content to a new file
    const newFilePath = path.resolve('D:/new', 'filteredMovies.tsv');
    fs.writeFileSync(newFilePath, updatedTSV, 'utf8');
    console.log('Filtered TSV file saved.');
  },
});
