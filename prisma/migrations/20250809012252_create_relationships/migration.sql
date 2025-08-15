/*
  Warnings:

  - Added the required column `gymId` to the `check_in` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `check_in` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."check_in" ADD COLUMN     "gymId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."check_in" ADD CONSTRAINT "check_in_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."check_in" ADD CONSTRAINT "check_in_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "public"."gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
