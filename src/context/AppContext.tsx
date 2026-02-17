import { useState, createContext, useContext, ReactNode } from "react";

export type Task = {
  id: number;
  name: string;
  meta: string;
  priority: "high" | "med" | "low";
  done: boolean;
  notes: string;
};

export type CalEvent = {
  time: string;
  date: string;
  name: string;
  detail: string;
  color: string;
  type: string;
};

export type Note = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tag: string;
  color: string;
};

type AppState = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  events: CalEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>>;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
};

const AppContext = createContext<AppState | null>(null);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, name: "Finish ML Assignment #3", meta: "Due 3:00 PM today", priority: "high", done: false, notes: "Questions 4 & 5 remaining" },
  { id: 2, name: "Prepare DSA Presentation", meta: "Due Feb 20", priority: "med", done: false, notes: "Graph algorithms — 15 slides" },
  { id: 3, name: "Research paper outline", meta: "Due Feb 25", priority: "low", done: false, notes: "NLP survey — find 8 sources" },
  { id: 4, name: "Submit internship application", meta: "Due Feb 18", priority: "high", done: false, notes: "Cover letter + resume" },
  { id: 5, name: "Read 3 NLP papers", meta: "Research queue", priority: "low", done: false, notes: "" },
  { id: 6, name: "Hackathon prototype (FlowDesk)", meta: "Active", priority: "med", done: false, notes: "UI + AI integration 68%" },
  { id: 7, name: "Morning standup notes", meta: "Completed", priority: "low", done: true, notes: "" },
  { id: 8, name: "Review PR #14 — classmate", meta: "Completed", priority: "low", done: true, notes: "" },
];

const INITIAL_EVENTS: CalEvent[] = [
  { time: "3:00 PM", date: "TODAY", name: "ML Assignment Deadline", detail: "Submit via portal", color: "hsl(var(--fd-red))", type: "Deadline" },
  { time: "10:00 AM", date: "FEB 18", name: "Internship Application Due", detail: "Cover letter + resume", color: "hsl(var(--fd-blue))", type: "Career" },
  { time: "2:00 PM", date: "FEB 20", name: "DSA Presentation", detail: "Room 204, Acad Block", color: "hsl(var(--fd-yellow))", type: "Academic" },
  { time: "All Day", date: "FEB 22", name: "InnovateFest Hackathon", detail: "Innovation Lab", color: "hsl(var(--fd-green))", type: "Event" },
];

const INITIAL_NOTES: Note[] = [
  { id: 1, title: "ML Lecture Notes — Feb 17", excerpt: "Gradient descent variants: SGD, Adam, RMSProp. Key insight: learning rate scheduling critical…", content: "# ML Lecture Notes\n\n## Gradient Descent Variants\n- **SGD**: Basic stochastic gradient descent\n- **Adam**: Adaptive moment estimation\n- **RMSProp**: Root mean square propagation\n\n## Key Insight\nLearning rate scheduling is critical for convergence.", date: "Today, 9:12 AM", tag: "Machine Learning", color: "hsl(var(--fd-accent))" },
  { id: 2, title: "Standup Summary — Team Apex", excerpt: "🤖 AI Summary: Sprint goal on track. Riya blocked on API integration…", content: "# Standup Summary\n\nSprint goal on track. Riya blocked on API integration. Action: Review auth module by EOD.", date: "Today, 12:45 PM", tag: "Team", color: "hsl(var(--fd-green))" },
  { id: 3, title: "NLP Survey — Research Notes", excerpt: "Transformer architectures: BERT, GPT, T5 comparison…", content: "# NLP Survey\n\n## Transformers\n- BERT: Bidirectional\n- GPT: Autoregressive\n- T5: Text-to-text", date: "Feb 15, 4:30 PM", tag: "Research", color: "hsl(var(--fd-blue))" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <AppContext.Provider value={{ tasks, setTasks, events, setEvents, notes, setNotes, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, copilotOpen, setCopilotOpen }}>
      {children}
    </AppContext.Provider>
  );
}
