import { useState } from "react";
import type { Account, AccentColor } from "../types";
import { ACCENT_HEX } from "../utils";
import { iconUrl } from "../data/characters";

const ACCENT_GLOW: Record<AccentColor, string> = {
  cyan:   "0 0 32px 8px rgba(95,211,243,0.35)",
  purple: "0 0 32px 8px rgba(192,157,240,0.35)",
  blue:   "0 0 32px 8px rgba(96,149,248,0.35)",
};

const ACCENTS: AccentColor[] = ["cyan", "purple", "blue"];

interface Props {
  accounts: Account[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string, accent: AccentColor) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

function AccountCard({ account, isActive, onClick }: { account: Account; isActive: boolean; onClick: () => void }) {
  const accent = ACCENT_HEX[account.accent];
  const portraitSlug = account.profileSlug || account.warp.charSlug || Object.keys(account.roster ?? {})[0] || "";

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-4 focus:outline-none"
    >
      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-200 group-hover:scale-105"
        style={{
          width: 168,
          height: 224,
          border: `2px solid ${isActive ? accent : "rgba(255,255,255,0.08)"}`,
          boxShadow: isActive ? ACCENT_GLOW[account.accent] : "none",
        }}
      >
        {portraitSlug ? (
          <>
            <img
              src={iconUrl(portraitSlug)}
              alt={account.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(14,22,48,0.95) 0%, rgba(14,22,48,0.2) 50%, transparent 100%)" }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}20 0%, rgba(14,22,48,0.9) 100%)` }}>
            <span className="text-5xl font-bold" style={{ color: `${accent}80` }}>
              {account.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Accent dot bottom-left */}
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />

        {/* Active ring pulse */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 2px ${accent}` }} />
        )}
      </div>

      {/* Name below card */}
      <span
        className="text-base font-semibold tracking-wide transition-colors group-hover:text-cream"
        style={{ color: isActive ? "#f2ece0" : "#a8b4d0" }}
      >
        {account.name}
      </span>
    </button>
  );
}

function AddCard({ onAdd }: { onAdd: (name: string, accent: AccentColor) => void }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [accent, setAccent] = useState<AccentColor>("cyan");

  const submit = () => {
    if (name.trim()) { onAdd(name.trim(), accent); setAdding(false); setName(""); }
  };

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="group flex flex-col items-center gap-4 focus:outline-none"
      >
        <div
          className="relative rounded-2xl transition-all duration-200 group-hover:scale-105 flex items-center justify-center"
          style={{ width: 168, height: 224, border: "2px dashed var(--t-border1)", background: "var(--t-bg-subtle)" }}
        >
          <span className="text-5xl text-muted/30 group-hover:text-muted/60 transition-colors">+</span>
        </div>
        <span className="text-base text-muted group-hover:text-cream transition-colors">Add Account</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl p-5 flex flex-col gap-4 items-center"
        style={{ width: 168, height: 224, border: "2px solid var(--t-border0)", background: "var(--t-bg2)" }}>
        <input
          autoFocus value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Name"
          className="w-full bg-panel-2/60 rounded-lg px-3 py-2 text-sm text-cream outline-none border border-panel-2 focus:border-gold/40 placeholder:text-muted/40 text-center"
        />
        <div className="flex gap-3">
          {ACCENTS.map((a) => (
            <button key={a} onClick={() => setAccent(a)}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{ backgroundColor: ACCENT_HEX[a], borderColor: accent === a ? "#f2ece0" : "transparent", transform: accent === a ? "scale(1.2)" : "scale(1)" }}
            />
          ))}
        </div>
        <button onClick={submit}
          className="w-full rounded-lg py-2 text-sm font-semibold transition-colors"
          style={{ background: ACCENT_HEX[accent] + "25", color: ACCENT_HEX[accent], border: `1px solid ${ACCENT_HEX[accent]}40` }}>
          Create ✓
        </button>
        <button onClick={() => setAdding(false)} className="text-xs text-muted hover:text-cream transition-colors">cancel</button>
      </div>
      <span className="text-base text-muted invisible">—</span>
    </div>
  );
}

export function AccountSwitcher(props: Props) {
  const { accounts, activeId, onSelect, onAdd, onRename, onDelete } = props;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "var(--t-body-bg)" }}>

      <h1 className="text-3xl font-bold text-gold mb-2 tracking-wide"
        style={{ textShadow: "0 0 24px rgba(240,204,114,0.3)" }}>
        Honkai: Star Rail
      </h1>
      <p className="text-muted text-sm mb-14">Who's playing?</p>

      <div className="flex gap-8 flex-wrap justify-center px-8">
        {accounts.map((acc) => (
          <div key={acc.id} className="relative">
            <AccountCard account={acc} isActive={acc.id === activeId} onClick={() => onSelect(acc.id)} />

            {/* Manage buttons (hover on the name area) */}
            <div className="absolute -bottom-7 left-0 right-0 flex justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity" style={{ pointerEvents: "none" }}>
              <button
                onClick={(e) => { e.stopPropagation(); const n = prompt("Rename account:", acc.name); if (n?.trim()) onRename(acc.id, n.trim()); }}
                className="text-xs text-muted hover:text-gold transition-colors"
                style={{ pointerEvents: "auto" }}>✎</button>
              {accounts.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${acc.name}"?`)) onDelete(acc.id); }}
                  className="text-xs text-muted hover:text-red-400 transition-colors"
                  style={{ pointerEvents: "auto" }}>✕</button>
              )}
            </div>
          </div>
        ))}
        <AddCard onAdd={onAdd} />
      </div>
    </div>
  );
}
