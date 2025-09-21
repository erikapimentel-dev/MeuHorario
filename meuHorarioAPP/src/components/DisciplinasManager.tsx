// meuHorarioAPP/src/components/DisciplinasManager.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Importando os serviços necessários
import { findDisciplinas, addDisciplina, updateDisciplina, deleteDisciplina } from "../services/disciplinaService.js";
import { findProfessores } from "../services/professorService.js";
import { findTurmas } from "../services/turmaService.js"; // Certifique-se que este serviço exista

// Interfaces para tipagem dos dados que vêm da API
interface Disciplina {
  id: number;
  nome: string;
  cargaHoraria: number;
  professor: { id: number; nome: string };
  turma: { id: number; nome: string };
}
interface Professor {
  id: number;
  nome: string;
}
interface Turma {
  id: number;
  nome: string;
}

const DisciplinasManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    nome: "",
    cargaHoraria: "",
    professorId: "",
    turmaId: ""
  });

  // 1. BUSCAR DADOS (Read)
  const { data: disciplinasResponse, isLoading: isLoadingDisciplinas } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: findDisciplinas,
  });
  const disciplinas: Disciplina[] = disciplinasResponse?.data || [];

  const { data: professoresResponse, isLoading: isLoadingProfessores } = useQuery({
    queryKey: ['professores'],
    queryFn: findProfessores,
  });
  const professores: Professor[] = professoresResponse?.data || [];

  const { data: turmasResponse, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ['turmas'],
    queryFn: findTurmas,
  });
  const turmas: Turma[] = turmasResponse?.data || [];

  // Função para invalidar queries e recarregar os dados
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
  };

  // 2. ADICIONAR (Create)
  const addMutation = useMutation({
    mutationFn: addDisciplina,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Disciplina adicionada com sucesso." });
      invalidateAndRefetch();
      handleCloseDialog();
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: `Não foi possível adicionar a disciplina. ${err.message}`, variant: "destructive" });
    },
  });

  // 3. ATUALIZAR (Update)
  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; data: any }) => updateDisciplina(variables.id, variables.data),
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Disciplina atualizada com sucesso." });
      invalidateAndRefetch();
      handleCloseDialog();
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: `Não foi possível atualizar a disciplina. ${err.message}`, variant: "destructive" });
    }
  });

  // 4. DELETAR (Delete)
  const deleteMutation = useMutation({
    mutationFn: deleteDisciplina,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Disciplina removida com sucesso." });
      invalidateAndRefetch();
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: `Não foi possível remover a disciplina. ${err.message}`, variant: "destructive" });
    }
  });

  // --- Funções do Modal e Formulário ---

  const handleOpenDialog = (disciplina: Disciplina | null) => {
    setEditingDisciplina(disciplina);
    if (disciplina) {
      setFormData({
        nome: disciplina.nome,
        cargaHoraria: String(disciplina.cargaHoraria),
        professorId: String(disciplina.professor.id),
        turmaId: String(disciplina.turma.id)
      });
    } else {
      setFormData({ nome: "", cargaHoraria: "", professorId: "", turmaId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDisciplina(null);
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      cargaHoraria: parseInt(formData.cargaHoraria, 10),
      professorId: parseInt(formData.professorId, 10),
      turmaId: parseInt(formData.turmaId, 10),
    };

    if (editingDisciplina) {
      updateMutation.mutate({ id: editingDisciplina.id, data: payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover esta disciplina?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoadingDisciplinas || isLoadingProfessores || isLoadingTurmas) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Disciplinas</h2>
          <p className="text-muted-foreground">Gerencie as disciplinas da escola</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-secondary hover:opacity-90" onClick={() => handleOpenDialog(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDisciplina ? "Editar Disciplina" : "Nova Disciplina"}</DialogTitle>
              <DialogDescription>Preencha as informações da disciplina.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Disciplina</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="cargaHoraria">Carga Horária Semanal</Label>
                <Input id="cargaHoraria" type="number" value={formData.cargaHoraria} onChange={(e) => setFormData({...formData, cargaHoraria: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="professor">Professor</Label>
                <Select value={formData.professorId} onValueChange={(value) => setFormData({...formData, professorId: value})}>
                  <SelectTrigger><SelectValue placeholder="Selecione um professor" /></SelectTrigger>
                  <SelectContent>
                    {professores.map((prof) => (
                      <SelectItem key={prof.id} value={String(prof.id)}>{prof.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="turma">Turma</Label>
                <Select value={formData.turmaId} onValueChange={(value) => setFormData({...formData, turmaId: value})}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma turma" /></SelectTrigger>
                  <SelectContent>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={String(turma.id)}>{turma.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
                {editingDisciplina ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplinas.map((disciplina) => (
          <Card key={disciplina.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-secondary" />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(disciplina)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(disciplina.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
              <CardDescription>{disciplina.cargaHoraria}h/semana • {disciplina.professor.nome}</CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium">Turma:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="outline">{disciplina.turma.nome}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisciplinasManager;