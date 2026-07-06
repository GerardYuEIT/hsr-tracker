import { useMemo, useState } from "react";
import type { StarlightRate, WarpData, WarpPhase } from "../types";
import { genId } from "../utils";
import { computeWarpResults, type JointMilestone, type Strategy } from "../warpMath";
import { iconUrl, slugToName } from "../data/characters";
import { LIGHT_CONES, lcIconUrl, lcSlugToName } from "../data/lightcones";
import { CharPicker } from "./CharPicker";

interface Props {
  jades: number;
  passes: number;
  data: WarpData;
  onChange: (d: WarpData) => void;
}

const INCOME_PRESETS = [
  { label: "F2P", warps: 40 },
  { label: "Express", warps: 54 },
  { label: "BP+Ex", warps: 59 },
];

function Toggle({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={onChange}
      className="relative shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: 36, height: 20,
        background: value ? "#72e8a8" : "#1f2d52",
        border: `1.5px solid ${value ? "#72e8a860" : "#ffffff10"}`,
      }}
    >
      <span
        className="absolute top-0.5 rounded-full bg-white shadow transition-all duration-200"
        style={{ width: 14, height: 14, left: value ? 18 : 3 }}
      />
    </button>
  );
}

function JointRow({ m, totalWarps: _totalWarps }: { m: JointMilestone; totalWarps: number }) {
  const pct = Math.round(m.successChance * 100);
  const color = pct >= 75 ? "#72e8a8" : pct >= 50 ? "#f0cc72" : pct >= 25 ? "#6095f8" : "#f87171";
  const rowBg = pct >= 75 ? "rgba(114,232,168,0.05)" : pct >= 50 ? "rgba(240,204,114,0.05)" : pct >= 25 ? "rgba(96,149,248,0.04)" : "transparent";
  const faded = pct < 1;
  return (
    <div className="grid items-center border-b transition-all"
      style={{ gridTemplateColumns: "90px 1fr", background: rowBg, opacity: faded ? 0.38 : 1, borderColor: "var(--t-border1)" }}>
      {/* Goal chip */}
      <div className="px-3 md:px-4 py-3">
        <span className="text-xs font-mono font-semibold rounded-full px-2 py-1"
          style={{ background: "rgba(255,255,255,0.06)", color: "#c8d0e8", letterSpacing: "0.04em" }}>
          {m.label}
        </span>
      </div>
      {/* Success bar + avg inline on mobile */}
      <div className="px-3 md:px-4 py-3 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, transition: "width 0.3s ease" }} />
        </div>
        <span className="w-10 text-right text-sm font-bold tabular-nums shrink-0" style={{ color }}>
          {pct === 100 ? "100%" : `${pct}%`}
        </span>
        <span className="hidden sm:inline text-sm tabular-nums w-16 text-right shrink-0" style={{ color: "rgba(168,180,208,0.7)" }}>
          {Math.round(m.average)} <span className="text-xs" style={{ color: "rgba(168,180,208,0.35)" }}>avg</span>
        </span>
      </div>
    </div>
  );
}

function NumIn({ label, value, onChange, min = 0, max, w = "w-16" }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; w?: string;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm text-muted">{label}</span>
      <input
        type="number" value={value} min={min} max={max}
        onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) onChange(Math.max(min, max !== undefined ? Math.min(max, v) : v)); }}
        className={`${w} bg-panel-2/60 rounded-lg px-2 py-1.5 text-sm text-cream outline-none border border-transparent focus:border-gold/30 focus:bg-panel-2 text-center`}
      />
    </label>
  );
}

function Sep() {
  return <div className="w-px self-stretch bg-panel-2/80" />;
}

export function WarpCalculator({ jades, passes, data, onChange }: Props) {
  const patch = (p: Partial<WarpData>) => onChange({ ...data, ...p });
  const [picker, setPicker] = useState<"char" | "lc" | null>(null);
  const [strategy, setStrategy] = useState<Strategy>("e0");

  const results = useMemo(() =>
    computeWarpResults(
      jades, passes, data.starlightRate, data.phases,
      data.charPity, data.charGuaranteed,
      data.lcPity, data.lcGuaranteed,
      data.bannerKind === "new" ? -1 : data.currentEidolon,
      data.bannerKind === "new" ? 0 : data.currentSuperimposition,
      strategy,
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jades, passes, data.starlightRate, data.phases, data.charPity, data.charGuaranteed,
     data.lcPity, data.lcGuaranteed, data.bannerKind, data.currentEidolon, data.currentSuperimposition, strategy],
  );

  const effE = data.bannerKind === "new" ? -1 : data.currentEidolon;
  const effS = data.bannerKind === "new" ? 0 : data.currentSuperimposition;

  // Strategy options: only goals still achievable from current state
  const strategyOptions = useMemo(() => {
    const opts: { value: Strategy; label: string }[] = [];
    if (effS < 5) opts.push({ value: "s1", label: `S${effS + 1} first` });
    for (let e = effE + 1; e <= 6; e++) {
      opts.push({ value: `e${e}` as Strategy, label: `E${e} first` });
    }
    return opts;
  }, [effE, effS]);

  const showStrategy = results.charMilestones.length > 0 && results.lcMilestones.length > 0;

  const addPhase = (label: string, warps: number) =>
    patch({ phases: [...data.phases, { id: genId("ph"), label, warps }] });
  const updatePhase = (id: string, p: Partial<WarpPhase>) =>
    patch({ phases: data.phases.map((ph) => ph.id === id ? { ...ph, ...p } : ph) });
  const removePhase = (id: string) =>
    patch({ phases: data.phases.filter((ph) => ph.id !== id) });

  const phaseWarps = data.phases.reduce((s, p) => s + p.warps, 0);

  return (
    <>
    <div className="flex flex-col gap-6">

      {/* ── Hero ── */}
      <div className="relative rounded-2xl bg-panel border border-panel-2 overflow-hidden" style={{ height: "clamp(220px, 40vw, 460px)" }}>

        {/* Character portrait — left side, large */}
        {data.charSlug && (
          <img
            src={iconUrl(data.charSlug)} aria-hidden
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="pointer-events-none absolute select-none"
            style={{
              left: 0, top: "-12%",
              height: "124%", width: "52%",
              objectFit: "cover", objectPosition: "top center",
              maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
            }}
          />
        )}

        {/* LC portrait — right side, large */}
        {data.lcSlug && (
          <img
            src={lcIconUrl(data.lcSlug)} aria-hidden
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="pointer-events-none absolute select-none"
            style={{
              right: 0, top: "-12%",
              height: "124%", width: "52%",
              objectFit: "cover", objectPosition: "top center",
              maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            }}
          />
        )}

        {/* Dark vignette to make center text pop */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(14,22,48,0.15) 0%, rgba(14,22,48,0.5) 100%)" }} />

        {/* Center info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
          <div className="text-6xl font-bold tabular-nums leading-none" style={{
            color: "#f0cc72",
            textShadow: "0 0 32px rgba(240,204,114,0.5), 0 2px 8px rgba(0,0,0,0.8)",
          }}>
            {results.totalWarps}
          </div>
          <div className="text-sm text-muted/80 font-medium mt-1">total warps</div>
          <div className="text-xs text-muted/50 mt-0.5">
            {jades.toLocaleString()} jade · {passes} pass{phaseWarps > 0 ? ` · +${phaseWarps} phases` : ""}
          </div>
        </div>

        {/* Character name — bottom left */}
        <button
          onClick={() => setPicker("char")}
          className="absolute bottom-4 left-5 text-left group pointer-events-auto rounded-xl px-3 py-2"
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div className="text-[10px] text-muted/60 mb-0.5 group-hover:text-gold/60 transition-colors uppercase tracking-wider">Character</div>
          <div className="text-base font-semibold text-cream group-hover:text-gold transition-colors leading-tight drop-shadow-lg">
            {slugToName(data.charSlug) || <span className="text-muted/60 text-sm font-normal">pick ↗</span>}
          </div>
          {data.bannerKind === "rerun" && effE >= 0 && (
            <div className="text-xs text-purple mt-0.5">E{effE}</div>
          )}
        </button>

        {/* LC name — bottom right */}
        <button
          onClick={() => setPicker("lc")}
          className="absolute bottom-4 right-5 text-right group pointer-events-auto rounded-xl px-3 py-2"
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div className="text-[10px] text-muted/60 mb-0.5 group-hover:text-gold/60 transition-colors uppercase tracking-wider">Light Cone</div>
          <div className="text-base font-semibold text-cream group-hover:text-gold transition-colors leading-tight drop-shadow-lg">
            {lcSlugToName(data.lcSlug) || <span className="text-muted/60 text-sm font-normal">pick ↗</span>}
          </div>
          {data.bannerKind === "rerun" && effS > 0 && (
            <div className="text-xs text-blue mt-0.5">S{effS}</div>
          )}
        </button>
      </div>

      {/* ── Settings ── */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--t-bg1)", border: "1.5px solid var(--t-border0)" }}>

        {/* Row 1: Pity + guaranteed */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-3">
            <NumIn label="Char pity" value={data.charPity} onChange={(v) => patch({ charPity: v })} min={0} max={89} />
            <Toggle value={data.charGuaranteed} onChange={() => patch({ charGuaranteed: !data.charGuaranteed })} label="Character guaranteed" />
            <span className="text-sm" style={{ color: data.charGuaranteed ? "#72e8a8" : "#a8b4d0" }}>
              Guaranteed
            </span>
          </div>

          <Sep />

          <div className="flex items-center gap-3">
            <NumIn label="LC pity" value={data.lcPity} onChange={(v) => patch({ lcPity: v })} min={0} max={79} />
            <Toggle value={data.lcGuaranteed} onChange={() => patch({ lcGuaranteed: !data.lcGuaranteed })} label="Light cone guaranteed" />
            <span className="text-sm" style={{ color: data.lcGuaranteed ? "#72e8a8" : "#a8b4d0" }}>
              Guaranteed
            </span>
          </div>
        </div>

        {/* Row 2: Banner kind + refund rate */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex rounded-lg overflow-hidden border border-panel-2 text-sm shrink-0">
            {(["new", "rerun"] as const).map((k) => (
              <button key={k} onClick={() => patch({ bannerKind: k })} className="px-4 py-1.5 capitalize transition-colors"
                style={{ background: data.bannerKind === k ? "#1f2d52" : "transparent", color: data.bannerKind === k ? "#f2ece0" : "#a8b4d0" }}>
                {k}
              </button>
            ))}
          </div>

          <Sep />

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Starlight refunds</span>
            {(["unlucky", "average", "lucky"] as StarlightRate[]).map((r, i) => (
              <button key={r} onClick={() => patch({ starlightRate: r })}
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: data.starlightRate === r ? "#f2ece0" : "#a8b4d0" }}>
                <span className="w-3 h-3 rounded-full border flex items-center justify-center shrink-0"
                  style={{ borderColor: data.starlightRate === r ? "#f0cc72" : "#a8b4d0" }}>
                  {data.starlightRate === r && <span className="w-1.5 h-1.5 rounded-full bg-gold block" />}
                </span>
                {["4%", "7.5%", "11%"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* Rerun: current E/S */}
        {data.bannerKind === "rerun" && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center pt-1 border-t border-panel-2/60">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted shrink-0">Current E</span>
              {([-1, 0, 1, 2, 3, 4, 5] as const).map((e) => (
                <button key={e} onClick={() => patch({ currentEidolon: e })}
                  className="rounded-lg px-2 py-1 text-xs border transition-colors"
                  style={{
                    background: data.currentEidolon === e ? "#c09df015" : "transparent",
                    color: data.currentEidolon === e ? "#c09df0" : "#a8b4d0",
                    borderColor: data.currentEidolon === e ? "#c09df040" : "#1f2d52",
                  }}>
                  {e === -1 ? "—" : `E${e}`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted shrink-0">Current S</span>
              {([0, 1, 2, 3, 4] as const).map((s) => (
                <button key={s} onClick={() => patch({ currentSuperimposition: s })}
                  className="rounded-lg px-2 py-1 text-xs border transition-colors"
                  style={{
                    background: data.currentSuperimposition === s ? "#6095f815" : "transparent",
                    color: data.currentSuperimposition === s ? "#6095f8" : "#a8b4d0",
                    borderColor: data.currentSuperimposition === s ? "#6095f840" : "#1f2d52",
                  }}>
                  {s === 0 ? "—" : `S${s}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phases */}
        <div className="flex flex-wrap gap-2 items-center pt-1 border-t border-panel-2/60">
          <span className="text-sm text-muted">Phases:</span>
          {data.phases.map((ph) => (
            <div key={ph.id} className="flex items-center gap-1 bg-panel-2/40 rounded-lg px-2.5 py-1">
              <input value={ph.label} onChange={(e) => updatePhase(ph.id, { label: e.target.value })}
                className="bg-transparent text-xs text-cream outline-none w-20" />
              <input type="number" value={ph.warps} min={0}
                onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 0) updatePhase(ph.id, { warps: v }); }}
                className="bg-transparent text-xs text-gold outline-none w-8 text-center" />
              <span className="text-xs text-muted">w</span>
              <button onClick={() => removePhase(ph.id)} className="text-muted hover:text-red-400 text-xs ml-1">✕</button>
            </div>
          ))}
          {INCOME_PRESETS.map((p) => (
            <button key={p.label} onClick={() => addPhase(p.label, p.warps)}
              className="text-xs rounded-lg px-2.5 py-1 border border-dashed border-panel-2 text-muted hover:text-gold hover:border-gold/30 transition-colors">
              + {p.label}
            </button>
          ))}
          <button onClick={() => addPhase("Phase", 40)}
            className="text-xs rounded-lg px-2.5 py-1 border border-dashed border-panel-2/60 text-muted hover:text-gold transition-colors">
            + custom
          </button>
        </div>
      </div>

      {/* ── Results table ── */}
      {results.jointMilestones.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--t-border0)" }}>
          {/* Strategy picker bar */}
          {showStrategy && (
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-b"
              style={{ borderColor: "var(--t-border0)", background: "var(--t-bg-subtle)" }}>
              <span className="text-xs" style={{ color: "rgba(168,180,208,0.45)" }}>Strategy:</span>
              <select
                aria-label="Strategy"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as Strategy)}
                className="text-xs rounded-lg px-2 py-1 outline-none cursor-pointer border"
                style={{
                  background: "rgba(31,45,82,0.8)",
                  color: "rgba(242,236,224,0.85)",
                  borderColor: "rgba(31,45,82,0.9)",
                }}
              >
                {strategyOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}
          {/* Column headers */}
          <div className="grid border-b text-xs font-medium uppercase tracking-wider"
            style={{ gridTemplateColumns: "var(--row-cols, 90px 1fr)", borderColor: "var(--t-border0)", background: "var(--t-bg-subtle)" }}>
            <div className="px-3 md:px-4 py-2.5" style={{ color: "rgba(168,180,208,0.5)" }}>Goal</div>
            <div className="px-3 md:px-4 py-2.5" style={{ color: "rgba(168,180,208,0.5)" }}>
              Success chance with {results.totalWarps} warps
            </div>
            <div className="hidden sm:block px-4 py-2.5 text-right" style={{ color: "rgba(168,180,208,0.5)" }}>Avg warps needed</div>
          </div>
          {results.jointMilestones.map((m) => (
            <JointRow key={m.label} m={m} totalWarps={results.totalWarps} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-center py-4" style={{ color: "rgba(168,180,208,0.25)" }}>
          {effE >= 6 && effS >= 5 ? "Already E6 S5 ✓" : "Nothing to calculate."}
        </p>
      )}

      <p className="text-xs text-center" style={{ color: "rgba(168,180,208,0.2)" }}>
        exact math · char 56.25% rate-up · LC 78.125%
      </p>
    </div>

    {picker === "char" && (
      <CharPicker
        title="Select Character"
        selected={data.charSlug}
        onSelect={(slug) => { patch({ charSlug: slug }); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
    )}
    {picker === "lc" && (
      <CharPicker
        title="Select Light Cone"
        items={LIGHT_CONES}
        iconUrlFn={lcIconUrl}
        selected={data.lcSlug}
        onSelect={(slug) => { patch({ lcSlug: slug }); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
    )}
    </>
  );
}
