/*
  Warnings:

  - You are about to drop the column `status` on the `EmailEvent` table. All the data in the column will be lost.
  - Added the required column `type` to the `EmailEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailEvent" DROP COLUMN "status",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "twoFactor" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();
