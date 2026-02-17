import { useAppState } from "@/context/AppContext";

const NAV_ITEMS = [
  { page: "dashboard", label: "Dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { page: "tasks", label: "Tasks", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, badgeKey: "tasks" },
  { page: "calendar", label: "Calendar", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { page: "notes", label: "Notes & Docs", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M9 12h6m-6 4h4M5 8h14M3 5a2 2 0 012-2h14a2 2 0 012 2v16l-4-2-4 2-4-2-4 2V5z"/></svg> },
  { page: "settings", label: "Settings", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  tasks: "Task Board",
  calendar: "Calendar",
  notes: "Notes & Docs",
  settings: "Settings",
};

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, tasks, notes, setCopilotOpen } = useAppState();
  const activeTasks = tasks.filter((t) => !t.done).length;

  return (
    <nav
      className={`w-[260px] min-h-screen bg-fd-sidebar border-r border-border flex flex-col fixed left-0 top-0 bottom-0 z-[100] transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-[260px]"
      }`}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <div className="font-display text-[22px] font-extrabold tracking-tight text-foreground">
          Flow<span className="text-primary">Desk</span>
        </div>
        <div className="font-mono text-[9px] tracking-[2.5px] uppercase text-fd-text3 mt-0.5">
          AI Productivity Hub
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pt-3.5 pb-1.5 flex-1">
        <div className="font-mono text-[9px] tracking-[2px] uppercase text-fd-text3 px-2 mb-1">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer transition-all text-[13.5px] font-medium mb-0.5 relative ${
              currentPage === item.page
                ? "bg-primary/10 text-primary"
                : "text-fd-text2 hover:bg-fd-bg3 hover:text-foreground"
            }`}
          >
            {currentPage === item.page && (
              <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r bg-primary" />
            )}
            {item.icon}
            {item.label}
            {item.badgeKey === "tasks" && (
              <span className="ml-auto bg-primary text-primary-foreground text-[9px] font-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeTasks}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => setCopilotOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-fd-text2 hover:bg-fd-bg3 hover:text-foreground transition-all text-[13px]"
        >
          🤖 AI Copilot
          <span className="ml-auto font-mono text-[9px] opacity-50">⌘K</span>
        </button>
      </div>
    </nav>
  );
}

export { PAGE_TITLES };
