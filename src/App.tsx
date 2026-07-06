import { useState, useEffect, useRef, lazy, Suspense } from "react";
import type { Account, AccentColor } from "./types";
import { useAppState } from "./storage";
import { genId, ACCENT_HEX } from "./utils";
import { AccountSwitcher } from "./components/AccountSwitcher";
import { ProfileModal } from "./components/ProfileModal";
import { WarpCalculator } from "./components/WarpCalculator";
const PullPlanner = lazy(() => import("./components/PullPlanner").then((m) => ({ default: m.PullPlanner })));
const TeamMaker   = lazy(() => import("./components/TeamMaker").then((m) => ({ default: m.TeamMaker })));
const Roster      = lazy(() => import("./components/Roster").then((m) => ({ default: m.Roster })));
import { BannerSidebar, BannerMobileStrip } from "./components/BannerStrip";
import { iconUrl } from "./data/characters";

type ViewTab = "warp" | "plan" | "teams" | "roster";
type Overlay = "none" | "profile" | "switcher";
type Theme = "dark" | "light";

const TABS: { id: ViewTab; label: string; icon: string }[] = [
  { id: "warp",   label: "Warp Calc", icon: "✦" },
  { id: "plan",   label: "Pull Plan", icon: "◈" },
  { id: "teams",  label: "Teams",     icon: "⬡" },
  { id: "roster", label: "Roster",    icon: "☆" },
];

function defaultAccount(id: string, name: string, accent: AccentColor): Account {
  return {
    id, name, accent,
    profileSlug: "",
    jades: 0,
    passes: 0,
    warp: {
      bannerKind: "new", charSlug: "", lcSlug: "",
      charPity: 0, charGuaranteed: false, currentEidolon: -1,
      lcPity: 0, lcGuaranteed: false, currentSuperimposition: 0,
      starlightRate: "average", phases: [],
    },
    pullPlan: { incomeLevel: "f2p", entries: [] },
    teams: [],
    roster: {},
  };
}

const QUICK_ADDS = [1, 5, 10, 20, 60];

function CurrencyBadge({ value, label, icon, color, onChange }: {
  value: number; label: string; icon?: string; color: string; onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const iconEl = icon
    ? <img src={icon} alt={label} className="w-4 h-4 object-contain shrink-0" />
    : <span className="text-xs font-medium shrink-0" style={{ color: `${color}cc` }}>{label}</span>;

  const commit = (v: number) => { if (!isNaN(v) && v >= 0) onChange(v); setOpen(false); };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setDraft(String(value)); setOpen((o) => !o); }}
        className="flex items-center gap-1.5 rounded-xl px-2 md:px-3 py-1.5 transition-all"
        style={{
          background: open ? `${color}18` : `${color}0e`,
          border: `1.5px solid ${open ? `${color}55` : `${color}28`}`,
          boxShadow: open ? `0 0 14px ${color}25` : "none",
        }}
      >
        {iconEl}
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value.toLocaleString()}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-[60] rounded-2xl p-3 flex flex-col gap-2.5"
          style={{ background: "var(--t-modal)", border: "1px solid var(--t-border0)", boxShadow: "0 16px 48px rgba(0,0,0,0.65)", minWidth: 230 }}>

          {/* Quick-add row */}
          <div className="flex gap-1.5">
            {QUICK_ADDS.map((n) => (
              <button key={n}
                onClick={() => onChange(value + n)}
                className="flex-1 rounded-xl py-2 text-xs font-bold transition-all"
                style={{ background: `${color}14`, color, border: `1px solid ${color}28` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${color}28`; e.currentTarget.style.borderColor = `${color}55`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${color}14`; e.currentTarget.style.borderColor = `${color}28`; }}
              >+{n}</button>
            ))}
          </div>

          {/* Exact-value input */}
          <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {iconEl}
            <input
              autoFocus
              type="number" value={draft} min={0}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit(parseInt(draft, 10));
                if (e.key === "Escape") setOpen(false);
              }}
              className="flex-1 w-0 bg-transparent text-sm font-bold tabular-nums outline-none"
              style={{ color }}
            />
            <button
              onClick={() => commit(parseInt(draft, 10))}
              className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
              style={{ background: `${color}20`, color }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${color}38`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${color}20`; }}
            >Set</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
      style={{ background: "var(--t-bg-subtle)", border: "1.5px solid var(--t-border1)", color: "var(--t-text1)" }}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}

