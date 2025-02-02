/*
  Warnings:

  - The values [Married] on the enum `MaritalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Community" ADD VALUE 'Other';

-- AlterEnum
BEGIN;
CREATE TYPE "MaritalStatus_new" AS ENUM ('Divorced', 'Widowed', 'NeverMarried');
ALTER TABLE "User" ALTER COLUMN "maritalStatus" TYPE "MaritalStatus_new" USING ("maritalStatus"::text::"MaritalStatus_new");
ALTER TABLE "User" ALTER COLUMN "maritalStatusPreference" TYPE "MaritalStatus_new" USING ("maritalStatusPreference"::text::"MaritalStatus_new");
ALTER TYPE "MaritalStatus" RENAME TO "MaritalStatus_old";
ALTER TYPE "MaritalStatus_new" RENAME TO "MaritalStatus";
DROP TYPE "MaritalStatus_old";
COMMIT;
