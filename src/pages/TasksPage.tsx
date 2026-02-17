import { useAppState, Task } from "@/context/AppContext";
import { useState } from "react";

function TaskItem({ task, prefix }: { task: Task; prefix: string }) {
  const { setTasks } = useAppState();

  const toggle = () => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
  const remove = () => setTasks((prev) => prev.filter((t) => t.id !== task.id));

  const priorityColor = task.priority === "high" ? "bg-fd-red" : task.priority === "med" ? "bg-fd-yellow" : "bg-fd-green";

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-b-0 hover:bg-fd-bg3 hover:px-2 hover:-mx-2 rounded-md transition-all cursor-pointer group">
      <button
        onClick={toggle}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
          task.done ? "bg-fd-green border-fd-green shadow-[0_0_0_3px_hsl(var(--fd-green)/0.2)]" : "border-border hover:border-fd-text2"
        }`}
      >
        {task.done && (
          <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-[13.5px] font-medium leading-snug ${task.done ? "line-through text-fd-text3" : "text-foreground"}`}>{task.name}</div>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <div className={`w-1.5 h-1.5 rounded-full ${priorityColor}`} />
          <span className="font-mono text-[11px] text-fd-text3">{task.meta}</span>
          {task.notes && <span className="bg-fd-bg3 text-fd-text3 text-[9px] font-mono px-1.5 py-0.5 rounded-full">{task.notes.slice(0, 30)}</span>}
        </div>
      </div>
      <button onClick={remove} className="opacity-0 group-hover:opacity-100 text-fd-text3 hover:text-fd-red transition-all text-sm px-1">×</button>
    </div>
  );
}

export default function TasksPage() {
  const { tasks, setTasks } = useAppState();
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [filter, setFilter] = useState<"all" | "high" | "med" | "low">("all");

  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const filtered = filter === "all" ? active : active.filter((t) => t.priority === filter);

  const sortTasks = () => {
    const order = { high: 0, med: 1, low: 2 };
    setTasks((prev) => [...prev].sort((a, b) => Number(a.done) - Number(b.done) || order[a.priority] - order[b.priority]));
  };

  return (
    <div className="p-7">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-[26px] font-extrabold text-foreground tracking-tight">Task Board</h1>
          <p className="text-[13px] text-fd-text3 mt-0.5">{active.length} open · {done.length} completed</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode(viewMode === "list" ? "kanban" : "list")} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold hover:bg-fd-bg4 hover:text-foreground transition-all">
            {viewMode === "list" ? "⊞ Kanban" : "☰ List"}
          </button>
          <button onClick={sortTasks} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold hover:bg-fd-bg4 hover:text-foreground transition-all">↕ Sort</button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">Active Tasks</h3>
              <div className="flex gap-1.5">
                {(["all", "high", "med", "low"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-fd-bg3 text-fd-text3 hover:text-foreground"}`}>
                    {f === "all" ? "ALL" : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-5 py-2">
              {filtered.length > 0 ? filtered.map((t) => <TaskItem key={t.id} task={t} prefix="tasks" />) : <p className="text-fd-text3 text-[13px] py-3">No tasks match filter 🎉</p>}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">Completed</h3>
              <button onClick={() => setTasks((prev) => prev.filter((t) => !t.done))} className="text-[11px] text-fd-text3 hover:text-fd-red transition-colors">Clear done</button>
            </div>
            <div className="px-5 py-2">
              {done.length > 0 ? done.map((t) => <TaskItem key={t.id} task={t} prefix="done" />) : <p className="text-fd-text3 text-[13px] py-3">Nothing completed yet — let's go!</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "📋 To Do", items: active.filter((t) => t.priority !== "high") },
            { title: "⚡ In Progress", items: active.filter((t) => t.priority === "high") },
            { title: "✅ Done", items: done },
          ].map((col) => (
            <div key={col.title} className="bg-fd-bg2 border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-[13px] font-bold">{col.title}</h3>
                <span className="bg-fd-bg3 text-fd-text3 text-[9px] font-mono px-1.5 py-0.5 rounded-full">{col.items.length}</span>
              </div>
              <div className="p-3 flex flex-col gap-2.5 min-h-[100px]">
                {col.items.map((t) => (
                  <div key={t.id} onClick={() => setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))} className={`bg-card border border-border rounded-lg p-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:border-border/50 transition-all relative overflow-hidden`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${t.priority === "high" ? "bg-fd-red" : t.priority === "med" ? "bg-fd-yellow" : "bg-fd-green"}`} />
                    <div className={`text-[13px] font-semibold mb-1 ${t.done ? "line-through text-fd-text3" : ""}`}>{t.name}</div>
                    <div className="text-[11px] text-fd-text3">{t.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
