import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

import { SideBar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
const inter = Inter({ subsets: ["latin"] });
import { CartProvider } from "@/context/cart-context";
export const metadata: Metadata = {
  title: "Game Mano Movie assignment",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CartProvider>
              <Toaster position="top-center" />
              <div className="h-full ">
                <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                  <Navbar />
                </div>
                <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                  <SideBar />
                </div>
                <main className="md:pl-56 pt-[80px] h-full">{children}</main>
              </div>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
