-- DropIndex
DROP INDEX "User_customerId_key";

-- CreateTable
CREATE TABLE "UserRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "runTime" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,

    CONSTRAINT "UserRecord_pkey" PRIMARY KEY ("id")
);
