import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Professor {
  id: number;
  name: string;
  disciplinas: string[];
  cargaHoraria: number;
}

const ProfessoresManager = () => {
  const { toast } = useToast();
  const [professores, setProfessores] = useState<Professor[]>([
    { id: 1, name: "Maria Silva", disciplinas: ["Matemática", "Física"], cargaHoraria: 40 },
    { id: 2, name: "João Santos", disciplinas: ["História", "Geografia"], cargaHoraria: 30 },
    { id: 3, name: "Ana Costa", disciplinas: ["Português", "Literatura"], cargaHoraria: 35 },
    { id: 4, name: "Carlos Oliveira", disciplinas: ["Química", "Biologia"], cargaHoraria: 40 },
  ]);

  const [newProfessor, setNewProfessor] = useState({ name: "", disciplinas: "", cargaHoraria: "" });
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProfessor = () => {
    if (newProfessor.name && newProfessor.disciplinas && newProfessor.cargaHoraria) {
      const professor: Professor = {
        id: Date.now(),
        name: newProfessor.name,
        disciplinas: newProfessor.disciplinas.split(",").map(d => d.trim()),
        cargaHoraria: parseInt(newProfessor.cargaHoraria)
      };
      setProfessores([...professores, professor]);
      setNewProfessor({ name: "", disciplinas: "", cargaHoraria: "" });
      setIsDialogOpen(false);
      toast({
        title: "Professor adicionado",
        description: `${professor.name} foi cadastrado com sucesso.`,
      });
    }
  };

  const handleEditProfessor = (professor: Professor) => {
    setEditingProfessor(professor);
    setNewProfessor({
      name: professor.name,
      disciplinas: professor.disciplinas.join(", "),
      cargaHoraria: professor.cargaHoraria.toString()
    });
    setIsDialogOpen(true);
  };

  const handleUpdateProfessor = () => {
    if (editingProfessor && newProfessor.name && newProfessor.disciplinas && newProfessor.cargaHoraria) {
      const updatedProfessor: Professor = {
        ...editingProfessor,
        name: newProfessor.name,
        disciplinas: newProfessor.disciplinas.split(",").map(d => d.trim()),
        cargaHoraria: parseInt(newProfessor.cargaHoraria)
      };
      setProfessores(professores.map(p => p.id === editingProfessor.id ? updatedProfessor : p));
      setEditingProfessor(null);
      setNewProfessor({ name: "", disciplinas: "", cargaHoraria: "" });
      setIsDialogOpen(false);
      toast({
        title: "Professor atualizado",
        description: `${updatedProfessor.name} foi atualizado com sucesso.`,
      });
    }
  };

  const handleDeleteProfessor = (id: number) => {
    const professor = professores.find(p => p.id === id);
    setProfessores(professores.filter(p => p.id !== id));
    toast({
      title: "Professor removido",
      description: `${professor?.name} foi removido do sistema.`,
      variant: "destructive",
    });
  };

  const resetDialog = () => {
    setEditingProfessor(null);
    setNewProfessor({ name: "", disciplinas: "", cargaHoraria: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Professores</h2>
          <p className="text-muted-foreground">Gerencie os professores da escola</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetDialog();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProfessor ? "Editar Professor" : "Novo Professor"}
              </DialogTitle>
              <DialogDescription>
                {editingProfessor 
                  ? "Atualize as informações do professor."
                  : "Adicione um novo professor ao sistema."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newProfessor.name}
                  onChange={(e) => setNewProfessor({...newProfessor, name: e.target.value})}
                  placeholder="Nome do professor"
                />
              </div>
              <div>
                <Label htmlFor="disciplinas">Disciplinas</Label>
                <Input
                  id="disciplinas"
                  value={newProfessor.disciplinas}
                  onChange={(e) => setNewProfessor({...newProfessor, disciplinas: e.target.value})}
                  placeholder="Disciplinas (separadas por vírgula)"
                />
              </div>
              <div>
                <Label htmlFor="cargaHoraria">Carga Horária</Label>
                <Input
                  id="cargaHoraria"
                  type="number"
                  value={newProfessor.cargaHoraria}
                  onChange={(e) => setNewProfessor({...newProfessor, cargaHoraria: e.target.value})}
                  placeholder="Horas por semana"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Cancelar
              </Button>
              <Button 
                onClick={editingProfessor ? handleUpdateProfessor : handleAddProfessor}
                className="bg-gradient-primary hover:opacity-90"
              >
                {editingProfessor ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professores.map((professor) => (
          <Card key={professor.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProfessor(professor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProfessor(professor.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{professor.name}</CardTitle>
              <CardDescription>
                Carga horária: {professor.cargaHoraria}h/semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Disciplinas:</Label>
                <div className="flex flex-wrap gap-2">
                  {professor.disciplinas.map((disciplina, index) => (
                    <Badge key={index} variant="secondary">
                      {disciplina}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfessoresManager;