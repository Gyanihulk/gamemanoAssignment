import { SearchInput } from "@/components/searchInput";
import { MoviesList } from "@/components/movieList";
import { getMovies } from "@/actions/getMovies";

interface SearchPageProps {
  searchParams: {
    title?: string;
    genreName?: string;
    language?: string;
    director?: string;
    actors?: string[];
    imdbRating?: number;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const movies = await getMovies(searchParams);

  return (
    <>
      <div className="px-6 pt-6">
        <SearchInput searchParams={searchParams} />
      </div>
      <div className="p-6 space-y-4">
        <MoviesList items={movies} />
      </div>
    </>
  );
};

export default SearchPage;
