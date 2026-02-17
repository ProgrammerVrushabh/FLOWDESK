import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import LoginPage from "@/pages/LoginPage";
import { AppProvider, useAppState } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CopilotPanel from "@/components/CopilotPanel";
import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import CalendarPage from "@/pages/CalendarPage";
import NotesPage from "@/pages/NotesPage";
import SettingsPage from "@/pages/SettingsPage";

function AppContent() {
  const { currentPage, sidebarOpen, copilotOpen, setCopilotOpen } = useAppState();

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCopilotOpen(true); }
      if (e.key === "Escape") setCopilotOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCopilotOpen]);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage />;
      case "tasks": return <TasksPage />;
      case "calendar": return <CalendarPage />;
      case "notes": return <NotesPage />;
      case "settings": return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen relative z-[1]">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-[260px]" : "ml-0"}`}>
        <Topbar />
        <main className="flex-1">{renderPage()}</main>
      </div>
      <CopilotPanel />
      {/* FAB */}
      {!copilotOpen && (
        <button
          onClick={() => setCopilotOpen(true)}
          className="fixed bottom-7 right-7 bg-primary text-primary-foreground rounded-3xl px-5 py-3 font-display text-[13.5px] font-bold flex items-center gap-2 shadow-xl shadow-primary/25 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl transition-all z-[400]"
        >
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-fab-pulse" />
          Ask AI
        </button>
      )}
    </div>
  );
}

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="font-display text-2xl font-extrabold text-foreground animate-pulse">
          Flow<span className="text-primary">Desk</span>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPage />;

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
