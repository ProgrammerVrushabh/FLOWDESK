import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !firstName) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
      <div className="w-full max-w-[440px] px-6 animate-login-in">
        <div className="bg-card border border-border rounded-3xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="font-display text-[32px] font-extrabold tracking-tight text-foreground">
              Flow<span className="text-primary">Desk</span>
            </div>
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-fd-text3 mt-1">
              AI Productivity Hub
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-fd-bg3 rounded-lg p-[3px] mb-7">
            <button onClick={() => { setTab("signin"); setError(""); }} className={`flex-1 text-center py-2 rounded-md text-[13px] font-medium transition-all ${tab === "signin" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-fd-text2"}`}>
              Sign In
            </button>
            <button onClick={() => { setTab("signup"); setError(""); }} className={`flex-1 text-center py-2 rounded-md text-[13px] font-medium transition-all ${tab === "signup" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-fd-text2"}`}>
              Create Account
            </button>
          </div>

          {error && (
            <div className="bg-fd-red/10 border border-fd-red/20 rounded-md px-3 py-2 text-xs text-fd-red mb-3">{error}</div>
          )}

          {tab === "signin" ? (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-fd-text2 mb-1.5 tracking-wide">Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-3 font-body text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-fd-text3 transition-all" type="email" placeholder="you@example.com" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-fd-text2 mb-1.5 tracking-wide">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-3 font-body text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-fd-text3 transition-all" type="password" placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSignIn()} />
              </div>
              <button onClick={handleSignIn} disabled={loading} className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-body text-[15px] font-semibold hover:bg-fd-accent-hover hover:-translate-y-px hover:shadow-xl hover:shadow-primary/20 transition-all mt-2 disabled:opacity-50">
                {loading ? "Signing in…" : "Sign In to FlowDesk"}
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-fd-text2 mb-1.5">First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-3 font-body text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3" placeholder="Arjun" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fd-text2 mb-1.5">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-3 font-body text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3" placeholder="Kumar" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-fd-text2 mb-1.5">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-3 font-body text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3" type="email" placeholder="you@example.com" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-fd-text2 mb-1.5">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-fd-bg3 border border-border rounded-lg px-3.5 py-3 font-body text-sm text-foreground outline-none focus:border-primary placeholder:text-fd-text3" type="password" placeholder="Create a strong password" onKeyDown={(e) => e.key === "Enter" && handleSignUp()} />
              </div>
              <button onClick={handleSignUp} disabled={loading} className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-body text-[15px] font-semibold hover:bg-fd-accent-hover hover:-translate-y-px hover:shadow-xl hover:shadow-primary/20 transition-all mt-2 disabled:opacity-50">
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
