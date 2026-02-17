import { useAppState } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";

export default function DashboardPage() {
  const { tasks, setTasks, events, setCopilotOpen } = useAppState();
  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const [quickAdd, setQuickAdd] = useState("");

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(24 * 60 + 37);
  const [timerRunning, setTimerRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimerSeconds((s) => {
        if (!timerRunning || s <= 0) return s;
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const timerMin = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const timerSec = String(timerSeconds % 60).padStart(2, "0");
  const timerPct = ((1 - timerSeconds / (25 * 60)) * 100).toFixed(1);

  const handleQuickAdd = () => {
    if (!quickAdd.trim()) return;
    setTasks((prev) => [{ id: Date.now(), name: quickAdd.trim(), meta: "Added now", priority: "med", done: false, notes: "" }, ...prev]);
    setQuickAdd("");
  };

  const toggleTask = (id: number) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-[26px] font-extrabold tracking-tight text-foreground">
            Good evening, <span className="text-primary">User</span> ☕
          </h1>
          <p className="text-[13px] text-fd-text3 mt-0.5">
            Tuesday, Feb 17 · {active.length} tasks open · Flow Score: <strong className="text-foreground">82</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold hover:bg-fd-bg4 hover:text-foreground transition-all">🎯 Focus Mode</button>
          <button onClick={() => setCopilotOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-fd-accent-hover hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20 transition-all">✨ AI Daily Brief</button>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-fd-blue/8 border border-primary/20 rounded-xl p-4 mb-5 flex items-start gap-3.5 animate-stagger">
        <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-base shrink-0">✦</div>
        <div>
          <div className="font-mono text-[9px] tracking-[2px] uppercase text-primary mb-1">AI Daily Insight</div>
          <p className="text-[13px] leading-relaxed text-fd-text2">
            {active.length} open tasks — focus on highest priority first. Productivity peaks 9–11 AM. Use the AI Copilot for planning help.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Tasks Done", value: done.length, color: "var(--fd-accent)", change: "↑ Today", up: true },
          { label: "Deep Work Hours", value: "3.2", color: "var(--fd-green)", change: "↑ 40min streak", up: true },
          { label: "Open Tasks", value: active.length, color: "var(--fd-blue)", change: "Active now", up: true },
          { label: "Flow Score", value: "82", color: "var(--fd-yellow)", change: "↓ 5 pts", up: false },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:border-border/50 transition-all cursor-default" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: `hsl(${stat.color})` }} />
            <div className="font-mono text-[9.5px] tracking-[1.5px] uppercase text-fd-text3 mb-2.5">{stat.label}</div>
            <div className="font-display text-[30px] font-extrabold leading-none mb-1.5" style={{ color: `hsl(${stat.color})` }}>{stat.value}</div>
            <div className={`text-[11.5px] ${stat.up ? "text-fd-green" : "text-fd-red"}`}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Today's Tasks */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-foreground">Today's Tasks</h3>
          </div>
          <div className="px-5 py-2">
            {active.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-start gap-3 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-fd-bg3 rounded transition-colors">
                <button onClick={() => toggleTask(t.id)} className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${t.done ? "bg-fd-green border-fd-green" : "border-border hover:border-fd-text2"}`}>
                  {t.done && <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-foreground">{t.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${t.priority === "high" ? "bg-fd-red" : t.priority === "med" ? "bg-fd-yellow" : "bg-fd-green"}`} />
                    <span className="font-mono text-[11px] text-fd-text3">{t.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-3.5">
            <input
              value={quickAdd}
              onChange={(e) => setQuickAdd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3"
              placeholder="+ Quick add task… (Enter to save)"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-foreground">Today's Schedule</h3>
            <span className="font-mono text-[9px] bg-fd-blue/12 text-fd-blue px-2 py-0.5 rounded-full">Feb 17</span>
          </div>
          <div className="px-5 py-2">
            {events.map((e, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-b-0 items-start">
                <div className="font-mono text-[9.5px] text-fd-text3 w-12 shrink-0 leading-snug mt-0.5">{e.date}<br />{e.time}</div>
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: e.color }} />
                <div>
                  <div className="text-[13px] font-semibold text-foreground">{e.name}</div>
                  <div className="text-[11.5px] text-fd-text3 mt-0.5">{e.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timer + Notifications row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-foreground">Focus Timer — Pomodoro</h3>
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${timerRunning ? "bg-fd-green/12 text-fd-green" : "bg-fd-yellow/12 text-fd-yellow"}`}>{timerRunning ? "Active" : "Paused"}</span>
          </div>
          <div className="px-5 py-4 text-center">
            <div className="font-mono text-[9px] tracking-[2px] text-fd-text3 uppercase mb-1">Session 3 of 4 — ML Assignment</div>
            <div className="font-display text-[56px] font-extrabold text-primary tracking-tighter leading-none my-3">{timerMin}:{timerSec}</div>
            <div className="bg-fd-bg3 rounded-full h-1.5 overflow-hidden mb-3.5">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${timerPct}%` }} />
            </div>
            <div className="flex gap-2 justify-center mb-3">
              <button onClick={() => setTimerRunning(!timerRunning)} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold hover:bg-fd-bg4 transition-all">
                {timerRunning ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button onClick={() => { setTimerSeconds(25 * 60); setTimerRunning(true); }} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold hover:bg-fd-bg4 transition-all">↺ Reset</button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-foreground">Smart Notifications</h3>
            <span className="font-mono text-[9px] bg-gradient-to-r from-primary to-fd-yellow text-primary-foreground px-2 py-0.5 rounded-full">AI Filtered</span>
          </div>
          <div className="px-5 py-3 space-y-2.5">
            {[
              { emoji: "📧", text: <><strong>Prof. Sharma</strong> replied — Use learning rate decay.</>, time: "9 min ago", highlight: true },
              { emoji: "📝", text: <><strong>Meeting summary ready</strong> — 12:30 standup. 3 action items.</>, time: "2h ago", highlight: false },
              { emoji: "🔔", text: <><strong>3 PM deadline</strong> — ML Assignment #3 is 87% done.</>, time: "Auto", highlight: false },
            ].map((n, i) => (
              <div key={i} className={`rounded-lg p-3 flex gap-2.5 cursor-pointer transition-colors ${n.highlight ? "bg-primary/10 border border-primary/20" : "bg-fd-bg3"}`}>
                <span className="text-lg">{n.emoji}</span>
                <div>
                  <div className="text-[12.5px] text-foreground">{n.text}</div>
                  <div className="font-mono text-[10px] text-fd-text3 mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
