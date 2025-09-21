// meuHorarioAPP/src/components/ProfessoresManager.tsx

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Users, Plus, Edit, Trash2, CalendarCheck } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { findProfessores, addProfessor, updateProfessor, deleteProfessor } from "../services/professorService.js";
import { findDisponibilidadesByProfessor, addDisponibilidade, deleteDisponibilidade } from "../services/disponibilidadeService.js";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";

// --- Interfaces ---
interface Professor {
  id: number;
  nome: string;
}
interface Disponibilidade {
  id: number;
  professorId: number;
  diaDaSemana: string;
  periodo: number;
}

// --- Componente da Grade de Disponibilidade (com as novas funcionalidades) ---
const AvailabilityGrid = ({ professor }: { professor: Professor }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];
  const periodos = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const { data: response, isLoading } = useQuery({
    queryKey: ['disponibilidades', professor.id],
    queryFn: () => findDisponibilidadesByProfessor(professor.id),
  });
  const disponibilidades: Disponibilidade[] = response?.data || [];
  
  const availabilityMap = useMemo(() => {
    const map = new Map<string, number>();
    disponibilidades.forEach(d => {
      map.set(`${d.diaDaSemana}-${d.periodo}`, d.id);
    });
    return map;
  }, [disponibilidades]);

  const addMutation = useMutation({
    mutationFn: addDisponibilidade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disponibilidades', professor.id] });
    },
    onError: () => toast({ title: "Erro", description: "Não foi possível adicionar a disponibilidade.", variant: "destructive" })
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteDisponibilidade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disponibilidades', professor.id] });
    },
    onError: () => toast({ title: "Erro", description: "Não foi possível remover a disponibilidade.", variant: "destructive" })
  });
  
  const handleAvailabilityChange = (dia: string, periodo: number) => {
    const key = `${dia}-${periodo}`;
    const disponibilidadeId = availabilityMap.get(key);

    if (disponibilidadeId) {
      deleteMutation.mutate(disponibilidadeId);
    } else {
      addMutation.mutate({ professorId: professor.id, diaDaSemana: dia, periodo });
    }
  };

  // NOVO: Função para marcar todos os horários
  const handleSelectAll = () => {
    diasSemana.forEach(dia => {
      periodos.forEach(periodo => {
        const key = `${dia}-${periodo}`;
        if (!availabilityMap.has(key)) {
          // Adiciona apenas os que não estão marcados
          addMutation.mutate({ professorId: professor.id, diaDaSemana: dia, periodo });
        }
      });
    });
    toast({ title: "Sucesso!", description: "Todas as disponibilidades foram marcadas." });
  };

  // NOVO: Função para desmarcar todos os horários
  const handleDeselectAll = () => {
    availabilityMap.forEach(disponibilidadeId => {
      deleteMutation.mutate(disponibilidadeId);
    });
    toast({ title: "Sucesso!", description: "Todas as disponibilidades foram desmarcadas." });
  };


  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  return (
    <>
      {/* NOVO: Botões de ação */}
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleSelectAll}>Marcar Todos</Button>
        <Button variant="outline" size="sm" onClick={handleDeselectAll}>Desmarcar Todos</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 font-medium text-muted-foreground">Período</th>
              {diasSemana.map(dia => <th key={dia} className="p-2 font-medium text-muted-foreground capitalize">{dia.toLowerCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {periodos.map(periodo => (
              <tr key={periodo} className="border-b">
                <td className="p-2 font-medium text-center">{periodo}º</td>
                {diasSemana.map(dia => (
                  <td key={dia} className="p-2 text-center">
                    <Checkbox
                      checked={availabilityMap.has(`${dia}-${periodo}`)}
                      onCheckedChange={() => handleAvailabilityChange(dia, periodo)}
                      disabled={addMutation.isPending || deleteMutation.isPending}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};


// --- Componente Principal (sem alterações, apenas para contexto) ---
const ProfessoresManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState({ nome: "" });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['professores'],
    queryFn: findProfessores,
  });
  const professores: Professor[] = response?.data || [];
  
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['professores'] });
  };

  const addMutation = useMutation({
    mutationFn: addProfessor,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Professor adicionado com sucesso." });
      invalidateAndRefetch();
      handleCloseDialogs();
    },
    onError: (err: any) => toast({ title: "Erro", description: `Não foi possível adicionar o professor. ${err.message}`, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; data: { nome: string }}) => updateProfessor(variables.id, variables.data),
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Professor atualizado com sucesso." });
      invalidateAndRefetch();
      handleCloseDialogs();
    },
    onError: (err: any) => toast({ title: "Erro", description: `Não foi possível atualizar o professor. ${err.message}`, variant: "destructive" })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfessor,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Professor removido com sucesso." });
      invalidateAndRefetch();
    },
    onError: (err: any) => toast({ title: "Erro", description: `Não foi possível remover o professor. ${err.message}`, variant: "destructive" })
  });
  
  const handleOpenFormDialog = (professor: Professor | null) => {
    setSelectedProfessor(professor);
    setFormData({ nome: professor ? professor.nome : "" });
    setIsFormOpen(true);
  };

  const handleOpenAvailabilityDialog = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsAvailabilityOpen(true);
  };
  
  const handleCloseDialogs = () => {
    setIsFormOpen(false);
    setIsAvailabilityOpen(false);
    setSelectedProfessor(null);
    setFormData({ nome: "" });
  };
  
  const handleSubmit = () => {
    if (selectedProfessor) {
      updateMutation.mutate({ id: selectedProfessor.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este professor?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Carregando professores...</div>;
  if (error) return <div>Ocorreu um erro ao buscar os professores: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Professores</h2>
          <p className="text-muted-foreground">Gerencie os professores da escola</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={() => handleOpenFormDialog(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Professor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professores.map((professor) => (
          <Card key={professor.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenAvailabilityDialog(professor)}>
                    <CalendarCheck className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenFormDialog(professor)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(professor.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{professor.nome}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Modal para Adicionar/Editar Professor */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProfessor ? "Editar Professor" : "Novo Professor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={formData.nome} onChange={(e) => setFormData({ nome: e.target.value })}/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialogs}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Disponibilidade */}
      <Dialog open={isAvailabilityOpen} onOpenChange={(open) => !open && handleCloseDialogs()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Disponibilidade de {selectedProfessor?.nome}</DialogTitle>
            <DialogDescription>Marque os períodos em que o professor está disponível para dar aulas.</DialogDescription>
          </DialogHeader>
          {selectedProfessor && <AvailabilityGrid professor={selectedProfessor} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessoresManager;