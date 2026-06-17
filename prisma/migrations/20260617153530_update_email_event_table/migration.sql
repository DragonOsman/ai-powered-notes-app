/*
  Warnings:

  - You are about to drop the column `type` on the `EmailEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailId]` on the table `EmailEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `EmailEvent` table without a default value. This is not possible if the table is not empty.
  - Made the column `emailId` on table `EmailEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmailEvent" DROP COLUMN "type",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "emailId" SET NOT NULL;

-- AlterTable
ALTER TABLE "twoFactor" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "EmailEvent_emailId_key" ON "EmailEvent"("emailId");
