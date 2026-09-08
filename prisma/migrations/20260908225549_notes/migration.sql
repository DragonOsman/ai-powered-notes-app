/*
  Warnings:

  - The primary key for the `twoFactor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `verified` on table `twoFactor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "twoFactor_secret_idx";

-- AlterTable
ALTER TABLE "twoFactor" DROP CONSTRAINT "twoFactor_pkey",
ADD COLUMN     "failedVerificationCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "verified" SET NOT NULL,
ALTER COLUMN "verified" SET DEFAULT false,
ADD CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id");
