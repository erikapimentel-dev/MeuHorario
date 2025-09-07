// prisma/seed.js
const { PrismaClient, DiaDaSemana } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // -------------------------------
  // Professores
  // -------------------------------
  const profMaria = await prisma.professor.create({
    data: { nome: "Maria Silva" },
  });

  const profJoao = await prisma.professor.create({
    data: { nome: "João Souza" },
  });

  const profAna = await prisma.professor.create({
    data: { nome: "Ana Costa" },
  });

  // -------------------------------
  // Disponibilidades dos professores
  // -------------------------------
  await prisma.disponibilidade.createMany({
    data: [
      { professorId: profMaria.id, diaDaSemana: DiaDaSemana.SEGUNDA, periodo: 1 },
      { professorId: profMaria.id, diaDaSemana: DiaDaSemana.SEGUNDA, periodo: 2 },
      { professorId: profMaria.id, diaDaSemana: DiaDaSemana.QUARTA, periodo: 3 },

      { professorId: profJoao.id, diaDaSemana: DiaDaSemana.TERCA, periodo: 2 },
      { professorId: profJoao.id, diaDaSemana: DiaDaSemana.QUINTA, periodo: 4 },
      { professorId: profJoao.id, diaDaSemana: DiaDaSemana.SEXTA, periodo: 5 },

      { professorId: profAna.id, diaDaSemana: DiaDaSemana.SEGUNDA, periodo: 1 },
      { professorId: profAna.id, diaDaSemana: DiaDaSemana.QUARTA, periodo: 6 },
      { professorId: profAna.id, diaDaSemana: DiaDaSemana.SEXTA, periodo: 9 },
    ],
  });

  // -------------------------------
  // Turmas
  // -------------------------------
  const turma1 = await prisma.turma.create({
    data: { nome: "1º Ano A" },
  });

  const turma2 = await prisma.turma.create({
    data: { nome: "2º Ano B" },
  });

  // -------------------------------
  // Disciplinas
  // -------------------------------
  const discBio = await prisma.disciplina.create({
    data: {
      nome: "Biologia",
      cargaHoraria: 2,
      professorId: profMaria.id,
      turmaId: turma1.id,
    },
  });

  const discMat = await prisma.disciplina.create({
    data: {
      nome: "Matemática",
      cargaHoraria: 4,
      professorId: profJoao.id,
      turmaId: turma2.id,
    },
  });

  const discPort = await prisma.disciplina.create({
    data: {
      nome: "Português",
      cargaHoraria: 3,
      professorId: profAna.id,
      turmaId: turma1.id,
    },
  });

  // -------------------------------
  // Períodos (aulas da semana)
  // -------------------------------
  await prisma.periodo.createMany({
    data: [
      { diaDaSemana: DiaDaSemana.SEGUNDA, disciplinaId: discBio.id },
      { diaDaSemana: DiaDaSemana.QUARTA, disciplinaId: discBio.id },

      { diaDaSemana: DiaDaSemana.TERCA, disciplinaId: discMat.id },
      { diaDaSemana: DiaDaSemana.QUINTA, disciplinaId: discMat.id },
      { diaDaSemana: DiaDaSemana.SEXTA, disciplinaId: discMat.id },

      { diaDaSemana: DiaDaSemana.SEGUNDA, disciplinaId: discPort.id },
      { diaDaSemana: DiaDaSemana.QUARTA, disciplinaId: discPort.id },
    ],
  });

  // -------------------------------
  // Horários (slots atribuídos)
  // -------------------------------
  await prisma.horario.createMany({
    data: [
      { disciplinaId: discBio.id },
      { disciplinaId: discMat.id },
      { disciplinaId: discPort.id },
    ],
  });

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
