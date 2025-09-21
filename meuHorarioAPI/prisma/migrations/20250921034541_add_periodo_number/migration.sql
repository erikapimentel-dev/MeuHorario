/*
  Warnings:

  - Added the required column `periodo` to the `Periodo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Periodo" ADD COLUMN     "periodo" INTEGER NOT NULL;
