-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deactivatedByTeam" BOOLEAN DEFAULT false,
ADD COLUMN     "deactivatedReason" TEXT;
