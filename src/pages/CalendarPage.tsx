import { useState } from "react";
import { useAppState } from "@/context/AppContext";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const EVENT_DAYS: Record<number, number[]> = { 1: [3, 7, 10, 14, 17, 18, 20, 22, 25] };

export default function CalendarPage() {
  const { events, setEvents } = useAppState();
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", time: "", type: "Meeting" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const evDays = EVENT_DAYS[month] || [];

  const prev = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const addEvent = () => {
    if (!newEvent.name.trim()) return;
    setEvents((prev) => [{ time: newEvent.time || "TBD", date: newEvent.date || "UPCOMING", name: newEvent.name, detail: newEvent.type, color: "hsl(var(--fd-blue))", type: newEvent.type }, ...prev]);
    setNewEvent({ name: "", date: "", time: "", type: "Meeting" });
    setShowAddEvent(false);
  };

  return (
    <div className="p-7">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-[26px] font-extrabold text-foreground tracking-tight">Calendar</h1>
          <p className="text-[13px] text-fd-text3 mt-0.5">{MONTHS[month]} {year} · Smart scheduling active</p>
        </div>
        <button onClick={() => setShowAddEvent(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-fd-accent-hover transition-all">+ Add Event</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <button onClick={prev} className="px-3 py-1 bg-fd-bg3 rounded-md text-fd-text2 hover:text-foreground transition-colors text-sm">←</button>
            <h3 className="font-display text-sm font-bold">{MONTHS[month]} {year}</h3>
            <button onClick={next} className="px-3 py-1 bg-fd-bg3 rounded-md text-fd-text2 hover:text-foreground transition-colors text-sm">→</button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center font-mono text-[9px] tracking-wider text-fd-text3 py-2 uppercase">{d}</div>
              ))}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`p${i}`} className="aspect-square flex items-center justify-center rounded-md text-xs text-fd-text3/40">{prevDays - firstDay + i + 1}</div>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const isToday = d === 17 && month === 1 && year === 2026;
                const hasEvent = evDays.includes(d);
                return (
                  <div key={d} className={`aspect-square flex items-center justify-center rounded-md text-xs cursor-pointer relative transition-all hover:bg-fd-bg3 ${isToday ? "bg-primary text-primary-foreground font-bold shadow-[0_0_0_3px_hsl(var(--fd-accent)/0.25)]" : "text-foreground"}`}>
                    {d}
                    {hasEvent && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isToday ? "bg-primary-foreground/60" : "bg-fd-blue"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="font-display text-sm font-bold text-foreground">Upcoming Events</h3>
          </div>
          <div className="px-5 py-2">
            {events.map((e, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-b-0 items-start">
                <div className="font-mono text-[9.5px] text-fd-text3 w-12 shrink-0">{e.date}<br />{e.time}</div>
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

      {showAddEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && setShowAddEvent(false)}>
          <div className="bg-card border border-border rounded-2xl p-7 w-full max-w-[480px] shadow-2xl animate-login-in">
            <h3 className="font-display text-lg font-extrabold text-foreground mb-5">Add Calendar Event</h3>
            <div className="mb-4">
              <label className="block text-xs font-medium text-fd-text2 mb-1.5">Event Name</label>
              <input value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3" placeholder="e.g. Team Standup" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-fd-text2 mb-1.5">Date</label>
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-fd-text2 mb-1.5">Time</label>
                <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold hover:bg-fd-bg4 transition-all">Cancel</button>
              <button onClick={addEvent} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-fd-accent-hover transition-all">Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
