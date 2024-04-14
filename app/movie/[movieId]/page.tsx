"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import axios from "axios";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Movie } from "@/types";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Icons } from "@/components/icons";

const MoviePage = ({ params }: { params: { movieId: string } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState<Movie>();
  const { movieId } = params;
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchOrderStatus = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/movie/${movieId}`);
        setMovie(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setError(error as any);
        setIsLoading(false);
      }
    };

    fetchOrderStatus();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!movie || !movie.id || !movie.posterUrl || !movie.price) {
    return;
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToCart(movie?.id);
  };
  return (
    <div>
      <Card className="w-[600px]">
        <CardHeader className="flex flex-row align-bottom">
          <p className="text-2xl font-semibold text-center">{movie?.title}</p>
          <Button onClick={onSubmit} className="ml-auto mt-3" variant="default">
            Add
          </Button>
        </CardHeader>
        <CardContent className="flex justify-center gap-3 ">
          <div className="bg-muted">
            <Image
              src={movie?.posterUrl}
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full  dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <Card x-chunk="m-3 h-ful">
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Genres</p>
                </div>
                <div className="ml-auto font-medium">{movie?.genres}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Language</p>
                </div>
                <div className="ml-auto font-medium">{movie?.language}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Director</p>
                </div>
                <div className="ml-auto font-medium">{movie?.director}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Actors</p>
                </div>
                <div className="ml-auto font-medium">{movie?.actors}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Price</p>
                </div>
                <div className="ml-auto font-medium">
                  {formatPrice(movie?.price)}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoviePage;
