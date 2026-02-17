import { useState } from "react";
import { useAppState } from "@/context/AppContext";

export default function NotesPage() {
  const { notes, setNotes } = useAppState();
  const [filter, setFilter] = useState("all");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("General");

  const filtered = filter === "all" ? notes : notes.filter((n) => n.tag === filter);
  const tags = ["all", ...Array.from(new Set(notes.map((n) => n.tag)))];
  const editNote = notes.find((n) => n.id === editingNote);

  const addNote = () => {
    if (!newTitle.trim()) return;
    setNotes((prev) => [{ id: Date.now(), title: newTitle, excerpt: newContent.slice(0, 80), content: newContent, date: "Just now", tag: newTag, color: "hsl(var(--fd-accent))" }, ...prev]);
    setNewTitle(""); setNewContent(""); setShowAdd(false);
  };

  const deleteNote = (id: number) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="p-7">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-[26px] font-extrabold text-foreground tracking-tight">Notes & Docs</h1>
          <p className="text-[13px] text-fd-text3 mt-0.5">{notes.length} notes · AI-enhanced writing</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-fd-accent-hover transition-all">+ New Note</button>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {tags.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${filter === t ? "bg-primary text-primary-foreground" : "bg-fd-bg3 text-fd-text3 hover:text-foreground"}`}>
            {t === "all" ? "ALL" : t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((n) => (
          <div key={n.id} onClick={() => setEditingNote(n.id)} className="bg-card border border-border rounded-xl p-4.5 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-border/50 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: n.color }} />
            <div className="mb-1.5">
              <span className="bg-fd-bg3 text-fd-text3 text-[9px] font-mono px-2 py-0.5 rounded-full">{n.tag}</span>
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">{n.title}</h3>
            <p className="text-xs text-fd-text2 leading-relaxed">{n.excerpt}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-[9px] text-fd-text3">{n.date}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} className="opacity-0 group-hover:opacity-100 text-fd-text3 hover:text-fd-red transition-all text-xs">×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Note */}
      {editNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && setEditingNote(null)}>
          <div className="bg-card border border-border rounded-2xl p-7 w-full max-w-[600px] shadow-2xl animate-login-in">
            <h3 className="font-display text-lg font-extrabold text-foreground mb-4">{editNote.title}</h3>
            <textarea
              defaultValue={editNote.content}
              onChange={(e) => setNotes((prev) => prev.map((n) => n.id === editNote.id ? { ...n, content: e.target.value, excerpt: e.target.value.slice(0, 80) } : n))}
              className="w-full bg-fd-bg3 border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:border-primary min-h-[200px] resize-none font-body leading-relaxed"
            />
            <div className="flex justify-end mt-4">
              <button onClick={() => setEditingNote(null)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-fd-accent-hover transition-all">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="bg-card border border-border rounded-2xl p-7 w-full max-w-[480px] shadow-2xl animate-login-in">
            <h3 className="font-display text-lg font-extrabold text-foreground mb-5">New Note</h3>
            <div className="mb-4">
              <label className="block text-xs font-medium text-fd-text2 mb-1.5">Title</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3" placeholder="Note title" autoFocus />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-fd-text2 mb-1.5">Content</label>
              <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary min-h-[120px] resize-none placeholder:text-fd-text3" placeholder="Write your note…" />
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-fd-bg3 border border-border text-fd-text2 rounded-lg text-[13px] font-semibold">Cancel</button>
              <button onClick={addNote} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-fd-accent-hover transition-all">Create Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
