-- CreateTable
CREATE TABLE "TapSessionState" (
    "id" INTEGER NOT NULL,
    "tapOpen" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TapSessionState_pkey" PRIMARY KEY ("id")
);

INSERT INTO "TapSessionState" ("id", "tapOpen") VALUES (1, true);