function App() {
  const [state, setState] = useAppState();
  const [activeTab, setActiveTab] = useState<ViewTab>("warp");
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = (localStorage.getItem("hsr-theme") as Theme) || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    return saved;
  });

  useEffect(() => {
    localStorage.setItem("hsr-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const activeAccount = state.accounts.find((a) => a.id === state.activeAccountId);

  const updateAccount = (id: string, patch: Partial<Account>) =>
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));

  const handleSelectAccount = (id: string) => { setState((s) => ({ ...s, activeAccountId: id })); setActiveTab("warp"); setOverlay("none"); };
  const handleAdd = (name: string, accent: AccentColor) => {
    const id = genId("account");
    setState((s) => ({ accounts: [...s.accounts, defaultAccount(id, name, accent)], activeAccountId: id }));
    setOverlay("none"); setActiveTab("warp");
  };
  const handleRename = (id: string, name: string) => updateAccount(id, { name });
  const handleDelete = (id: string) =>
    setState((s) => {
      const accounts = s.accounts.filter((a) => a.id !== id);
      return { accounts, activeAccountId: s.activeAccountId === id ? accounts[0]?.id ?? "" : s.activeAccountId };
    });
  const handleProfileSave = (name: string, accent: AccentColor, profileSlug: string) => {
    if (activeAccount) updateAccount(activeAccount.id, { name, accent, profileSlug });
    setOverlay("none");
  };

  if (overlay === "switcher" || !activeAccount) {
    return (
      <div data-theme={theme}>
        <AccountSwitcher
          accounts={state.accounts} activeId={state.activeAccountId}
          onSelect={handleSelectAccount} onAdd={handleAdd}
          onRename={handleRename} onDelete={handleDelete}
        />
      </div>
    );
  }

  const accentHex = ACCENT_HEX[activeAccount.accent];
  const portraitSlug = activeAccount.profileSlug || activeAccount.warp.charSlug || Object.keys(activeAccount.roster ?? {})[0] || "";

  return (
    <div className="h-screen h-dvh flex flex-col overflow-hidden" data-theme={theme}>
      {/* ── Header ── */}
      <header className="relative flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 shrink-0"
        style={{ background: "var(--t-header)", borderBottom: "1px solid var(--t-border2)" }}>

        <h1 className="text-sm md:text-base font-bold text-gold tracking-wide shrink-0"
          style={{ textShadow: "0 0 16px rgba(240,204,114,0.25)" }}>
          HSR Tracker
        </h1>

        {/* Tabs — desktop centered */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 rounded-2xl p-1 gap-0.5"
          style={{ background: "var(--t-bg0)", border: "1.5px solid var(--t-border0)" }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm"
                style={{
                  background: active ? `${accentHex}22` : "transparent",
                  color: active ? accentHex : "var(--t-text2)",
                  fontWeight: active ? 600 : 400,
                  boxShadow: active ? `0 0 20px ${accentHex}30, inset 0 0 0 1px ${accentHex}35` : "none",
                  transform: active ? "translateY(-1px)" : "none",
                }}>
                <span className="text-[13px] leading-none" style={{ opacity: active ? 1 : 0.6 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <CurrencyBadge label="Jades" icon="/icons/misc/Item_Stellar_Jade.webp" value={activeAccount.jades} color="#a78bfa"
          onChange={(v) => updateAccount(activeAccount.id, { jades: v })} />
        <CurrencyBadge label="Passes" icon="/icons/misc/Star_Rail_Special_Pass.webp" value={activeAccount.passes} color="#f0cc72"
          onChange={(v) => updateAccount(activeAccount.id, { passes: v })} />

        <div className="hidden md:block w-px h-6 mx-1" style={{ background: "var(--t-border0)" }} />

        <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />

        <div className="hidden md:block w-px h-6 mx-1" style={{ background: "var(--t-border0)" }} />

        {/* Account pill */}
        <div className="flex items-center rounded-2xl overflow-hidden"
          style={{ background: "var(--t-bg2)", border: `1.5px solid ${accentHex}40` }}>
          <button onClick={() => setOverlay(overlay === "profile" ? "none" : "profile")}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 hover:brightness-110 transition-all">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl overflow-hidden shrink-0"
              style={{ border: `1.5px solid ${accentHex}60` }}>
              {portraitSlug ? (
                <img src={iconUrl(portraitSlug)} alt={activeAccount.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${accentHex}20`, color: accentHex }}>
                  {activeAccount.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs leading-none mb-0.5" style={{ color: "var(--t-text2)" }}>Playing as</div>
              <div className="text-sm font-semibold leading-none" style={{ color: accentHex }}>{activeAccount.name}</div>
            </div>
          </button>
          <div className="w-px self-stretch" style={{ background: `${accentHex}25` }} />
          <button onClick={() => setOverlay("switcher")}
            className="flex items-center justify-center px-2 md:px-3 self-stretch hover:brightness-110 transition-all"
            title="Switch account">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--t-text1)" }}>
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:flex flex-col shrink-0 min-h-0">
          <BannerSidebar />
        </div>
        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
          <BannerMobileStrip />
          <main className="flex-1 px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-6">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-sm" style={{ color: "var(--t-text2)" }}>Loading…</div>}>
              {activeTab === "warp" && (
                <WarpCalculator jades={activeAccount.jades} passes={activeAccount.passes}
                  data={activeAccount.warp} onChange={(warp) => updateAccount(activeAccount.id, { warp })} />
              )}
              {activeTab === "plan" && (
                <PullPlanner jades={activeAccount.jades} passes={activeAccount.passes}
                  starlightRate={activeAccount.warp.starlightRate} data={activeAccount.pullPlan}
                  onChange={(pullPlan: Account["pullPlan"]) => updateAccount(activeAccount.id, { pullPlan })} />
              )}
              {activeTab === "teams" && (
                <TeamMaker data={activeAccount.teams} roster={activeAccount.roster}
                  onChange={(teams: Account["teams"]) => updateAccount(activeAccount.id, { teams })} />
              )}
              {activeTab === "roster" && (
                <Roster data={activeAccount.roster ?? {}}
                  onChange={(roster: Account["roster"]) => updateAccount(activeAccount.id, { roster })} />
              )}
            </Suspense>
          </main>
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex shrink-0 z-50"
        style={{ background: "var(--t-header)", borderTop: "1px solid var(--t-border2)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative"
              style={{ color: active ? accentHex : "var(--t-text1)" }}>
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: accentHex }} />
              )}
            </button>
          );
        })}
      </nav>

      {overlay === "profile" && (
        <ProfileModal name={activeAccount.name} accent={activeAccount.accent}
          profileSlug={activeAccount.profileSlug} onSave={handleProfileSave}
          onSwitchAccount={() => setOverlay("switcher")} onClose={() => setOverlay("none")} />
      )}
    </div>
  );
}

export default App;
