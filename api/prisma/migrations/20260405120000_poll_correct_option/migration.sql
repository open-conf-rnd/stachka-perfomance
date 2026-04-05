-- AlterTable
ALTER TABLE "Poll" ADD COLUMN "correctOptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Poll_correctOptionId_key" ON "Poll"("correctOptionId");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_correctOptionId_fkey" FOREIGN KEY ("correctOptionId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
