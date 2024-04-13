"use client"
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  category: string;
}

export const MovieCard = ({
  id,
  title,
  imageUrl,
  price,
  category,
}: MovieCardProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    addToCart(id)
  };

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full ">
      <Link href={`/movie/${id}`} >
        <div className="block relative w-full aspect-video rounded-md overflow-hidden">
          <Image layout="fill" className="object-cover" alt={title} src={imageUrl} />
        </div>
      </Link>
      <div className="flex flex-row ">
        <div className="flex flex-col pt-2 ">
          <Link href={`/movie/${id}`} >
           
              <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                {title.length > 25 ? `${title.slice(0, 20)}...` : title}
              </div>
           
          </Link>
          <p className="text-xs text-muted-foreground">{category}</p>

          <p className="text-md md:text-sm font-medium text-slate-700">
            {formatPrice(price)}
          </p>
        </div>
        <Button onClick={onSubmit} className="ml-auto mt-3" variant="default">Add</Button>
      </div>
    </div>
  );
};
