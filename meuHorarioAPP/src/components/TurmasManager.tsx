import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { GraduationCap, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Turma {
  id: number;
  nome: string;
  serie: string;
  turno: string;
  numeroAlunos: number;
  disciplinas: string[];
  sala: string;
}

const TurmasManager = () => {
  const { toast } = useToast();
  const [turmas, setTurmas] = useState<Turma[]>([
    { 
      id: 1, 
      nome: "9A", 
      serie: "9º Ano", 
      turno: "Matutino", 
      numeroAlunos: 32,
      disciplinas: ["Matemática", "Português", "História", "Geografia"],
      sala: "Sala 101"
    },
    { 
      id: 2, 
      nome: "9B", 
      serie: "9º Ano", 
      turno: "Vespertino", 
      numeroAlunos: 28,
      disciplinas: ["Matemática", "Ciências", "História"],
      sala: "Sala 102"
    },
    { 
      id: 3, 
      nome: "1ºA", 
      serie: "1º Ano", 
      turno: "Matutino", 
      numeroAlunos: 35,
      disciplinas: ["Português", "Física", "Química", "Biologia"],
      sala: "Sala 201"
    },
    { 
      id: 4, 
      nome: "2ºA", 
      serie: "2º Ano", 
      turno: "Matutino", 
      numeroAlunos: 30,
      disciplinas: ["Física", "Química", "Matemática"],
      sala: "Sala 202"
    },
  ]);

  const series = ["6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º Ano", "2º Ano", "3º Ano"];
  const turnos = ["Matutino", "Vespertino", "Noturno"];
  const salas = ["Sala 101", "Sala 102", "Sala 103", "Sala 201", "Sala 202", "Sala 203"];
  const disciplinasDisponiveis = ["Matemática", "Português", "História", "Geografia", "Ciências", "Física", "Química", "Biologia"];

  const [newTurma, setNewTurma] = useState({ 
    nome: "", 
    serie: "", 
    turno: "",
    numeroAlunos: "",
    disciplinas: [] as string[],
    sala: ""
  });
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTurma = () => {
    if (newTurma.nome && newTurma.serie && newTurma.turno && newTurma.numeroAlunos && newTurma.sala) {
      const turma: Turma = {
        id: Date.now(),
        nome: newTurma.nome,
        serie: newTurma.serie,
        turno: newTurma.turno,
        numeroAlunos: parseInt(newTurma.numeroAlunos),
        disciplinas: newTurma.disciplinas,
        sala: newTurma.sala
      };
      setTurmas([...turmas, turma]);
      setNewTurma({ nome: "", serie: "", turno: "", numeroAlunos: "", disciplinas: [], sala: "" });
      setIsDialogOpen(false);
      toast({
        title: "Turma criada",
        description: `Turma ${turma.nome} foi criada com sucesso.`,
      });
    }
  };

  const handleEditTurma = (turma: Turma) => {
    setEditingTurma(turma);
    setNewTurma({
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno,
      numeroAlunos: turma.numeroAlunos.toString(),
      disciplinas: turma.disciplinas,
      sala: turma.sala
    });
    setIsDialogOpen(true);
  };

  const handleUpdateTurma = () => {
    if (editingTurma && newTurma.nome && newTurma.serie && newTurma.turno && newTurma.numeroAlunos && newTurma.sala) {
      const updatedTurma: Turma = {
        ...editingTurma,
        nome: newTurma.nome,
        serie: newTurma.serie,
        turno: newTurma.turno,
        numeroAlunos: parseInt(newTurma.numeroAlunos),
        disciplinas: newTurma.disciplinas,
        sala: newTurma.sala
      };
      setTurmas(turmas.map(t => t.id === editingTurma.id ? updatedTurma : t));
      setEditingTurma(null);
      setNewTurma({ nome: "", serie: "", turno: "", numeroAlunos: "", disciplinas: [], sala: "" });
      setIsDialogOpen(false);
      toast({
        title: "Turma atualizada",
        description: `Turma ${updatedTurma.nome} foi atualizada com sucesso.`,
      });
    }
  };

  const handleDeleteTurma = (id: number) => {
    const turma = turmas.find(t => t.id === id);
    setTurmas(turmas.filter(t => t.id !== id));
    toast({
      title: "Turma removida",
      description: `Turma ${turma?.nome} foi removida do sistema.`,
      variant: "destructive",
    });
  };

  const resetDialog = () => {
    setEditingTurma(null);
    setNewTurma({ nome: "", serie: "", turno: "", numeroAlunos: "", disciplinas: [], sala: "" });
    setIsDialogOpen(false);
  };

  const handleDisciplinaToggle = (disciplina: string) => {
    setNewTurma(prev => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(disciplina) 
        ? prev.disciplinas.filter(d => d !== disciplina)
        : [...prev.disciplinas, disciplina]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Turmas</h2>
          <p className="text-muted-foreground">Gerencie as turmas da escola</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetDialog();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTurma ? "Editar Turma" : "Nova Turma"}
              </DialogTitle>
              <DialogDescription>
                {editingTurma 
                  ? "Atualize as informações da turma."
                  : "Crie uma nova turma no sistema."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Turma</Label>
                  <Input
                    id="nome"
                    value={newTurma.nome}
                    onChange={(e) => setNewTurma({...newTurma, nome: e.target.value})}
                    placeholder="Ex: 9A, 1ºB"
                  />
                </div>
                <div>
                  <Label htmlFor="numeroAlunos">Nº de Alunos</Label>
                  <Input
                    id="numeroAlunos"
                    type="number"
                    value={newTurma.numeroAlunos}
                    onChange={(e) => setNewTurma({...newTurma, numeroAlunos: e.target.value})}
                    placeholder="30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="serie">Série</Label>
                <Select value={newTurma.serie} onValueChange={(value) => setNewTurma({...newTurma, serie: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a série" />
                  </SelectTrigger>
                  <SelectContent>
                    {series.map((serie) => (
                      <SelectItem key={serie} value={serie}>
                        {serie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="turno">Turno</Label>
                  <Select value={newTurma.turno} onValueChange={(value) => setNewTurma({...newTurma, turno: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {turnos.map((turno) => (
                        <SelectItem key={turno} value={turno}>
                          {turno}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sala">Sala</Label>
                  <Select value={newTurma.sala} onValueChange={(value) => setNewTurma({...newTurma, sala: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {salas.map((sala) => (
                        <SelectItem key={sala} value={sala}>
                          {sala}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Disciplinas</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {disciplinasDisponiveis.map((disciplina) => (
                    <Button
                      key={disciplina}
                      type="button"
                      variant={newTurma.disciplinas.includes(disciplina) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDisciplinaToggle(disciplina)}
                      className="text-xs"
                    >
                      {disciplina}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Cancelar
              </Button>
              <Button 
                onClick={editingTurma ? handleUpdateTurma : handleAddTurma}
                className="bg-gradient-primary hover:opacity-90"
              >
                {editingTurma ? "Atualizar" : "Criar"}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTurma(turma)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTurma(turma.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{turma.nome}</CardTitle>
                <Badge variant="outline">{turma.turno}</Badge>
              </div>
              <CardDescription>
                {turma.serie} • {turma.sala}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{turma.numeroAlunos} alunos</span>
                </div>
                <div>
                  <Label className="text-sm font-medium">Disciplinas:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {turma.disciplinas.slice(0, 3).map((disciplina, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {disciplina}
                      </Badge>
                    ))}
                    {turma.disciplinas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{turma.disciplinas.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TurmasManager;