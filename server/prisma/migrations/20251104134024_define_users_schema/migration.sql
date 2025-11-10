/*
  Warnings:

  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingNeg` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingPos` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BIDDER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "ratingNeg" INTEGER NOT NULL,
ADD COLUMN     "ratingPos" INTEGER NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL;
