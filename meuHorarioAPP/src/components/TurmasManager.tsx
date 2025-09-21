// meuHorarioAPP/src/components/TurmasManager.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { GraduationCap, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Importando o serviço completo de turmas
import { findTurmas, addTurma, updateTurma, deleteTurma } from "../services/turmaService.js";

// Interface para corresponder aos dados da API
interface Turma {
  id: number;
  nome: string;
  disciplinas: any[]; // A API inclui um array de disciplinas
}

const TurmasManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [formData, setFormData] = useState({ nome: "" });

  // 1. BUSCAR (Read)
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['turmas'],
    queryFn: findTurmas,
  });
  const turmas: Turma[] = response?.data || [];

  // Função para invalidar a query e recarregar os dados
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['turmas'] });
  };

  // 2. ADICIONAR (Create)
  const addMutation = useMutation({
    mutationFn: addTurma,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma adicionada com sucesso." });
      invalidateAndRefetch();
      handleCloseDialog();
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: `Não foi possível adicionar a turma. ${err.message}`, variant: "destructive" });
    },
  });

  // 3. ATUALIZAR (Update)
  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; data: { nome: string }}) => updateTurma(variables.id, variables.data),
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma atualizada com sucesso." });
      invalidateAndRefetch();
      handleCloseDialog();
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: `Não foi possível atualizar a turma. ${err.message}`, variant: "destructive" });
    }
  });

  // 4. DELETAR (Delete)
  const deleteMutation = useMutation({
    mutationFn: deleteTurma,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma removida com sucesso." });
      invalidateAndRefetch();
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: `Não foi possível remover a turma. ${err.message}`, variant: "destructive" });
    }
  });
  
  // --- Funções Auxiliares para o Modal ---
  
  const openDialogForEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormData({ nome: turma.nome });
    setIsDialogOpen(true);
  };
  
  const openDialogForAdd = () => {
    setEditingTurma(null);
    setFormData({ nome: "" });
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTurma(null);
    setFormData({ nome: "" });
  };
  
  const handleSubmit = () => {
    if (editingTurma) {
      updateMutation.mutate({ id: editingTurma.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover esta turma? Todas as disciplinas associadas podem ser afetadas.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Carregando turmas...</div>;
  if (error) return <div>Ocorreu um erro ao buscar as turmas: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Turmas</h2>
          <p className="text-muted-foreground">Gerencie as turmas da escola</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90" onClick={openDialogForAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTurma ? "Editar Turma" : "Nova Turma"}</DialogTitle>
              <DialogDescription>
                {editingTurma ? "Atualize o nome da turma." : "Crie uma nova turma no sistema."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Turma</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: 9A, 1º Ano B"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
                {editingTurma ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turmas.map((turma) => (
          <Card key={turma.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <GraduationCap className="h-8 w-8 text-success" />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openDialogForEdit(turma)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(turma.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl">{turma.nome}</CardTitle>
              <CardDescription>
                {/* A API retorna o número de disciplinas associadas */}
                {turma.disciplinas.length} {turma.disciplinas.length === 1 ? 'disciplina' : 'disciplinas'}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TurmasManager;