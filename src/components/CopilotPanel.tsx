import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useAppState } from "@/context/AppContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_CHIPS = [
  { label: "📊 Daily summary", prompt: "Give me my daily summary" },
  { label: "📋 Due today", prompt: "What tasks are due today?" },
  { label: "🔍 Find sources", prompt: "Find sources for NLP survey" },
  { label: "📧 Draft email", prompt: "Draft a professional email to my professor" },
  { label: "🎯 Focus plan", prompt: "Suggest a focus schedule for today" },
];

export default function CopilotPanel() {
  const { copilotOpen, setCopilotOpen } = useAppState();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const msgsRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }, 50);
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect to AI");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
              scrollToBottom();
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `❌ ${e.message || "Something went wrong. Please try again."}` }]);
    }
    setIsLoading(false);
    scrollToBottom();
  };

  if (!copilotOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[500]" onClick={() => setCopilotOpen(false)} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-fd-sidebar border-l border-border z-[501] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              FlowDesk AI{" "}
              <span className="ml-1.5 inline-flex items-center font-mono text-[9px] tracking-wider bg-gradient-to-r from-primary to-fd-yellow text-primary-foreground px-2 py-0.5 rounded-full">
                SMART
              </span>
            </h3>
            <p className="font-mono text-[10px] text-fd-text3 mt-0.5">Your productivity copilot</p>
          </div>
          <button
            onClick={() => setCopilotOpen(false)}
            className="w-8 h-8 bg-fd-bg3 rounded-md flex items-center justify-center text-fd-text2 hover:bg-fd-bg4 hover:text-foreground transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div ref={msgsRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          {messages.length === 0 && (
            <div className="flex gap-2.5 animate-stagger">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">AI</div>
              <div>
                <div className="bg-fd-bg3 rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground max-w-[310px]">
                  Hi! 👋 I'm your FlowDesk AI copilot. I can help with tasks, research, emails, planning — or answer any question. What do you need?
                </div>
                <div className="font-mono text-[9px] text-fd-text3 mt-1">Just now</div>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-fd-blue text-primary-foreground"}`}>
                {msg.role === "assistant" ? "AI" : "U"}
              </div>
              <div className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[310px] ${msg.role === "user" ? "bg-primary/15 border border-primary/20 text-foreground" : "bg-fd-bg3 text-foreground"}`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">AI</div>
              <div className="bg-fd-bg3 rounded-xl px-3.5 py-2.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-fd-text3 animate-typing-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-fd-text3 animate-typing-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-fd-text3 animate-typing-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3.5 border-t border-border">
          <div className="flex gap-1.5 flex-wrap mb-2.5">
            {QUICK_CHIPS.map((c) => (
              <button
                key={c.label}
                onClick={() => send(c.prompt)}
                className="bg-fd-bg3 border border-border text-fd-text2 text-[10.5px] px-2.5 py-1 rounded-full hover:border-primary hover:text-primary hover:bg-primary/10 transition-all font-body whitespace-nowrap"
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about your work…"
              rows={1}
              className="flex-1 bg-fd-bg3 border border-border rounded-lg px-3 py-2.5 font-body text-[13px] text-foreground outline-none resize-none min-h-[40px] max-h-[100px] focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-fd-text3 transition-all"
            />
            <button
              onClick={() => send(input)}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-fd-accent-hover transition-all shrink-0 disabled:opacity-50"
            >
              <svg width="15" height="15" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
