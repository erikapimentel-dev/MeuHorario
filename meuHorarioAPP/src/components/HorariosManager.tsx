import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, Download } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface HorarioItem {
  disciplina: string;
  professor: string;
  turma: string;
  sala?: string;
}

type HorarioSemana = {
  [dia: string]: {
    [periodo: string]: HorarioItem | null;
  }
};

const HorariosManager = () => {
  const { toast } = useToast();
  const [turmaSelected, setTurmaSelected] = useState("9A");
  
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const periodos = ["1º Período", "2º Período", "3º Período", "4º Período", "5º Período", "6º Período"];
  const turmas = ["9A", "9B", "1ºA", "1ºB", "2ºA", "2ºB", "3ºA", "3ºB"];

  const [horarios, setHorarios] = useState<HorarioSemana>({
    "Segunda": {
      "1º Período": { disciplina: "Matemática", professor: "Maria Silva", turma: "9A", sala: "Sala 101" },
      "2º Período": { disciplina: "Português", professor: "Ana Costa", turma: "9A", sala: "Sala 102" },
      "3º Período": { disciplina: "História", professor: "João Santos", turma: "9A", sala: "Sala 103" },
      "4º Período": null,
      "5º Período": { disciplina: "Educação Física", professor: "Carlos Oliveira", turma: "9A", sala: "Quadra" },
      "6º Período": null,
    },
    "Terça": {
      "1º Período": { disciplina: "Física", professor: "Maria Silva", turma: "9A", sala: "Lab. Física" },
      "2º Período": { disciplina: "Química", professor: "Carlos Oliveira", turma: "9A", sala: "Lab. Química" },
      "3º Período": { disciplina: "Geografia", professor: "João Santos", turma: "9A", sala: "Sala 104" },
      "4º Período": { disciplina: "Literatura", professor: "Ana Costa", turma: "9A", sala: "Sala 102" },
      "5º Período": null,
      "6º Período": null,
    },
    "Quarta": {
      "1º Período": { disciplina: "Matemática", professor: "Maria Silva", turma: "9A", sala: "Sala 101" },
      "2º Período": { disciplina: "Biologia", professor: "Carlos Oliveira", turma: "9A", sala: "Lab. Biologia" },
      "3º Período": { disciplina: "Português", professor: "Ana Costa", turma: "9A", sala: "Sala 102" },
      "4º Período": { disciplina: "História", professor: "João Santos", turma: "9A", sala: "Sala 103" },
      "5º Período": null,
      "6º Período": null,
    },
    "Quinta": {
      "1º Período": { disciplina: "Geografia", professor: "João Santos", turma: "9A", sala: "Sala 104" },
      "2º Período": { disciplina: "Física", professor: "Maria Silva", turma: "9A", sala: "Lab. Física" },
      "3º Período": { disciplina: "Química", professor: "Carlos Oliveira", turma: "9A", sala: "Lab. Química" },
      "4º Período": { disciplina: "Literatura", professor: "Ana Costa", turma: "9A", sala: "Sala 102" },
      "5º Período": { disciplina: "Educação Física", professor: "Carlos Oliveira", turma: "9A", sala: "Quadra" },
      "6º Período": null,
    },
    "Sexta": {
      "1º Período": { disciplina: "Matemática", professor: "Maria Silva", turma: "9A", sala: "Sala 101" },
      "2º Período": { disciplina: "Português", professor: "Ana Costa", turma: "9A", sala: "Sala 102" },
      "3º Período": { disciplina: "Biologia", professor: "Carlos Oliveira", turma: "9A", sala: "Lab. Biologia" },
      "4º Período": null,
      "5º Período": null,
      "6º Período": null,
    },
  });

  const handleExportHorario = () => {
    toast({
      title: "Horário exportado",
      description: "O horário foi exportado com sucesso em formato PDF.",
    });
  };

  const getHorarios = () => periodos.map(periodo => ({
    periodo,
    aulas: diasSemana.map(dia => horarios[dia]?.[periodo] || null)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Horários</h2>
          <p className="text-muted-foreground">Visualize e gerencie os horários das turmas</p>
        </div>
        <div className="flex gap-4">
          <Select value={turmaSelected} onValueChange={setTurmaSelected}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((turma) => (
                <SelectItem key={turma} value={turma}>
                  {turma}
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
            Horário da Turma {turmaSelected}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground w-32">
                    <Clock className="inline mr-2 h-4 w-4" />
                    Período
                  </th>
                  {diasSemana.map((dia) => (
                    <th key={dia} className="text-center p-4 font-medium text-muted-foreground min-w-40">
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getHorarios().map((linha, index) => (
                  <tr key={linha.periodo} className={`border-b border-border ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                    <td className="p-4 font-medium text-primary">
                      {linha.periodo}
                    </td>
                    {linha.aulas.map((aula, aulaIndex) => (
                      <td key={aulaIndex} className="p-4 text-center">
                        {aula ? (
                          <div className="space-y-1">
                            <Badge variant="default" className="block w-full text-xs py-1">
                              {aula.disciplina}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {aula.professor}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {aula.sala}
                            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total de aulas:</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span>Períodos livres:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Professores envolvidos:</span>
                <span className="font-medium">4</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Otimizar distribuição de aulas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Verificar conflitos de salas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Confirmar disponibilidade
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">Disciplina</Badge>
                <span className="text-sm">Matéria</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Professor responsável
              </div>
              <div className="text-xs text-muted-foreground">
                Local da aula
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HorariosManager;