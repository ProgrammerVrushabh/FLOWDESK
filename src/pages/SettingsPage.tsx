import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-7">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-[26px] font-extrabold text-foreground tracking-tight">Settings</h1>
          <p className="text-[13px] text-fd-text3 mt-0.5">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Notifications</h3>
            </div>
            <div className="px-5 py-2">
              {[
                { label: "Deadline Reminders", sub: "48h and 2h before due dates", on: true },
                { label: "Meeting Summaries", sub: "Auto-notify when summary is ready", on: true },
                { label: "Email Digest", sub: "Daily 8 AM priority summary", on: true },
                { label: "Team Updates", sub: "When teammates share knowledge", on: false },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-b-0 gap-4">
                  <div>
                    <div className="text-[13.5px] font-medium text-foreground">{r.label}</div>
                    <div className="text-[11.5px] text-fd-text3 mt-0.5">{r.sub}</div>
                  </div>
                  <label className="relative inline-block w-10 h-[22px] shrink-0">
                    <input type="checkbox" defaultChecked={r.on} className="sr-only peer" />
                    <div className="absolute inset-0 bg-fd-bg4 border border-border rounded-full peer-checked:bg-primary peer-checked:border-primary transition-colors cursor-pointer" />
                    <div className="absolute w-4 h-4 bg-primary-foreground rounded-full top-[3px] left-[3px] shadow peer-checked:translate-x-[18px] transition-transform" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {/* Focus & Privacy */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Focus & Privacy</h3>
            </div>
            <div className="px-5 py-2">
              {[
                { label: "Focus Mode DND", sub: "Block notifications during Pomodoro", on: true },
                { label: "Analytics Tracking", sub: "Help improve AI suggestions", on: true },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-b-0 gap-4">
                  <div>
                    <div className="text-[13.5px] font-medium text-foreground">{r.label}</div>
                    <div className="text-[11.5px] text-fd-text3 mt-0.5">{r.sub}</div>
                  </div>
                  <label className="relative inline-block w-10 h-[22px] shrink-0">
                    <input type="checkbox" defaultChecked={r.on} className="sr-only peer" />
                    <div className="absolute inset-0 bg-fd-bg4 border border-border rounded-full peer-checked:bg-primary peer-checked:border-primary transition-colors cursor-pointer" />
                    <div className="absolute w-4 h-4 bg-primary-foreground rounded-full top-[3px] left-[3px] shadow peer-checked:translate-x-[18px] transition-transform" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Out */}
          <button onClick={handleLogout} className="w-full px-4 py-3 bg-fd-red/10 border border-fd-red/20 text-fd-red rounded-xl text-[13px] font-semibold hover:bg-fd-red/20 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
