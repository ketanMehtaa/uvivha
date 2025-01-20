-- CreateTable
CREATE TABLE "ProfileShare" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastRenewedAt" TIMESTAMP(3),
    "renewalCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProfileShare_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileShare_token_key" ON "ProfileShare"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileShare_userId_key" ON "ProfileShare"("userId");

-- CreateIndex
CREATE INDEX "ProfileShare_userId_idx" ON "ProfileShare"("userId");

-- AddForeignKey
ALTER TABLE "ProfileShare" ADD CONSTRAINT "ProfileShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
