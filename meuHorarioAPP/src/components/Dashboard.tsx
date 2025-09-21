// meuHorarioAPP/src/components/Dashboard.tsx

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, BookOpen, GraduationCap, Calendar, Plus } from "lucide-react";
import { Skeleton } from "./ui/skeleton"; // Importando o componente de Skeleton

// Importando todos os serviços necessários
import { findProfessores } from "../services/professorService.js";
import { findDisciplinas } from "../services/disciplinaService.js";
import { findTurmas } from "../services/turmaService.js";
import { findHorarios } from "../services/horarioService.js";

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  // 1. BUSCAR TODOS OS DADOS EM PARALELO
  const { data: professoresResponse, isLoading: isLoadingProfessores } = useQuery({
    queryKey: ['professores'],
    queryFn: findProfessores,
  });

  const { data: disciplinasResponse, isLoading: isLoadingDisciplinas } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: findDisciplinas,
  });

  const { data: turmasResponse, isLoading: isLoadingTurmas } = useQuery({
    queryKey: ['turmas'],
    queryFn: findTurmas,
  });

  const { data: horariosResponse, isLoading: isLoadingHorarios } = useQuery({
    queryKey: ['horarios'],
    queryFn: findHorarios,
  });

  const isLoading = isLoadingProfessores || isLoadingDisciplinas || isLoadingTurmas || isLoadingHorarios;

  // 2. PREPARAR OS DADOS PARA OS CARDS
  const stats = [
    {
      title: "Professores",
      value: professoresResponse?.data.length ?? 0,
      description: "Professores cadastrados",
      icon: Users,
      section: "professores"
    },
    {
      title: "Disciplinas", 
      value: disciplinasResponse?.data.length ?? 0,
      description: "Disciplinas ativas",
      icon: BookOpen,
      section: "disciplinas"
    },
    {
      title: "Turmas",
      value: turmasResponse?.data.length ?? 0, 
      description: "Turmas criadas",
      icon: GraduationCap,
      section: "turmas"
    },
    {
      title: "Horários",
      value: horariosResponse?.data.length ?? 0,
      description: "Horários gerados",
      icon: Calendar,
      section: "horarios"
    }
  ];

  const quickActions = [
    {
      title: "Novo Professor",
      description: "Cadastrar novo professor",
      action: () => onSectionChange("professores"),
      variant: "default" as const
    },
    {
      title: "Nova Disciplina", 
      description: "Adicionar disciplina",
      action: () => onSectionChange("disciplinas"),
      variant: "secondary" as const
    },
    {
      title: "Criar Turma",
      description: "Organizar nova turma", 
      action: () => onSectionChange("turmas"),
      variant: "outline" as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do sistema de horários</p>
        </div>
        <Button 
          onClick={() => onSectionChange("horarios")}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Ver Horários
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={stat.title}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => onSectionChange(stat.section)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-1/2" />
                ) : (
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant={action.variant}
                className="w-full justify-start"
                onClick={action.action}
              >
                <Plus className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Implementações</CardTitle>
            <CardDescription>
              Funcionalidades em desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Integração com banco de dados
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Sistema de autenticação
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Exportação de horários
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                Notificações automáticas
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;