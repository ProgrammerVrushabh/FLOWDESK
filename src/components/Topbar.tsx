import { useAppState } from "@/context/AppContext";
import { PAGE_TITLES } from "./Sidebar";
import AddTaskModal from "./AddTaskModal";
import { useState } from "react";

export default function Topbar() {
  const { currentPage, sidebarOpen, setSidebarOpen, setCopilotOpen } = useAppState();
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <>
      <div className="h-[60px] bg-fd-glass/85 backdrop-blur-xl border-b border-border flex items-center gap-3.5 px-7 sticky top-0 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-[34px] h-[34px] bg-fd-bg3 border border-border rounded-md flex items-center justify-center text-fd-text2 hover:bg-fd-bg4 hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="font-display text-base font-bold text-foreground whitespace-nowrap">
          {PAGE_TITLES[currentPage] || currentPage}
        </h2>

        <div className="flex-1 max-w-[400px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-fd-text3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="w-full bg-fd-bg3 border border-border rounded-lg py-2 px-3 pl-9 font-body text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-fd-text3 transition-all"
            placeholder="Search tasks, notes… (⌘K)"
            onFocus={() => setCopilotOpen(true)}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowAddTask(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body text-[13px] font-semibold hover:bg-fd-accent-hover hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            + Add Task
          </button>
        </div>
      </div>

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} />}
    </>
  );
}
