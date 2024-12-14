/*
  Warnings:

  - You are about to drop the column `isTowFactorEnabled` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isTowFactorEnabled",
ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT true;
