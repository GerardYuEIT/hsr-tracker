import { useMemo, useState } from "react";
import type { PullEntry, PullPlanData, PullPriority } from "../types";
import { genId } from "../utils";
import { iconUrl, slugToName, charRarity } from "../data/characters";
import { LIGHT_CONES, lcIconUrl, lcSlugToName, lcRarity } from "../data/lightcones";
import { computeMilestones, calcStartingWarps } from "../warpMath";
import type { StarlightRate } from "../types";
import { CharPicker } from "./CharPicker";
import { Stars } from "./Stars";

interface Props {
  jades: number; passes: number; starlightRate: StarlightRate;
  data: PullPlanData; onChange: (d: PullPlanData) => void;
}

// ── Priority config ───────────────────────────────────────────────────────────
const PVIBE: Record<PullPriority, {
  cardBg: string; border: string; glow: string;
  chipColor: string; chipBg: string; divider: string; strip: string;
}> = {
  must: {
    cardBg: "linear-gradient(115deg, #1c0909 0%, #110404 100%)",
    border: "rgba(248,113,113,0.18)", glow: "0 2px 20px rgba(0,0,0,0.6)",
    chipColor: "#f87171", chipBg: "rgba(229,82,82,0.14)",
    divider: "rgba(248,113,113,0.08)", strip: "#f87171",
  },
  want: {
    cardBg: "linear-gradient(115deg, #0f1825 0%, #09101e 100%)",
    border: "rgba(240,204,114,0.2)", glow: "0 0 24px rgba(240,204,114,0.05), 0 2px 16px rgba(0,0,0,0.45)",
    chipColor: "#f0cc72", chipBg: "rgba(240,204,114,0.10)",
    divider: "rgba(240,204,114,0.07)", strip: "#f0cc72",
  },
  maybe: {
    cardBg: "linear-gradient(115deg, #071820 0%, #050e18 100%)",
    border: "rgba(34,211,238,0.18)", glow: "0 0 20px rgba(34,211,238,0.04), 0 2px 14px rgba(0,0,0,0.45)",
    chipColor: "#22d3ee", chipBg: "rgba(34,211,238,0.10)",
    divider: "rgba(34,211,238,0.07)", strip: "#22d3ee",
  },
  skip: {
    cardBg: "linear-gradient(115deg, #080b11 0%, #060810 100%)",
    border: "rgba(31,45,82,0.55)", glow: "0 2px 8px rgba(0,0,0,0.3)",
    chipColor: "#a8b4d0", chipBg: "rgba(168,180,208,0.06)",
    divider: "rgba(168,180,208,0.05)", strip: "rgba(168,180,208,0.18)",
  },
};

function probColor(v: number) {
  return v >= 0.75 ? "#72e8a8" : v >= 0.5 ? "#f0cc72" : v >= 0.25 ? "#6095f8" : "#f87171";
}

function entryCostWarps(e: PullEntry) {
  return (e.targetEidolon >= 0 ? (e.targetEidolon + 1) * 66 : 0)
       + (e.targetSi > 0 ? e.targetSi * 50 : 0);
}

function projectedWarps(bannerDate?: string): number {
  if (!bannerDate) return 0;
  const days = Math.max(0, Math.round((new Date(bannerDate).getTime() - Date.now()) / 86400000));
  return Math.round(days * 5);
}

// ── Budget summary header ─────────────────────────────────────────────────────
function BudgetSummary({ totalWarps, entries }: { totalWarps: number; entries: PullEntry[] }) {
  const cost = (pr: PullPriority) => entries.filter(e => e.priority === pr).reduce((s, e) => s + entryCostWarps(e), 0);
  const mustCost  = cost("must");
  const wantCost  = cost("want");
  const maybeCost = cost("maybe");
  const committed = mustCost + wantCost;
  const remaining = Math.max(0, totalWarps - committed);
  const base = Math.max(totalWarps, committed + maybeCost) || 1;
  const mustPct  = Math.min(100, (mustCost  / base) * 100);
  const wantPct  = Math.min(100 - mustPct, (wantCost / base) * 100);
  const maybePct = Math.min(100 - mustPct - wantPct, (maybeCost / base) * 100);
  const remPct   = Math.min(100 - mustPct - wantPct - maybePct, (remaining / base) * 100);
  const short = committed > totalWarps;

  const stat = (label: string, value: number, color: string, sub?: string) => (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: `${color}70` }}>{label}</div>
      <div className="text-xl font-bold tabular-nums" style={{ color }}>{value.toLocaleString()}</div>
      <div className="text-[10px]" style={{ color: `${color}50` }}>{sub ?? "warps"}</div>
    </div>
  );

  return (
    <div className="rounded-2xl px-5 py-4 flex flex-col gap-3"
      style={{ background: "var(--t-bg0)", border: "1.5px solid var(--t-border1)" }}>
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
        {stat("Available", totalWarps, "#f0cc72")}
        <div className="w-px h-8 shrink-0" style={{ background: "var(--t-border0)" }} />
        {stat("Must",      mustCost,  "#f87171")}
        <div className="w-px h-8 shrink-0" style={{ background: "var(--t-border0)" }} />
        {stat("Want",      wantCost,  "#a78bfa")}
        <div className="w-px h-8 shrink-0" style={{ background: "var(--t-border0)" }} />
        {stat("Maybe",     maybeCost, "#22d3ee", "warps (untracked)")}
        <div className="w-px h-8 shrink-0" style={{ background: "var(--t-border0)" }} />
        {stat("Remaining", remaining, short ? "#f87171" : "#72e8a8")}
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
        {mustPct  > 0 && <div style={{ width: `${mustPct}%`,  background: "#f87171" }} />}
        {wantPct  > 0 && <div style={{ width: `${wantPct}%`,  background: "#a78bfa" }} />}
        {maybePct > 0 && <div style={{ width: `${maybePct}%`, background: "#22d3ee", opacity: 0.6 }} />}
        {remPct   > 0 && <div style={{ width: `${remPct}%`,   background: "#72e8a8" }} />}
      </div>
    </div>
  );
}

