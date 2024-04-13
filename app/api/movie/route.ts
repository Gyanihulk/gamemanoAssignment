import { NextResponse } from "next/server";
import { getMovies } from '@/actions/getMovies'; 
import { GetMovies } from "@/types";


export async function GET(request: Request) {
    try {
      // Extract query parameters from the request
      const url = new URL(request.url);
      const searchParams = new URLSearchParams(url.search);
  
      // Initialize an empty object for the search parameters
      const searchParamsObject: GetMovies = {};
  
      // Add parameters to the object only if they have a value
      const title = searchParams.get('title');
      if (title) searchParamsObject.title = title;
  
      const genreName = searchParams.get('genreName');
      if (genreName) searchParamsObject.genreName = genreName;
  
      const language = searchParams.get('language');
      if (language) searchParamsObject.language = language;
  
      const director = searchParams.get('director');
      if (director) searchParamsObject.director = director;
  
      const actorsQueryParam = searchParams.get('actors');
      if (actorsQueryParam) searchParamsObject.actors = actorsQueryParam.split(',');
  
      const imdbRatingQueryParam = searchParams.get('imdbRating');
      if (imdbRatingQueryParam) searchParamsObject.imdbRating = Number(imdbRatingQueryParam);

      // Call the getMovies function with the constructed search parameters
      const movies = await getMovies(searchParamsObject);
  
      // Send the movies as a JSON response
      return new NextResponse(JSON.stringify(movies), { status: 200 });
    } catch (error) {
      console.error('[GET_MOVIES_API]', error);
      return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
  }