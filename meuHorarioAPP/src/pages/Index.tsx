import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/components/Dashboard";
import ProfessoresManager from "@/components/ProfessoresManager";
import DisciplinasManager from "@/components/DisciplinasManager";
import TurmasManager from "@/components/TurmasManager";
import HorariosManager from "@/components/HorariosManager";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "professores":
        return <ProfessoresManager />;
      case "disciplinas":
        return <DisciplinasManager />;
      case "turmas":
        return <TurmasManager />;
      case "horarios":
        return <HorariosManager />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;