// ── Priority pill row ─────────────────────────────────────────────────────────
function PriorityPills({ value, border, onChange }: {
  value: PullPriority; border: string; onChange: (p: PullPriority) => void;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${border}` }}>
      {(["must","want","maybe","skip"] as PullPriority[]).map((pr) => {
        const v = PVIBE[pr];
        const labels: Record<PullPriority, string> = { must: "Must", want: "Want", maybe: "Maybe", skip: "Skip" };
        return (
          <button key={pr} onClick={() => onChange(pr)}
            className="px-2 py-1 text-[10px] font-medium transition-all"
            style={{
              background: value === pr ? v.chipBg : "transparent",
              color: value === pr ? v.chipColor : "rgba(168,180,208,0.28)",
            }}>
            {labels[pr]}
          </button>
        );
      })}
    </div>
  );
}

// ── Drag handle ───────────────────────────────────────────────────────────────
function DragHandle() {
  return (
    <div className="flex items-center justify-center shrink-0 w-5 select-none touch-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      style={{ cursor: "grab" }}>
      <svg width="8" height="14" viewBox="0 0 8 14" fill="#a8b4d0" style={{ opacity: 0.5 }}>
        <circle cx="2" cy="2" r="1.5"/><circle cx="6" cy="2" r="1.5"/>
        <circle cx="2" cy="7" r="1.5"/><circle cx="6" cy="7" r="1.5"/>
        <circle cx="2" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/>
      </svg>
    </div>
  );
}

// ── Ticket perforated divider ─────────────────────────────────────────────────
function Perforation({ color }: { color: string }) {
  return (
    <div className="relative self-stretch flex-shrink-0" style={{ width: 18 }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full z-10"
        style={{ background: "var(--t-bg0, #0a0f1e)", border: `1px solid ${color}` }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[14px] h-[14px] rounded-full z-10"
        style={{ background: "var(--t-bg0, #0a0f1e)", border: `1px solid ${color}` }} />
      <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-px border-l-2 border-dashed"
        style={{ borderColor: color }} />
    </div>
  );
}

// ── Combined Banner Card ──────────────────────────────────────────────────────
function PlanCard({ entry, budgetBefore, budgetAfter, onUpdate, onDelete }: {
  entry: PullEntry; budgetBefore: number; budgetAfter: number;
  onUpdate: (e: PullEntry) => void; onDelete: () => void;
}) {
  const [charPicker, setCharPicker] = useState(false);
  const [lcPicker, setLcPicker]     = useState(false);
  const p = (patch: Partial<PullEntry>) => onUpdate({ ...entry, ...patch });
  const vibe = PVIBE[entry.priority];
  const projected = projectedWarps(entry.bannerDate);
  const charCost = entry.targetEidolon >= 0 ? (entry.targetEidolon + 1) * 66 : 0;
  const lcCost   = entry.targetSi > 0 ? entry.targetSi * 50 : 0;

  const charProb = useMemo(() => {
    if (entry.priority === "skip" || entry.targetEidolon < 0) return null;
    const { charMilestones } = computeMilestones(
      Math.floor(budgetBefore + projected),
      entry.charPity, entry.charGuaranteed, 0, false, -1, 5,
    );
    return charMilestones[entry.targetEidolon]?.successChance ?? null;
  }, [entry, budgetBefore, projected]);

  const lcProb = useMemo(() => {
    if (entry.priority === "skip" || entry.targetSi === 0) return null;
    const { lcMilestones } = computeMilestones(
      Math.floor(budgetBefore + projected),
      0, false, entry.lcPity, entry.lcGuaranteed, 5, 0,
    );
    return lcMilestones[entry.targetSi - 1]?.successChance ?? null;
  }, [entry, budgetBefore, projected]);

  const eiBtn = (ei: number) => (
    <button key={ei} onClick={() => p({ targetEidolon: ei })}
      className="rounded text-[9px] font-semibold transition-all"
      style={{
        width: 22, height: 18,
        background: entry.targetEidolon === ei
          ? (ei < 0 ? "rgba(168,180,208,0.1)" : vibe.chipBg)
          : "rgba(255,255,255,0.02)",
        color: entry.targetEidolon === ei
          ? (ei < 0 ? "#a8b4d0" : vibe.chipColor)
          : "rgba(168,180,208,0.22)",
        border: `1px solid ${entry.targetEidolon === ei
          ? (ei < 0 ? "rgba(168,180,208,0.22)" : vibe.border)
          : "rgba(255,255,255,0.04)"}`,
        transform: entry.targetEidolon === ei && ei >= 0 ? "translateY(-1px)" : "none",
      }}>
      {ei < 0 ? "—" : `E${ei}`}
    </button>
  );

  const siBtn = (s: number) => (
    <button key={s} onClick={() => p({ targetSi: s })}
      className="rounded text-[9px] font-semibold transition-all"
      style={{
        width: 22, height: 18,
        background: entry.targetSi === s
          ? (s === 0 ? "rgba(168,180,208,0.1)" : "rgba(96,149,248,0.18)")
          : "rgba(255,255,255,0.02)",
        color: entry.targetSi === s
          ? (s === 0 ? "#a8b4d0" : "#6095f8")
          : "rgba(168,180,208,0.22)",
        border: `1px solid ${entry.targetSi === s
          ? (s === 0 ? "rgba(168,180,208,0.22)" : "rgba(96,149,248,0.4)")
          : "rgba(255,255,255,0.04)"}`,
        transform: entry.targetSi === s && s > 0 ? "translateY(-1px)" : "none",
      }}>
      {s === 0 ? "—" : `S${s}`}
    </button>
  );

  return (
    <>
    <div className="relative rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: vibe.cardBg, border: `1.5px solid ${vibe.border}`, boxShadow: vibe.glow, opacity: entry.priority === "skip" ? 0.42 : 1 }}>

      {/* Priority strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[14px]" style={{ background: vibe.strip }} />

      {/* Header row */}
      <div className="flex items-center gap-2 pl-5 pr-3 pt-2.5 pb-2"
        style={{ borderBottom: `1px solid ${vibe.divider}` }}>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-hidden">
          <span className="text-xs font-bold truncate shrink-0 max-w-[40%]" style={{ color: "var(--t-text0)" }}>
            {entry.charSlug ? slugToName(entry.charSlug)
              : <span style={{ color: `${vibe.chipColor}35` }}>No character</span>}
          </span>
          <span className="text-[10px] shrink-0" style={{ color: "var(--t-text3)" }}>·</span>
          <span className="text-xs truncate" style={{ color: "rgba(96,149,248,0.75)" }}>
            {entry.lcSlug ? lcSlugToName(entry.lcSlug)
              : <span style={{ color: "rgba(96,149,248,0.25)" }}>No light cone</span>}
          </span>
        </div>
        <input type="date" value={entry.bannerDate ?? ""} onChange={(e) => p({ bannerDate: e.target.value })}
          className="bg-transparent text-[10px] outline-none shrink-0"
          style={{ color: entry.bannerDate ? "rgba(168,180,208,0.5)" : "rgba(168,180,208,0.18)", colorScheme: "dark" }} />
        <PriorityPills value={entry.priority} border={vibe.border} onChange={(pr) => p({ priority: pr })} />
        <button onClick={onDelete} className="text-xs shrink-0 transition-colors"
          style={{ color: "rgba(168,180,208,0.18)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(168,180,208,0.18)"}>✕</button>
      </div>

      {/* Main content row */}
      <div className="flex" style={{ paddingLeft: 4 }}>

        {/* ── Char portrait ── */}
        <button onClick={() => setCharPicker(true)}
          className="group relative shrink-0 overflow-hidden cursor-pointer" style={{ width: 96 }}>
          {entry.charSlug ? (
            <>
              <img src={iconUrl(entry.charSlug)} onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                <Stars count={charRarity(entry.charSlug)} size={8} />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="text-2xl leading-none" style={{ color: `${vibe.chipColor}28` }}>+</span>
              <span className="text-[9px]" style={{ color: `${vibe.chipColor}38` }}>char</span>
            </div>
          )}
        </button>

        <Perforation color={vibe.divider} />

        {/* ── Char config ── */}
        <div className="flex flex-col justify-between py-2.5 px-0 gap-2 shrink-0" style={{ width: 168 }}>
          {/* Eidolon target */}
          <div>
            <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: `${vibe.chipColor}55` }}>Eidolon</div>
            <div className="flex items-center gap-0.5 flex-wrap">
              {eiBtn(-1)}
              {[0,1,2,3,4,5,6].map(ei => eiBtn(ei))}
            </div>
          </div>

          {/* Char pity */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] shrink-0" style={{ color: `${vibe.chipColor}55` }}>Pity</span>
            <input type="number" min={0} max={89} value={entry.charPity}
              onChange={(e) => p({ charPity: Math.min(89, Math.max(0, parseInt(e.target.value) || 0)) })}
              className="w-10 text-[10px] font-mono text-center rounded-md px-1 py-0.5 outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#a8b4d0" }} />
            <button onClick={() => p({ charGuaranteed: !entry.charGuaranteed })}
              className="flex items-center gap-0.5 text-[9px] rounded-md px-1.5 py-0.5 transition-all shrink-0"
              style={{
                background: entry.charGuaranteed ? `${vibe.chipColor}14` : "rgba(255,255,255,0.03)",
                border: `1px solid ${entry.charGuaranteed ? `${vibe.chipColor}30` : "rgba(255,255,255,0.06)"}`,
                color: entry.charGuaranteed ? vibe.chipColor : "rgba(168,180,208,0.28)",
              }}>
              {entry.charGuaranteed ? "★" : "☆"} Gtd
            </button>
          </div>

          {/* Char prob */}
          {charProb !== null ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tabular-nums" style={{ color: probColor(charProb) }}>
                {Math.round(charProb * 100)}%
              </span>
              <span className="text-[9px]" style={{ color: "rgba(168,180,208,0.35)" }}>
                at E{entry.targetEidolon}
              </span>
            </div>
          ) : entry.priority === "skip" ? (
            <span className="text-[9px]" style={{ color: "rgba(168,180,208,0.22)" }}>— skipping —</span>
          ) : null}
        </div>

        {/* ── Section divider ── */}
        <div className="self-stretch w-px shrink-0 mx-2" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* ── LC portrait ── */}
        <button onClick={() => setLcPicker(true)}
          className="group relative shrink-0 overflow-hidden cursor-pointer" style={{ width: 76 }}>
          {entry.lcSlug ? (
            <>
              <img src={lcIconUrl(entry.lcSlug)} onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                <Stars count={lcRarity(entry.lcSlug) === 4 ? 4 : 5} size={7} />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
              style={{ background: "rgba(96,149,248,0.03)" }}>
              <span className="text-xl leading-none" style={{ color: "rgba(96,149,248,0.28)" }}>+</span>
              <span className="text-[9px]" style={{ color: "rgba(96,149,248,0.4)" }}>LC</span>
            </div>
          )}
        </button>

        <Perforation color="rgba(96,149,248,0.1)" />

        {/* ── LC config ── */}
        <div className="flex flex-col justify-between py-2.5 px-0 gap-2 flex-1 min-w-0">
          {/* SI target */}
          <div>
            <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(96,149,248,0.55)" }}>Superimpose</div>
            <div className="flex items-center gap-0.5 flex-wrap">
              {[0,1,2,3,4,5].map(s => siBtn(s))}
            </div>
          </div>

          {/* LC pity */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] shrink-0" style={{ color: "rgba(96,149,248,0.55)" }}>Pity</span>
            <input type="number" min={0} max={79} value={entry.lcPity}
              onChange={(e) => p({ lcPity: Math.min(79, Math.max(0, parseInt(e.target.value) || 0)) })}
              className="w-10 text-[10px] font-mono text-center rounded-md px-1 py-0.5 outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#a8b4d0" }} />
            <button onClick={() => p({ lcGuaranteed: !entry.lcGuaranteed })}
              className="flex items-center gap-0.5 text-[9px] rounded-md px-1.5 py-0.5 transition-all shrink-0"
              style={{
                background: entry.lcGuaranteed ? "rgba(96,149,248,0.14)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${entry.lcGuaranteed ? "rgba(96,149,248,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: entry.lcGuaranteed ? "#6095f8" : "rgba(168,180,208,0.28)",
              }}>
              {entry.lcGuaranteed ? "★" : "☆"} Gtd
            </button>
          </div>

          {/* LC prob */}
          {lcProb !== null && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tabular-nums" style={{ color: probColor(lcProb) }}>
                {Math.round(lcProb * 100)}%
              </span>
              <span className="text-[9px]" style={{ color: "rgba(168,180,208,0.35)" }}>
                at S{entry.targetSi}
              </span>
            </div>
          )}
        </div>

        {/* ── Stats column ── */}
        <div className="flex flex-col items-end justify-center gap-2.5 shrink-0 px-4"
          style={{ borderLeft: `1px dashed ${vibe.divider}`, minWidth: 90 }}>

          <div className="text-right">
            <div className="text-[10px]" style={{ color: `${vibe.chipColor}50` }}>est. cost</div>
            <div className="text-base font-bold tabular-nums" style={{ color: "rgba(168,180,208,0.6)" }}>
              ~{charCost + lcCost}
            </div>
            {charCost > 0 && lcCost > 0 && (
              <div className="text-[9px] tabular-nums" style={{ color: "rgba(168,180,208,0.3)" }}>
                {charCost}+{lcCost}
              </div>
            )}
            <div className="text-[9px]" style={{ color: "rgba(168,180,208,0.28)" }}>pulls</div>
          </div>

          <div className="text-right">
            <div className="text-[10px]" style={{ color: `${vibe.chipColor}50` }}>budget</div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: vibe.chipColor }}>
              {Math.floor(budgetBefore)}
            </div>
            <div className="text-[10px] tabular-nums"
              style={{ color: budgetAfter >= 0 ? "rgba(168,180,208,0.45)" : "#f87171" }}>
              → {Math.floor(budgetAfter)}
            </div>
            {projected > 0 && (
              <div className="text-[9px]" style={{ color: "#72e8a855" }}>+{projected} by date</div>
            )}
          </div>
        </div>
      </div>
    </div>

    {charPicker && (
      <CharPicker title="Select Character" selected={entry.charSlug}
        onSelect={(slug) => { p({ charSlug: slug }); setCharPicker(false); }}
        onClose={() => setCharPicker(false)} />
    )}
    {lcPicker && (
      <CharPicker title="Select Light Cone" items={LIGHT_CONES} iconUrlFn={lcIconUrl}
        selected={entry.lcSlug}
        onSelect={(slug) => { p({ lcSlug: slug }); setLcPicker(false); }}
        onClose={() => setLcPicker(false)} />
    )}
    </>
  );
}

// ── Reorder flat list ─────────────────────────────────────────────────────────
function reorder(entries: PullEntry[], fromId: string, toId: string, before: boolean): PullEntry[] {
  const fromEntry = entries.find(e => e.id === fromId);
  if (!fromEntry) return entries;
  const withoutFrom = entries.filter(e => e.id !== fromId);
  const ti = withoutFrom.findIndex(e => e.id === toId);
  if (ti === -1) return entries;
  withoutFrom.splice(before ? ti : ti + 1, 0, fromEntry);
  return withoutFrom;
}

// ── Add button ────────────────────────────────────────────────────────────────
function AddBtn({ onClick, color, label }: { onClick: () => void; color: string; label: string }) {
  return (
    <button onClick={onClick}
      className="rounded-xl px-3 py-1.5 text-xs font-medium transition-all"
      style={{ border: `1.5px dashed ${color}28`, color: `${color}55` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}70`;
        e.currentTarget.style.color = color;
        e.currentTarget.style.background = `${color}0c`;
        e.currentTarget.style.boxShadow = `0 0 14px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}28`;
        e.currentTarget.style.color = `${color}55`;
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.boxShadow = "none";
      }}>
      + {label}
    </button>
  );
}

// ── Main Planner ──────────────────────────────────────────────────────────────
export function PullPlanner({ jades, passes, starlightRate, data, onChange }: Props) {
  const patch = (p: Partial<PullPlanData>) => onChange({ ...data, ...p });
  const [dragId, setDragId]         = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragAbove, setDragAbove]   = useState(true);

  const budgets = useMemo(() => {
    let running = calcStartingWarps(jades, passes, starlightRate);
    return data.entries.map((entry) => {
      const before = running;
      running = Math.max(0, running - entryCostWarps(entry));
      return { before, after: running };
    });
  }, [jades, passes, starlightRate, data]);

  const makeEntry = (override: Partial<PullEntry> = {}): PullEntry => ({
    id: genId("pe"), charSlug: "", lcSlug: "", patchLabel: "", bannerDate: "",
    halfPatchesSince: 0, targetEidolon: 0, targetSi: 0,
    charPity: 0, charGuaranteed: false, lcPity: 0, lcGuaranteed: false,
    priority: "want", ...override,
  });

  const addEntry = () => patch({ entries: [...data.entries, makeEntry()] });

  const updateEntry = (id: string, e: PullEntry) =>
    patch({ entries: data.entries.map((x) => (x.id === id ? e : x)) });
  const deleteEntry = (id: string) =>
    patch({ entries: data.entries.filter((x) => x.id !== id) });

  const totalWarps = calcStartingWarps(jades, passes, starlightRate);

  return (
    <div className="flex flex-col gap-5">

      <BudgetSummary totalWarps={totalWarps} entries={data.entries} />

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "rgba(168,180,208,0.45)" }}>Pull Plan</h3>
          <div className="flex-1 h-px" style={{ background: "var(--t-border0)" }} />
          <AddBtn onClick={addEntry} color="#f0cc72" label="Add Banner" />
        </div>

        {data.entries.length === 0 && (
          <p className="text-xs py-1" style={{ color: "rgba(168,180,208,0.2)" }}>
            No banners planned yet.
          </p>
        )}

        {data.entries.map((entry, _i) => {
          const idx = data.entries.indexOf(entry);
          const isDragging = dragId === entry.id;
          const isOver = dragOverId === entry.id && !isDragging;
          const vibe = PVIBE[entry.priority];

          return (
            <div key={entry.id} className="group relative flex items-stretch gap-1.5"
              draggable
              onDragStart={() => setDragId(entry.id)}
              onDragEnd={() => { setDragId(null); setDragOverId(null); }}
              onDragOver={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                setDragAbove(e.clientY < rect.top + rect.height / 2);
                if (dragOverId !== entry.id) setDragOverId(entry.id);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId && dragId !== entry.id)
                  patch({ entries: reorder(data.entries, dragId, entry.id, dragAbove) });
                setDragId(null); setDragOverId(null);
              }}
              style={{ opacity: isDragging ? 0.3 : 1, transition: "opacity 0.15s" }}
            >
              {isOver && (
                <div className="absolute left-5 right-0 h-0.5 rounded-full z-20 pointer-events-none"
                  style={{
                    top: dragAbove ? -2 : "auto", bottom: dragAbove ? "auto" : -2,
                    background: `${vibe.strip}cc`, boxShadow: `0 0 8px ${vibe.strip}88`,
                  }} />
              )}
              <DragHandle />
              <div className="flex-1 min-w-0">
                <PlanCard
                  entry={entry}
                  budgetBefore={budgets[idx].before}
                  budgetAfter={budgets[idx].after}
                  onUpdate={(e) => updateEntry(entry.id, e)}
                  onDelete={() => deleteEntry(entry.id)}
                />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
