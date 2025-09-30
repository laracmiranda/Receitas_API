/*
  Warnings:

  - You are about to drop the column `servings` on the `recipes` table. All the data in the column will be lost.
  - Added the required column `portions` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."recipes" DROP COLUMN "servings",
ADD COLUMN     "portions" INTEGER NOT NULL;
