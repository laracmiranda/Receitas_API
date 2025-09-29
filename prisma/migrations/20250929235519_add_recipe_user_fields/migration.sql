/*
  Warnings:

  - The `steps` column on the `recipes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `description` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prepTime` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servings` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."recipes" ADD COLUMN     "description" VARCHAR(150) NOT NULL,
ADD COLUMN     "difficulty" VARCHAR(20) NOT NULL,
ADD COLUMN     "prepTime" INTEGER NOT NULL,
ADD COLUMN     "servings" INTEGER NOT NULL,
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
DROP COLUMN "steps",
ADD COLUMN     "steps" TEXT[];

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "bio" VARCHAR(300);

-- CreateTable
CREATE TABLE "public"."ratings" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_recipeId_key" ON "public"."ratings"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
