/*
  Warnings:

  - Added the required column `category` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."recipes" ADD COLUMN     "category" VARCHAR(30) NOT NULL;
