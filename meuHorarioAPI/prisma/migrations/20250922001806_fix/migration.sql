-- AlterTable
ALTER TABLE "public"."Disciplina" ADD COLUMN     "isHorarioFixo" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."HorarioFixo" (
    "id" SERIAL NOT NULL,
    "nomeDisciplina" TEXT NOT NULL,
    "diaDaSemana" "public"."DiaDaSemana" NOT NULL,
    "periodo" "public"."PeriodoAula" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HorarioFixo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HorarioFixo_diaDaSemana_periodo_key" ON "public"."HorarioFixo"("diaDaSemana", "periodo");
