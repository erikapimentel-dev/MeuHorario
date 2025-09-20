import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  GraduationCap,
  Home,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "professores", label: "Professores", icon: Users },
    { id: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { id: "turmas", label: "Turmas", icon: GraduationCap },
    { id: "horarios", label: "Horários", icon: Calendar },
  ];

  return (
    <Card className={`h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 rounded-none border-r border-l-0 border-t-0 border-b-0 bg-gradient-subtle`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-primary">Meu Horário</h1>
              <p className="text-sm text-muted-foreground">Sistema Escolar</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-primary/10"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'} ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-primary/10 text-foreground'
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <IconComponent className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
                {!isCollapsed && item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </Card>
  );
};

export default Sidebar;