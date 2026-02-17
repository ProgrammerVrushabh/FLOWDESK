import { useState } from "react";
import { useAppState, Task } from "@/context/AppContext";

export default function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { setTasks } = useAppState();
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("med");
  const [due, setDue] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    setTasks((prev) => [
      { id: Date.now(), name: name.trim(), meta: due ? `Due ${due}` : "Added now", priority, done: false, notes },
      ...prev,
    ]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card border border-border rounded-2xl p-7 w-full max-w-[480px] shadow-2xl animate-login-in">
        <h3 className="font-display text-lg font-extrabold text-foreground mb-5">Add New Task</h3>

        <div className="mb-4">
          <label className="block text-xs font-medium text-fd-text2 mb-1.5 tracking-wide">Task Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 font-body text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-fd-text3" placeholder="What needs to be done?" autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-fd-text2 mb-1.5 tracking-wide">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 font-body text-sm text-foreground outline-none focus:border-primary cursor-pointer">
              <option value="high">🔴 High</option>
              <option value="med">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-fd-text2 mb-1.5 tracking-wide">Due Date</label>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 font-body text-sm text-foreground outline-none focus:border-primary" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-fd-text2 mb-1.5 tracking-wide">Notes (optional)</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 font-body text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-fd-text3" placeholder="Additional details…" />
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg font-body text-[13px] font-semibold hover:bg-fd-bg4 hover:text-foreground transition-all">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body text-[13px] font-semibold hover:bg-fd-accent-hover transition-all">Add Task</button>
        </div>
      </div>
    </div>
  );
}
