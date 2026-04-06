-- CreateTable
CREATE TABLE "Merge2048Stats" (
    "userId" TEXT NOT NULL,
    "bestMaxTile" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merge2048Stats_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Merge2048Stats" ADD CONSTRAINT "Merge2048Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Merge2048Stats_bestMaxTile_bestScore_idx" ON "Merge2048Stats"("bestMaxTile" DESC, "bestScore" DESC);
