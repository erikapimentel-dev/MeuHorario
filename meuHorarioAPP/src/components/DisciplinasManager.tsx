import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Disciplina {
  id: number;
  nome: string;
  cargaHoraria: number;
  professor: string;
  turmas: string[];
  cor: string;
}

const DisciplinasManager = () => {
  const { toast } = useToast();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([
    { id: 1, nome: "Matemática", cargaHoraria: 5, professor: "Maria Silva", turmas: ["9A", "9B"], cor: "primary" },
    { id: 2, nome: "Português", cargaHoraria: 4, professor: "Ana Costa", turmas: ["9A", "1ºA"], cor: "secondary" },
    { id: 3, nome: "História", cargaHoraria: 3, professor: "João Santos", turmas: ["9A", "9B", "1ºA"], cor: "success" },
    { id: 4, nome: "Física", cargaHoraria: 4, professor: "Maria Silva", turmas: ["1ºA", "2ºA"], cor: "warning" },
    { id: 5, nome: "Química", cargaHoraria: 3, professor: "Carlos Oliveira", turmas: ["1ºA", "2ºA", "3ºA"], cor: "destructive" },
    { id: 6, nome: "Biologia", cargaHoraria: 3, professor: "Carlos Oliveira", turmas: ["9A", "1ºA"], cor: "primary" },
  ]);

  const professoresDisponiveis = ["Maria Silva", "Ana Costa", "João Santos", "Carlos Oliveira"];
  const turmasDisponiveis = ["9A", "9B", "1ºA", "1ºB", "2ºA", "2ºB", "3ºA", "3ºB"];
  const cores = ["primary", "secondary", "success", "warning", "destructive"];

  const [newDisciplina, setNewDisciplina] = useState({ 
    nome: "", 
    cargaHoraria: "", 
    professor: "", 
    turmas: [] as string[],
    cor: "primary"
  });
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDisciplina = () => {
    if (newDisciplina.nome && newDisciplina.cargaHoraria && newDisciplina.professor) {
      const disciplina: Disciplina = {
        id: Date.now(),
        nome: newDisciplina.nome,
        cargaHoraria: parseInt(newDisciplina.cargaHoraria),
        professor: newDisciplina.professor,
        turmas: newDisciplina.turmas,
        cor: newDisciplina.cor
      };
      setDisciplinas([...disciplinas, disciplina]);
      setNewDisciplina({ nome: "", cargaHoraria: "", professor: "", turmas: [], cor: "primary" });
      setIsDialogOpen(false);
      toast({
        title: "Disciplina adicionada",
        description: `${disciplina.nome} foi cadastrada com sucesso.`,
      });
    }
  };

  const handleEditDisciplina = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setNewDisciplina({
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria.toString(),
      professor: disciplina.professor,
      turmas: disciplina.turmas,
      cor: disciplina.cor
    });
    setIsDialogOpen(true);
  };

  const handleUpdateDisciplina = () => {
    if (editingDisciplina && newDisciplina.nome && newDisciplina.cargaHoraria && newDisciplina.professor) {
      const updatedDisciplina: Disciplina = {
        ...editingDisciplina,
        nome: newDisciplina.nome,
        cargaHoraria: parseInt(newDisciplina.cargaHoraria),
        professor: newDisciplina.professor,
        turmas: newDisciplina.turmas,
        cor: newDisciplina.cor
      };
      setDisciplinas(disciplinas.map(d => d.id === editingDisciplina.id ? updatedDisciplina : d));
      setEditingDisciplina(null);
      setNewDisciplina({ nome: "", cargaHoraria: "", professor: "", turmas: [], cor: "primary" });
      setIsDialogOpen(false);
      toast({
        title: "Disciplina atualizada",
        description: `${updatedDisciplina.nome} foi atualizada com sucesso.`,
      });
    }
  };

  const handleDeleteDisciplina = (id: number) => {
    const disciplina = disciplinas.find(d => d.id === id);
    setDisciplinas(disciplinas.filter(d => d.id !== id));
    toast({
      title: "Disciplina removida",
      description: `${disciplina?.nome} foi removida do sistema.`,
      variant: "destructive",
    });
  };

  const resetDialog = () => {
    setEditingDisciplina(null);
    setNewDisciplina({ nome: "", cargaHoraria: "", professor: "", turmas: [], cor: "primary" });
    setIsDialogOpen(false);
  };

  const handleTurmaToggle = (turma: string) => {
    setNewDisciplina(prev => ({
      ...prev,
      turmas: prev.turmas.includes(turma) 
        ? prev.turmas.filter(t => t !== turma)
        : [...prev.turmas, turma]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Disciplinas</h2>
          <p className="text-muted-foreground">Gerencie as disciplinas da escola</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetDialog();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-secondary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDisciplina ? "Editar Disciplina" : "Nova Disciplina"}
              </DialogTitle>
              <DialogDescription>
                {editingDisciplina 
                  ? "Atualize as informações da disciplina."
                  : "Adicione uma nova disciplina ao sistema."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Disciplina</Label>
                <Input
                  id="nome"
                  value={newDisciplina.nome}
                  onChange={(e) => setNewDisciplina({...newDisciplina, nome: e.target.value})}
                  placeholder="Nome da disciplina"
                />
              </div>
              <div>
                <Label htmlFor="cargaHoraria">Carga Horária Semanal</Label>
                <Input
                  id="cargaHoraria"
                  type="number"
                  value={newDisciplina.cargaHoraria}
                  onChange={(e) => setNewDisciplina({...newDisciplina, cargaHoraria: e.target.value})}
                  placeholder="Horas por semana"
                />
              </div>
              <div>
                <Label htmlFor="professor">Professor</Label>
                <Select value={newDisciplina.professor} onValueChange={(value) => setNewDisciplina({...newDisciplina, professor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professoresDisponiveis.map((prof) => (
                      <SelectItem key={prof} value={prof}>
                        {prof}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Turmas</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {turmasDisponiveis.map((turma) => (
                    <Button
                      key={turma}
                      type="button"
                      variant={newDisciplina.turmas.includes(turma) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTurmaToggle(turma)}
                    >
                      {turma}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Select value={newDisciplina.cor} onValueChange={(value) => setNewDisciplina({...newDisciplina, cor: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cores.map((cor) => (
                      <SelectItem key={cor} value={cor}>
                        {cor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Cancelar
              </Button>
              <Button 
                onClick={editingDisciplina ? handleUpdateDisciplina : handleAddDisciplina}
                className="bg-gradient-secondary hover:opacity-90"
              >
                {editingDisciplina ? "Atualizar" : "Adicionar"}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDisciplina(disciplina)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDisciplina(disciplina.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
              <CardDescription>
                {disciplina.cargaHoraria}h/semana • {disciplina.professor}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Turmas:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {disciplina.turmas.map((turma, index) => (
                      <Badge key={index} variant="outline">
                        {turma}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Cor do tema:</Label>
                  <Badge variant={disciplina.cor as any}>
                    {disciplina.cor}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisciplinasManager;