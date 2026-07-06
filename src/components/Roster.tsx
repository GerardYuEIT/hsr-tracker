import { useState, useMemo } from "react";
import {
  CHARACTERS, ELEMENTS, PATHS,
  ELEMENT_COLOR, PATH_COLOR,
  iconUrl, portraitUrl, slugToName, elementIconUrl, pathIconUrl, charRarity,
} from "../data/characters";
import type { Element, Path } from "../data/characters";
import { LIGHT_CONES, lcIconUrl, lcRarity } from "../data/lightcones";
import type { RosterEntry } from "../types";
import { CharPicker } from "./CharPicker";
import { Stars } from "./Stars";


interface Props {
  data: Record<string, RosterEntry>;
  onChange: (d: Record<string, RosterEntry>) => void;
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function CharDetailModal({ slug, entry, onUpdate, onRemove, onClose }: {
  slug: string;
  entry: RosterEntry;
  onUpdate: (e: RosterEntry) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [lcPicker, setLcPicker] = useState(false);
  const char   = CHARACTERS.find((c) => c.slug === slug);
  const accent = char?.element ? ELEMENT_COLOR[char.element] : "#f0cc72";
  const lc     = entry.lc ? LIGHT_CONES.find((l) => l.slug === entry.lc) : null;

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "var(--t-scrim)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-3xl overflow-hidden w-[min(540px,95vw)] max-h-[92dvh]"
        style={{
          background: "var(--t-modal)",
          border: `1.5px solid ${accent}30`,
          boxShadow: `0 0 100px ${accent}28, 0 40px 100px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Art header ── */}
        <div className="relative overflow-hidden shrink-0" style={{ height: 320, background: "#06091a" }}>

          {/* CDN splash — blurred atmospheric background */}
          <img src={portraitUrl(slug)} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: "65% 35%",
              filter: "blur(14px) brightness(0.38) saturate(1.6)",
              transform: "scale(1.08)",
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />

          {/* Element colour wash over the blur */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, ${accent}22 0%, transparent 60%)`,
          }} />

          {/* Card webp — left side, full height, fades into splash on the right */}
          <img src={iconUrl(slug)} alt={char?.name ?? slug}
            className="absolute bottom-0 left-0 h-full"
            style={{
              width: "auto",
              maskImage: "linear-gradient(to right, black 55%, transparent 92%)",
              WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 92%)",
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />

          {/* Right-side + bottom fade — kills the exposed blur on the right */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to left, rgba(6,9,20,0.97) 0%, rgba(6,9,20,0.6) 40%, transparent 65%), linear-gradient(to bottom, transparent 45%, rgba(6,9,20,0.7) 80%, rgba(6,9,20,0.97) 100%)",
          }} />

          {/* Top bar: element + path pills + close */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-2">
              {char?.element && (
                <div className="flex items-center gap-1.5 rounded-xl pl-1.5 pr-2.5 py-1.5"
                  style={{ background: "rgba(6,9,20,0.75)", backdropFilter: "blur(10px)", border: `1px solid ${accent}45` }}>
                  <img src={elementIconUrl(char.element)} alt={char.element} className="w-4 h-4" />
                  <span className="text-[11px] font-semibold" style={{ color: accent }}>{char.element}</span>
                </div>
              )}
              {char?.path && (
                <div className="flex items-center gap-1.5 rounded-xl pl-1.5 pr-2.5 py-1.5"
                  style={{ background: "rgba(6,9,20,0.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img src={pathIconUrl(char.path)} alt={char.path} className="w-4 h-4 opacity-75" />
                  <span className="text-[11px]" style={{ color: "rgba(168,180,208,0.75)" }}>{char.path}</span>
                </div>
              )}
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors"
              style={{ background: "rgba(6,9,20,0.75)", backdropFilter: "blur(10px)", color: "#a8b4d0", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f2ece0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a8b4d0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >✕</button>
          </div>

          {/* Name block — bottom right */}
          <div className="absolute bottom-4 right-5 text-right" style={{ maxWidth: "52%" }}>
            <h2 className="text-2xl font-bold leading-tight" style={{
              color: "#f2ece0",
              textShadow: `0 0 40px ${accent}60, 0 2px 12px rgba(0,0,0,0.9)`,
            }}>
              {char?.name ?? slugToName(slug)}
            </h2>
            <div className="flex justify-end mt-1">
              <Stars count={charRarity(slug)} size={10} />
            </div>
            {entry.eidolon > 0 && (
              <span className="inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}50` }}>
                E{entry.eidolon}
              </span>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="px-5 pt-5 pb-5 flex flex-col gap-5 overflow-y-auto">

          {/* Eidolons */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--t-text2)" }}>Eidolons</span>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6].map((e) => {
                const filled  = e <= entry.eidolon;
                const current = e === entry.eidolon;
                return (
                  <button key={e} onClick={() => onUpdate({ ...entry, eidolon: e })}
                    className="flex-1 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-150"
                    style={{
                      height: 38,
                      background: filled ? (current ? accent : `${accent}55`) : "rgba(255,255,255,0.04)",
                      color: filled ? (current ? "#06091a" : `${accent}cc`) : "#2a3a5a",
                      border: current ? `1.5px solid ${accent}` : filled ? `1.5px solid ${accent}40` : "1.5px solid rgba(255,255,255,0.06)",
                      boxShadow: current ? `0 0 16px ${accent}55` : "none",
                      transform: current ? "translateY(-2px)" : "none",
                    }}
                  >E{e}</button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

          {/* Light Cone */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--t-text2)" }}>Light Cone</span>
              {lc && (
                <button onClick={() => onUpdate({ ...entry, lc: undefined, si: undefined })}
                  className="text-[10px] transition-colors"
                  style={{ color: "rgba(248,113,113,0.45)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(248,113,113,0.45)"; }}
                >Remove</button>
              )}
            </div>

            {lc ? (
              <div className="flex flex-col gap-2">
                <button onClick={() => setLcPicker(true)}
                  className="flex items-center gap-3 rounded-2xl p-3 transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <div className="rounded-xl overflow-hidden shrink-0" style={{ width: 40, height: 50, background: "rgba(255,255,255,0.05)" }}>
                    <img src={lcIconUrl(lc.slug)} alt={lc.name}
                      className="w-full h-full object-contain"
                      style={{ transform: "scale(1.12)" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-cream truncate">{lc.name}</p>
                    {lcRarity(lc.slug) !== 3 && <Stars count={lcRarity(lc.slug) as 4 | 5} size={9} />}
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(168,180,208,0.4)" }}>Tap to change</p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg"
                      style={{ background: "rgba(96,149,248,0.15)", color: "#6095f8", border: "1px solid rgba(96,149,248,0.3)" }}>
                      S{entry.si ?? 1}
                    </span>
                  </div>
                </button>
                {/* SI selector */}
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const active = (entry.si ?? 1) === s;
                    return (
                      <button key={s} onClick={() => onUpdate({ ...entry, si: s })}
                        className="flex-1 rounded-xl text-xs font-bold transition-all duration-150"
                        style={{
                          height: 32,
                          background: active ? "rgba(96,149,248,0.18)" : "rgba(255,255,255,0.04)",
                          color: active ? "#6095f8" : "#2a3a5a",
                          border: `1px solid ${active ? "rgba(96,149,248,0.45)" : "rgba(255,255,255,0.06)"}`,
                          boxShadow: active ? "0 0 12px rgba(96,149,248,0.28)" : "none",
                          transform: active ? "translateY(-1px)" : "none",
                        }}
                      >S{s}</button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <button onClick={() => setLcPicker(true)}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all flex items-center justify-center gap-2"
                style={{ background: "rgba(96,149,248,0.05)", color: "rgba(96,149,248,0.55)", border: "1.5px dashed rgba(96,149,248,0.18)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(96,149,248,0.1)"; e.currentTarget.style.borderColor = "rgba(96,149,248,0.35)"; e.currentTarget.style.color = "#6095f8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(96,149,248,0.05)"; e.currentTarget.style.borderColor = "rgba(96,149,248,0.18)"; e.currentTarget.style.color = "rgba(96,149,248,0.55)"; }}
              >
                + Equip Light Cone
              </button>
            )}
          </div>

          {/* Remove */}
          <button onClick={onRemove}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(248,113,113,0.06)", color: "rgba(248,113,113,0.65)", border: "1px solid rgba(248,113,113,0.14)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.14)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.06)"; e.currentTarget.style.color = "rgba(248,113,113,0.65)"; }}
          >Remove from Roster</button>
        </div>
      </div>
    </div>

    {lcPicker && (
      <CharPicker
        title="Pick Light Cone"
        items={LIGHT_CONES}
        iconUrlFn={lcIconUrl}
        selected={entry.lc ?? ""}
        onSelect={(slug) => { onUpdate({ ...entry, lc: slug || undefined, si: slug ? (entry.si ?? 1) : undefined }); setLcPicker(false); }}
        onClose={() => setLcPicker(false)}
      />
    )}
    </>
  );
}

// ─── Roster card ──────────────────────────────────────────────────────────────

function RosterCard({ slug, entry, onClick }: { slug: string; entry: RosterEntry; onClick: () => void }) {
  const char   = CHARACTERS.find((c) => c.slug === slug);
  const accent = char?.element ? ELEMENT_COLOR[char.element] : "#f0cc72";
  const lc     = entry.lc ? LIGHT_CONES.find((l) => l.slug === entry.lc) : null;

  return (
    <button onClick={onClick}
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: `1.5px solid ${accent}30`,
        boxShadow: `0 0 12px ${accent}12`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}70`;
        e.currentTarget.style.boxShadow = `0 14px 36px rgba(0,0,0,0.6), 0 0 24px ${accent}30`;
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${accent}30`;
        e.currentTarget.style.boxShadow = `0 0 12px ${accent}12`;
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Portrait */}
      <div className="relative overflow-hidden" style={{
        aspectRatio: "3/4",
        background: `linear-gradient(155deg, ${accent}55 0%, ${accent}22 45%, #080c18 100%)`,
      }}>
        <img src={iconUrl(slug)} alt={char?.name ?? slug}
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />

        {/* Element icon — top left */}
        {char?.element && (
          <div className="absolute top-2 left-2 rounded-lg p-1" style={{
            background: "rgba(6,9,20,0.72)",
            border: `1px solid ${accent}35`,
            backdropFilter: "blur(6px)",
          }}>
            <img src={elementIconUrl(char.element)} alt={char.element} className="w-4 h-4" />
          </div>
        )}

        {/* Path icon — below element */}
        {char?.path && (
          <div className="absolute top-9 left-2 rounded-lg p-1" style={{
            background: "rgba(6,9,20,0.72)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
          }}>
            <img src={pathIconUrl(char.path)} alt={char.path} className="w-4 h-4 opacity-80" />
          </div>
        )}

        {/* Eidolon badge — top right */}
        {entry.eidolon > 0 && (
          <div className="absolute top-2 right-2 rounded-lg px-2 py-0.5 text-[10px] font-bold leading-none"
            style={{
              background: `${accent}25`,
              color: accent,
              border: `1px solid ${accent}55`,
              backdropFilter: "blur(6px)",
            }}>
            E{entry.eidolon}
          </div>
        )}

        {/* LC thumbnail — bottom right */}
        {lc && (
          <div className="absolute bottom-8 right-1.5 flex flex-col items-end gap-0.5">
            <div className="rounded-md overflow-hidden"
              style={{ width: 28, height: 35, background: "rgba(6,9,20,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <img src={lcIconUrl(lc.slug)} alt={lc.name}
                className="w-full h-full object-contain"
                style={{ transform: "scale(1.15)" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            </div>
            {entry.si && (
              <span className="text-[8px] font-bold px-1 py-0.5 rounded leading-none"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                S{entry.si}
              </span>
            )}
          </div>
        )}

        {/* Stars */}
        <div className="absolute bottom-9 left-0 right-0 flex justify-center pointer-events-none">
          <Stars count={charRarity(slug)} size={9} />
        </div>

        {/* Name pill — frosted glass at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
          <div className="rounded-xl px-2 py-1.5 flex items-center justify-center" style={{
            background: "rgba(6,9,20,0.62)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <p className="text-[11px] font-semibold text-center leading-tight line-clamp-1"
              style={{ color: "#f2ece0" }}>
              {char?.name ?? slugToName(slug)}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Filter dropdowns ─────────────────────────────────────────────────────────

function FilterDropdown<T extends string>({ label, options, value, onChange, getColor, getIcon }: {
  label: string;
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  getColor: (v: T) => string;
  getIcon: (v: T) => string;
}) {
  const [open, setOpen] = useState(false);
  const color = value ? getColor(value) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm border transition-all"
        style={{
          background: value ? `${color}15` : "var(--t-bg1)",
          color: value ? color! : "var(--t-text1)",
          borderColor: value ? `${color}45` : "var(--t-border0)",
          boxShadow: value ? `0 0 12px ${color}20` : "none",
        }}
      >
        {value
          ? <><img src={getIcon(value)} alt={value} className="w-4 h-4" />{value}</>
          : label}
        <svg className="w-3 h-3 opacity-50" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 z-20 rounded-2xl overflow-hidden py-1"
            style={{ background: "var(--t-modal)", border: "1px solid var(--t-border0)", minWidth: 170, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full px-4 py-2.5 text-sm text-left transition-colors"
              style={{ color: !value ? "#f2ece0" : "var(--t-text2)", background: !value ? "rgba(255,255,255,0.05)" : "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = !value ? "rgba(255,255,255,0.05)" : "transparent"; }}
            >All {label}s</button>
            {options.map((opt) => {
              const c = getColor(opt);
              const active = value === opt;
              return (
                <button key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="w-full px-4 py-2.5 text-sm text-left flex items-center gap-2.5 transition-colors"
                  style={{ background: active ? `${c}18` : "transparent", color: active ? c : "var(--t-text1)" }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <img src={getIcon(opt)} alt={opt} className="w-4 h-4 shrink-0"
                    style={{ filter: active ? "none" : "brightness(0.6) saturate(0.5)" }} />
                  <span className="flex-1">{opt}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Roster({ data, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected]     = useState<string | null>(null);
  const [filterEl, setFilterEl]     = useState<Element | null>(null);
  const [filterPath, setFilterPath] = useState<Path | null>(null);

  const owned = Object.keys(data);

  const visible = useMemo(() =>
    owned.filter((s) => {
      const c = CHARACTERS.find((ch) => ch.slug === s);
      if (filterEl   && c?.element !== filterEl)  return false;
      if (filterPath && c?.path    !== filterPath) return false;
      return true;
    }),
    [owned, filterEl, filterPath]
  );

  const add    = (slug: string) => { if (!slug || data[slug] !== undefined) return; onChange({ ...data, [slug]: { eidolon: 0 } }); };
  const remove = (slug: string) => { const n = { ...data }; delete n[slug]; onChange(n); setSelected(null); };
  const update = (slug: string, entry: RosterEntry) => onChange({ ...data, [slug]: entry });

  return (
    <div className="flex flex-col gap-5">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
          style={{ background: "rgba(240,204,114,0.1)", color: "#f0cc72", border: "1.5px solid rgba(240,204,114,0.28)" }}
        >
          <span className="text-base leading-none">+</span> Add
        </button>

        {owned.length > 0 && (
          <>
            <FilterDropdown
              label="Element" options={ELEMENTS} value={filterEl}
              onChange={setFilterEl}
              getColor={(el) => ELEMENT_COLOR[el]}
              getIcon={(el) => elementIconUrl(el)}
            />
            <FilterDropdown
              label="Path" options={PATHS} value={filterPath}
              onChange={setFilterPath}
              getColor={(p) => PATH_COLOR[p]}
              getIcon={(p) => pathIconUrl(p)}
            />
            {(filterEl || filterPath) && (
              <button onClick={() => { setFilterEl(null); setFilterPath(null); }}
                className="text-xs rounded-xl px-3 py-2 border transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", color: "var(--t-text2)", borderColor: "var(--t-border0)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >Clear</button>
            )}
            <span className="text-sm ml-auto" style={{ color: "var(--t-text2)" }}>
              {visible.length === owned.length ? `${owned.length} characters` : `${visible.length} / ${owned.length}`}
            </span>
          </>
        )}
      </div>

      {/* ── Grid ── */}
      {owned.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="text-5xl opacity-20">★</div>
          <p className="text-muted text-sm">No characters added yet.<br />Hit "Add" to build your roster.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="text-4xl opacity-20">◈</div>
          <p className="text-muted text-sm">No characters match this filter.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
          {visible.map((slug) => (
            <RosterCard key={slug} slug={slug} entry={data[slug]} onClick={() => setSelected(slug)} />
          ))}
        </div>
      )}

      {selected && (
        <CharDetailModal
          slug={selected}
          entry={data[selected] ?? { eidolon: 0 }}
          onUpdate={(e) => update(selected, e)}
          onRemove={() => remove(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {pickerOpen && (
        <CharPicker
          title="Add to Roster"
          selected=""
          onSelect={(slug) => { add(slug); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
