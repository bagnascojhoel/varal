-- CreateTable
CREATE TABLE "DryingSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "DryingSession_category_startedAt_idx" ON "DryingSession"("category", "startedAt");
