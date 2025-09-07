-- CreateEnum
CREATE TYPE "public"."DiaDaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateTable
CREATE TABLE "public"."Professor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disponibilidade" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "diaDaSemana" "public"."DiaDaSemana" NOT NULL,
    "periodo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disponibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Turma" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disciplina" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Periodo" (
    "id" SERIAL NOT NULL,
    "diaDaSemana" "public"."DiaDaSemana" NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Horario" (
    "id" SERIAL NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Disponibilidade" ADD CONSTRAINT "Disponibilidade_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "public"."Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Disciplina" ADD CONSTRAINT "Disciplina_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "public"."Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Disciplina" ADD CONSTRAINT "Disciplina_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Periodo" ADD CONSTRAINT "Periodo_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "public"."Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Horario" ADD CONSTRAINT "Horario_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "public"."Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
