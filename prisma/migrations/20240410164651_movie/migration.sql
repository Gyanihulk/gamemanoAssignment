/*
  Warnings:

  - Added the required column `is_admin` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'MERCHANT';

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "is_admin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "posterUrl" TEXT,
    "genres" TEXT[],
    "runtime" INTEGER,
    "language" TEXT,
    "director" TEXT,
    "writers" TEXT[],
    "actors" TEXT[],
    "plot" TEXT,
    "imdbRating" DOUBLE PRECISION,
    "imdbID" TEXT,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);
