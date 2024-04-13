"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchInput } from "@/components/search-input";
import { MoviesList } from "@/components/movie-list";

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

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Construct the query string from searchParams
        const queryString = new URLSearchParams(searchParams as any).toString();
        const response = await axios.get(`/api/movie?${queryString}`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Handle error, possibly by setting an error state
      }
    };

    fetchMovies();
  }, [searchParams]); // Re-run the effect when searchParams change
  return (
    <>
      <div className="px-6 pt-6">
        <SearchInput  />
      </div>
      <div className="p-6 space-y-4">
        {movies.length==0?<>Loading</>:<MoviesList items={movies} />}
      </div>
    </>
  );
};

export default SearchPage;
