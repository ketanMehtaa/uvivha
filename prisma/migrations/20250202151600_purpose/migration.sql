-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('Dating', 'Matrimony', 'Both');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instagramHandle" TEXT,
ADD COLUMN     "purpose" "Purpose";
