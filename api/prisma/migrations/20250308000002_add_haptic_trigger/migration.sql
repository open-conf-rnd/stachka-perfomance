-- CreateTable
CREATE TABLE "HapticTrigger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "triggerKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HapticTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HapticTrigger_userId_triggerKey_key" ON "HapticTrigger"("userId", "triggerKey");

-- AddForeignKey
ALTER TABLE "HapticTrigger" ADD CONSTRAINT "HapticTrigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
