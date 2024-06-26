import { Movie } from "@prisma/client";

import { MovieCard } from "@/components/movie-card";


interface MoviesListProps {
  items: Movie[];
}

export const MoviesList = ({
  items
}: MoviesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <MovieCard
            key={item?.id}
            id={item?.id}
            title={item?.title}
            imageUrl={item?.posterUrl!}
            price={item?.price!}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Movies found
        </div>
      )}
    </div>
  )
}