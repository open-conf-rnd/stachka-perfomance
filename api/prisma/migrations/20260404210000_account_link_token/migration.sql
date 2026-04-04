-- CreateTable
CREATE TABLE "AccountLinkToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "vkUserId" TEXT,
    "tgExtId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountLinkToken_token_key" ON "AccountLinkToken"("token");

-- CreateIndex
CREATE INDEX "AccountLinkToken_expiresAt_idx" ON "AccountLinkToken"("expiresAt");
