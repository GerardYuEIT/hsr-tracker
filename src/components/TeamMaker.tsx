import { useState } from "react";
import type { Team, RosterEntry } from "../types";
import { genId } from "../utils";
import {
  CHARACTERS, ELEMENT_COLOR,
  iconUrl, slugToName, elementIconUrl, charRarity,
} from "../data/characters";
import { CharPicker } from "./CharPicker";
import { Stars } from "./Stars";

interface Props {
  data: Team[];
  onChange: (d: Team[]) => void;
  roster?: Record<string, RosterEntry>;
}

// ─── Portrait slot ────────────────────────────────────────────────────────────

function PortraitSlot({ slug, onClick, onClear }: {
  slug: string; onClick: () => void; onClear: () => void;
}) {
  const char   = slug ? CHARACTERS.find((c) => c.slug === slug) : null;
  const accent = char?.element ? ELEMENT_COLOR[char.element] : null;
  const filled = !!slug;

  return (
    <div className="relative group" style={{ flex: 1 }}>
      <button
        onClick={onClick}
        className="relative w-full flex flex-col overflow-hidden rounded-2xl transition-all duration-200"
        style={{
          aspectRatio: "3/4",
          background: "linear-gradient(160deg, #4a3300 0%, #1e1600 100%)",
          border: `1.5px solid ${filled && accent ? `${accent}35` : "rgba(255,255,255,0.07)"}`,
          boxShadow: filled && accent ? `0 0 18px ${accent}15` : "none",
        }}
        onMouseEnter={(e) => {
          const accent2 = filled && accent ? accent : "#f0cc72";
          e.currentTarget.style.borderColor = `${accent2}55`;
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = `0 10px 28px rgba(0,0,0,0.5), 0 0 18px ${accent2}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = filled && accent ? `${accent}35` : "rgba(255,255,255,0.07)";
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = filled && accent ? `0 0 18px ${accent}15` : "none";
        }}
      >
        {/* element-tinted bg */}
        <div className="absolute inset-0" style={{
          background: filled && accent
            ? `linear-gradient(155deg, ${accent}55 0%, ${accent}22 45%, #080c18 100%)`
            : "#0d1526",
        }} />

        {filled ? (
          <>
            <img
              src={iconUrl(slug)} alt={char?.name ?? slug}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            {/* element icon */}
            {char?.element && (
              <div className="absolute top-2 left-2 rounded-lg p-1" style={{
                background: "rgba(6,9,20,0.72)",
                border: `1px solid ${accent}35`,
                backdropFilter: "blur(6px)",
              }}>
                <img src={elementIconUrl(char.element)} alt={char.element} className="w-3.5 h-3.5" />
              </div>
            )}
            {/* Stars */}
            <div className="absolute bottom-9 left-0 right-0 flex justify-center pointer-events-none">
              <Stars count={charRarity(slug)} size={9} />
            </div>

            {/* name frosted pill */}
            <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5">
              <div className="rounded-lg px-1.5 py-1 flex items-center justify-center" style={{
                background: "rgba(6,9,20,0.62)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <p className="text-[9px] font-semibold text-center leading-tight line-clamp-1"
                  style={{ color: "#f2ece0" }}>
                  {char?.name ?? slugToName(slug)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ border: "1.5px dashed rgba(255,255,255,0.07)" }}>
            <span className="text-2xl font-thin" style={{ color: "#2a3a5a" }}>+</span>
            <span className="text-[10px]" style={{ color: "#2a3a5a" }}>empty</span>
          </div>
        )}
      </button>

      {/* Clear button — appears on hover */}
      {filled && (
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all"
          style={{ background: "#0d1526", border: "1px solid rgba(248,113,113,0.4)", color: "#f87171" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0d1526"; }}
        >✕</button>
      )}
    </div>
  );
}

// ─── Team card ────────────────────────────────────────────────────────────────

function TeamCard({ team, roster, onUpdate, onDelete }: {
  team: Team; roster?: Record<string, RosterEntry>;
  onUpdate: (t: Team) => void; onDelete: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [draft, setDraft]             = useState(team.name);
  const [pickerSlot, setPickerSlot]   = useState<number | null>(null);
  const [fromRoster, setFromRoster]   = useState(false);

  const hasRoster = roster && Object.keys(roster).length > 0;
  const rosterChars = hasRoster
    ? CHARACTERS.filter((c) => roster![c.slug] !== undefined)
    : [];

  // Derive a subtle accent from the first filled slot
  const firstChar  = team.slots.map((s) => CHARACTERS.find((c) => c.slug === s)).find(Boolean);
  const cardAccent = firstChar?.element ? ELEMENT_COLOR[firstChar.element] : "#1f2d52";

  const commitName = () => {
    if (draft.trim()) onUpdate({ ...team, name: draft.trim() });
    setEditingName(false);
  };

  const setSlot = (idx: number, slug: string) => {
    const slots = [...team.slots];
    slots[idx] = slug;
    onUpdate({ ...team, slots });
  };

  const filledCount = team.slots.filter(Boolean).length;

  return (
    <>
      <div
        className="flex flex-col gap-4 rounded-2xl p-5"
        style={{
          background: "var(--t-bg1)",
          border: `1.5px solid ${cardAccent}30`,
          boxShadow: `0 0 30px ${cardAccent}08`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          {/* Accent dot */}
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cardAccent, boxShadow: `0 0 6px ${cardAccent}` }} />

          {editingName ? (
            <input
              autoFocus value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === "Enter") commitName(); if (e.key === "Escape") setEditingName(false); }}
              className="flex-1 bg-transparent text-cream text-sm font-semibold rounded-lg px-2 py-1 outline-none"
              style={{ border: "1px solid rgba(240,204,114,0.35)" }}
            />
          ) : (
            <button
              onClick={() => { setDraft(team.name); setEditingName(true); }}
              className="flex-1 text-left text-sm font-semibold text-cream hover:text-gold transition-colors flex items-center gap-2"
            >
              {team.name}
              <span className="text-muted text-xs opacity-50">✎</span>
            </button>
          )}

          <span className="text-xs text-muted shrink-0">{filledCount}/4</span>

          {/* Roster mode toggle */}
          {hasRoster && (
            <button
              onClick={() => setFromRoster((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all shrink-0"
              style={{
                background: fromRoster ? "rgba(114,232,168,0.12)" : "rgba(255,255,255,0.04)",
                color: fromRoster ? "#72e8a8" : "#4a5a7a",
                border: `1px solid ${fromRoster ? "rgba(114,232,168,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span style={{ fontSize: 9 }}>☆</span> Roster
            </button>
          )}

          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all shrink-0"
            style={{ color: "#6b7a99", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7a99"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "transparent"; }}
          >✕</button>
        </div>

        {/* Slots */}
        <div className="flex gap-3">
          {team.slots.map((slug, idx) => (
            <PortraitSlot
              key={idx}
              slug={slug}
              onClick={() => setPickerSlot(idx)}
              onClear={() => setSlot(idx, "")}
            />
          ))}
        </div>
      </div>

      {pickerSlot !== null && (
        <CharPicker
          title={fromRoster && hasRoster
            ? `Slot ${pickerSlot + 1} — From Roster`
            : `Slot ${pickerSlot + 1} — ${team.name}`}
          items={fromRoster && hasRoster ? rosterChars : undefined}
          selected={team.slots[pickerSlot]}
          onSelect={(slug) => { setSlot(pickerSlot, slug); setPickerSlot(null); }}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function TeamMaker({ data, onChange, roster }: Props) {
  const addTeam = () => {
    onChange([...data, {
      id: genId("team"),
      name: `Team ${data.length + 1}`,
      slots: ["", "", "", ""],
    }]);
  };

  const updateTeam = (id: string, t: Team) => onChange(data.map((x) => x.id === id ? t : x));
  const deleteTeam = (id: string)          => onChange(data.filter((x) => x.id !== id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={addTeam}
          className="flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
          style={{ background: "#f0cc72", color: "#0d1526" }}
        >
          <span className="text-base leading-none">+</span> Add Team
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="text-5xl opacity-20">⬡</div>
          <p className="text-muted text-sm">No teams yet.<br />Build your first team below.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(480px, 100%), 1fr))" }}>
          {data.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              roster={roster}
              onUpdate={(t) => updateTeam(team.id, t)}
              onDelete={() => deleteTeam(team.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
