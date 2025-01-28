/*
  Warnings:

  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maritalStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maritalStatusPreference` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `complexion` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `familyType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Community" AS ENUM ('Garhwali', 'Kumaoni', 'Jaunsari');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Married', 'Divorced', 'Widowed', 'NeverMarried');

-- CreateEnum
CREATE TYPE "Complexion" AS ENUM ('NONE', 'VERY_FAIR', 'FAIR', 'WHEATISH', 'DARK');

-- CreateEnum
CREATE TYPE "FamilyType" AS ENUM ('Nuclear', 'Joint');

-- CreateEnum
CREATE TYPE "LivingWith" AS ENUM ('Alone', 'WithFamily', 'SharedAccommodation', 'Other');

-- CreateEnum
CREATE TYPE "Manglik" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "Horoscope" AS ENUM ('Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces');

-- CreateEnum
CREATE TYPE "Gotra" AS ENUM ('Bhardwaj', 'Kashyap', 'Vashisth', 'Karki', 'Other');

-- CreateEnum
CREATE TYPE "OnBehalf" AS ENUM ('Self', 'Parents', 'Sister', 'Brother');

-- CreateEnum
CREATE TYPE "UttarakhandDistrict" AS ENUM ('ALMORA', 'BAGESHWAR', 'CHAMOLI', 'CHAMPAWAT', 'DEHRADUN', 'HARIDWAR', 'NAINITAL', 'PAURI', 'PITHORAGARH', 'RUDRAPRAYAG', 'TEHRI', 'UDHAM_SINGH_NAGAR', 'UTTARKASHI');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "community" "Community",
ADD COLUMN     "district" "UttarakhandDistrict",
ADD COLUMN     "gotra" "Gotra",
ADD COLUMN     "horoscope" "Horoscope",
ADD COLUMN     "livingWith" "LivingWith",
ADD COLUMN     "manglik" "Manglik",
ADD COLUMN     "onBehalf" "OnBehalf",
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus",
DROP COLUMN "maritalStatusPreference",
ADD COLUMN     "maritalStatusPreference" "MaritalStatus",
DROP COLUMN "complexion",
ADD COLUMN     "complexion" "Complexion",
DROP COLUMN "familyType",
ADD COLUMN     "familyType" "FamilyType";
