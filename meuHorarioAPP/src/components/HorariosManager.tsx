// meuHorarioAPP/src/components/HorariosManager.tsx

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, Download } from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Importando os serviços
import { findTurmas } from "../services/turmaService.js";
import { findDisciplinas } from "../services/disciplinaService.js";
import { findDisponibilidadesByProfessor } from "../services/disponibilidadeService.js";

// Interfaces de tipo
interface Horario {
  diaDaSemana: string;
  periodo: string; // ex: "P1", "P2"
}

type HorarioSemana = {
  [dia: string]: {
    [periodo: string]: Horario | null;
  }
};

interface Disciplina {
  id: number;
  nome: string;
  professor: { nome: string };
  turma: { id: number; nome: string };
  horarios: Horario[]; 
}

interface Turma {
  id: number;
  nome: string;
}

const HorariosManager = () => {
  const { toast } = useToast();
  
  // Estado para a turma selecionada no menu
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null);

  const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];
  const periodos = ["1º Período", "2º Período", "3º Período", "4º Período", "5º Período", "6º Período", "7º Período", "8º Período", "9º Período"];

  // 1. BUSCAR DADOS (Read)
  const { data: turmasResponse, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ['turmas'],
    queryFn: findTurmas,
  });
  const turmas: Turma[] = turmasResponse?.data || [];
  
  const { data: disciplinasResponse, isLoading: isLoadingDisciplinas } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: findDisciplinas,
  });
  const disciplinas: Disciplina[] = disciplinasResponse?.data || [];

  // Define a primeira turma como selecionada por padrão
  if (turmas.length > 0 && selectedTurmaId === null) {
    setSelectedTurmaId(String(turmas[0].id));
  }
  
  // 2. PROCESSAR DADOS para montar o horário
  const horarioDaTurma = useMemo<HorarioSemana>(() => {
    const horarioVazio: HorarioSemana = {};
    diasSemana.forEach(dia => {
      horarioVazio[dia] = {};
      periodos.forEach(p => {
        horarioVazio[dia][p] = null;
      });
    });

    if (!selectedTurmaId || disciplinas.length === 0) {
      return horarioVazio;
    }
    
    // Filtra as disciplinas da turma selecionada
    const disciplinasDaTurma = disciplinas.filter(d => String(d.turma.id) === selectedTurmaId);
        
    // Preenche o horário
    disciplinasDaTurma.forEach(disciplina => {
      // AJUSTE: Itera sobre 'horarios'
      disciplina.horarios.forEach(horarioInfo => {
        const dia = horarioInfo.diaDaSemana;
        // AJUSTE: Converte o enum ("P1") para o formato de chave da tabela ("1º Período")
        const periodoNum = parseInt(horarioInfo.periodo.replace('P', ''), 10);
        const periodoKey = `${periodoNum}º Período`;
        
        if (horarioVazio[dia] && horarioVazio[dia][periodoKey] === null) {
          horarioVazio[dia][periodoKey] = {
            disciplina: disciplina.nome,
            professor: disciplina.professor.nome,
            turma: disciplina.turma.nome,
          };
        }
      });
    });

    return horarioVazio;
  }, [selectedTurmaId, disciplinas, turmas]);


  const handleExportHorario = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A exportação de horários será implementada em breve.",
    });
  };
  
  // Prepara os dados para a renderização da tabela
  const getHorariosParaTabela = () => periodos.map(periodo => ({
    periodo,
    aulas: diasSemana.map(dia => horarioDaTurma[dia]?.[periodo] || null)
  }));
  
  const selectedTurmaNome = turmas.find(t => String(t.id) === selectedTurmaId)?.nome || "";

  if (isLoadingTurmas || isLoadingDisciplinas) {
    return <div>Carregando horários...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Horários</h2>
          <p className="text-muted-foreground">Visualize e gerencie os horários das turmas</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedTurmaId ?? ""} onValueChange={setSelectedTurmaId}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecione uma turma" />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((turma) => (
                <SelectItem key={turma.id} value={String(turma.id)}>
                  {turma.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExportHorario} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horário da Turma {selectedTurmaNome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground w-32">
                    <Clock className="inline mr-2 h-4 w-4" /> Período
                  </th>
                  {diasSemana.map((dia) => (
                    <th key={dia} className="text-center p-4 font-medium text-muted-foreground min-w-40 capitalize">
                      {dia.toLowerCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getHorariosParaTabela().map((linha, index) => (
                  <tr key={linha.periodo} className={`border-b border-border ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                    <td className="p-4 font-medium text-primary">{linha.periodo}</td>
                    {linha.aulas.map((aula, aulaIndex) => (
                      <td key={aulaIndex} className="p-4 text-center">
                        {aula ? (
                          <div className="space-y-1">
                            <Badge variant="default" className="block w-full text-xs py-1">{aula.disciplina}</Badge>
                            <div className="text-xs text-muted-foreground">{aula.professor}</div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">-</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorariosManager;