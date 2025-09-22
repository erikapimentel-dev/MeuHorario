/*
  Warnings:

  - You are about to drop the `Periodo` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `periodo` on the `Disponibilidade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `diaDaSemana` to the `Horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodo` to the `Horario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PeriodoAula" AS ENUM ('P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9');

-- DropForeignKey
ALTER TABLE "public"."Periodo" DROP CONSTRAINT "Periodo_disciplinaId_fkey";

-- AlterTable
ALTER TABLE "public"."Disponibilidade" DROP COLUMN "periodo",
ADD COLUMN     "periodo" "public"."PeriodoAula" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Horario" ADD COLUMN     "diaDaSemana" "public"."DiaDaSemana" NOT NULL,
ADD COLUMN     "periodo" "public"."PeriodoAula" NOT NULL;

-- DropTable
DROP TABLE "public"."Periodo";
