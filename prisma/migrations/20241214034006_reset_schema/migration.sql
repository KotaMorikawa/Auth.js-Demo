-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
