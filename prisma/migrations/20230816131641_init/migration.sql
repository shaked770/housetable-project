-- CreateTable
CREATE TABLE "House" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "currentValue" REAL NOT NULL,
    "loanAmount" REAL NOT NULL,
    "risk" REAL
);
