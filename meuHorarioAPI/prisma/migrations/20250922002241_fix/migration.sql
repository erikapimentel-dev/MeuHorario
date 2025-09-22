/*
  Warnings:

  - You are about to drop the column `isHorarioFixo` on the `Disciplina` table. All the data in the column will be lost.
  - You are about to drop the `HorarioFixo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Disciplina" DROP COLUMN "isHorarioFixo";

-- DropTable
DROP TABLE "public"."HorarioFixo";
