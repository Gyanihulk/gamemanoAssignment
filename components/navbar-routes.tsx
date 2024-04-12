"use client";


import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import CartSheet from "./cart/cart-sheet";

export const NavbarRoutes = () => {

  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  return (
    <div className="flex gap-x-2 ml-auto">
      {isAdmin ? (
        <Link href={"/"}>
          <Button size="sm" variant={"ghost"}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={"/admin"}>
          <Button size={"sm"} variant={"ghost"}>
            Admin Mode
          </Button>
        </Link>
      )}
      <CartSheet/>
<ThemeToggle/>
    </div>
  );
};
