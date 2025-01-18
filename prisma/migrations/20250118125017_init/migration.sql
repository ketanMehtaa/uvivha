-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "location" TEXT,
    "bio" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "otplessUserId" TEXT,
    "otplessToken" TEXT,
    "height" DOUBLE PRECISION,
    "education" TEXT,
    "occupation" TEXT,
    "income" TEXT,
    "maritalStatus" TEXT,
    "religion" TEXT,
    "caste" TEXT,
    "motherTongue" TEXT,
    "agePreferenceMin" INTEGER,
    "agePreferenceMax" INTEGER,
    "heightPreferenceMin" DOUBLE PRECISION,
    "heightPreferenceMax" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_otplessUserId_key" ON "User"("otplessUserId");
