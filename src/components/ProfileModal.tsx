import { useState } from "react";
import type { AccentColor } from "../types";
import { ACCENT_HEX } from "../utils";
import { iconUrl, slugToName } from "../data/characters";
import { CharPicker } from "./CharPicker";

interface Props {
  name: string;
  accent: AccentColor;
  profileSlug: string;
  onSave: (name: string, accent: AccentColor, profileSlug: string) => void;
  onSwitchAccount: () => void;
  onClose: () => void;
}

const ACCENTS: AccentColor[] = ["cyan", "purple", "blue"];
const ACCENT_LABELS: Record<AccentColor, string> = { cyan: "Cyan", purple: "Purple", blue: "Blue" };

export function ProfileModal({ name, accent, profileSlug, onSave, onSwitchAccount, onClose }: Props) {
  const [draftName, setDraftName] = useState(name);
  const [draftAccent, setDraftAccent] = useState<AccentColor>(accent);
  const [draftSlug, setDraftSlug] = useState(profileSlug);
  const [pickerOpen, setPickerOpen] = useState(false);

  const save = () => {
    if (draftName.trim()) onSave(draftName.trim(), draftAccent, draftSlug);
  };

  const accentHex = ACCENT_HEX[draftAccent];

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-6"
      style={{ background: "var(--t-scrim)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-5 rounded-2xl p-6 shadow-2xl"
        style={{ width: 300, background: "var(--t-modal)", border: "1.5px solid var(--t-border0)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-cream">Profile Settings</span>
          <button onClick={onClose} className="text-muted hover:text-cream text-lg leading-none">✕</button>
        </div>

        {/* Profile photo */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Profile photo</span>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden shrink-0"
              style={{ border: `2px solid ${accentHex}50` }}
            >
              {draftSlug ? (
                <img
                  src={iconUrl(draftSlug)}
                  alt={slugToName(draftSlug)}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: `${accentHex}20`, color: accentHex }}>
                  {draftName.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setPickerOpen(true)}
                className="text-sm px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: `${accentHex}18`, color: accentHex, border: `1px solid ${accentHex}35` }}
              >
                Change photo
              </button>
              {draftSlug && (
                <button
                  onClick={() => setDraftSlug("")}
                  className="text-xs text-muted hover:text-cream transition-colors text-left"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {draftSlug && (
            <p className="text-xs text-muted/70">{slugToName(draftSlug)}</p>
          )}
        </div>

        {/* Name */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Account name</span>
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gold/40"
            style={{ background: "var(--t-bg3)", border: "1px solid var(--t-border0)", color: "var(--t-text0)" }}
          />
        </label>

        {/* Accent */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Accent color</span>
          <div className="flex gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a}
                onClick={() => setDraftAccent(a)}
                className="flex flex-col items-center gap-1.5 flex-1 rounded-xl py-2.5 border transition-all"
                style={{
                  borderColor: draftAccent === a ? ACCENT_HEX[a] + "80" : "var(--t-border0)",
                  background: draftAccent === a ? ACCENT_HEX[a] + "15" : "transparent",
                }}
              >
                <span className="w-5 h-5 rounded-full" style={{ backgroundColor: ACCENT_HEX[a] }} />
                <span className="text-xs" style={{ color: draftAccent === a ? ACCENT_HEX[a] : "#a8b4d0" }}>
                  {ACCENT_LABELS[a]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={save}
          disabled={!draftName.trim()}
          className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: accentHex + "25", color: accentHex, border: `1px solid ${accentHex}40` }}
        >
          Save changes
        </button>

        <div className="border-t border-panel-2" />

        <button
          onClick={onSwitchAccount}
          className="flex items-center justify-between text-sm text-muted hover:text-cream transition-colors group"
        >
          <span>Switch account</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    {pickerOpen && (
      <CharPicker
        title="Choose Profile Photo"
        selected={draftSlug}
        onSelect={(slug) => { setDraftSlug(slug); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />
    )}
    </>
  );
}
