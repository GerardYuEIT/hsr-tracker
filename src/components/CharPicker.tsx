import { useState, useEffect } from "react";
import {
  CHARACTERS, ELEMENTS, PATHS,
  ELEMENT_COLOR, PATH_COLOR,
  iconUrl, elementIconUrl, pathIconUrl, charRarity,
} from "../data/characters";
import type { Element, Path } from "../data/characters";
import { Stars } from "./Stars";

interface PickerItem {
  slug: string;
  name: string;
  element?: Element;
  path?: Path;
  rarity?: 3 | 4 | 5;
}

interface CharPickerProps {
  selected: string;
  onSelect: (slug: string) => void;
  onClose: () => void;
  title?: string;
  items?: PickerItem[];
  iconUrlFn?: (slug: string) => string;
}

export function CharPicker({
  selected,
  onSelect,
  onClose,
  title = "Select Character",
  items = CHARACTERS,
  iconUrlFn = iconUrl,
}: CharPickerProps) {
  const [search, setSearch]             = useState("");
  const [filterEl, setFilterEl]         = useState<Element | null>(null);
  const [filterPath, setFilterPath]     = useState<Path | null>(null);
  const [filterRarity, setFilterRarity] = useState<3 | 4 | 5 | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasElementFilters = items.some((i) => i.element);
  const hasRarityFilters  = items.some((i) => i.rarity);

  const filtered = items.filter((c) => {
    if (search       && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterEl     && c.element !== filterEl)     return false;
    if (filterPath   && c.path    !== filterPath)   return false;
    if (filterRarity && c.rarity  !== filterRarity) return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(4,6,16,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-3xl overflow-hidden"
        style={{
          width: "min(940px, 96vw)",
          maxHeight: "92dvh",
          background: "var(--t-modal)",
          border: "1.5px solid rgba(240,204,114,0.10)",
          boxShadow: "0 0 100px rgba(0,0,0,0.95), 0 0 50px rgba(240,204,114,0.03)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-4 px-5 pt-5 pb-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4a5a7a" }}>{title}</span>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style={{ color: "#4a5a7a" }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="6.5" cy="6.5" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "var(--t-text0)",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e)  => { e.currentTarget.style.borderColor = "rgba(240,204,114,0.32)"; }}
                onBlur={(e)   => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all shrink-0"
            style={{ color: "#a8b4d0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f2ece0"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#a8b4d0"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >✕</button>
        </div>

        {/* ── Filters ── */}
        {(hasRarityFilters || hasElementFilters) && (
          <div className="px-5 py-3 flex flex-col gap-2.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

            {hasRarityFilters && (
              <div className="flex gap-1.5">
                {([null, 5, 4, 3] as const).map((r) => {
                  const active = filterRarity === r;
                  const label  = r === null ? "All" : `${r}★`;
                  const color  = r === 5 ? "#f0cc72" : r === 4 ? "#c084fc" : r === 3 ? "#6095f8" : "#f2ece0";
                  return (
                    <button key={String(r)} onClick={() => setFilterRarity(r)}
                      className="rounded-lg px-3 py-1 text-xs font-semibold transition-all"
                      style={{
                        background: active ? `${color}20` : "rgba(255,255,255,0.03)",
                        color: active ? color : "#4a5a7a",
                        border: `1px solid ${active ? `${color}50` : "rgba(255,255,255,0.07)"}`,
                        boxShadow: active ? `0 0 8px ${color}30` : "none",
                      }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {hasElementFilters && (
              <>
                <div className="flex gap-1.5 flex-wrap items-center">
                  <button onClick={() => setFilterEl(null)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                    style={{
                      background: filterEl === null ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                      color: filterEl === null ? "#f2ece0" : "#4a5a7a",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>All</button>
                  {ELEMENTS.map((el) => {
                    const active = filterEl === el;
                    const c = ELEMENT_COLOR[el];
                    return (
                      <button key={el} onClick={() => setFilterEl(filterEl === el ? null : el)} title={el}
                        className="rounded-lg p-1.5 transition-all"
                        style={{
                          background: active ? `${c}30` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? `${c}70` : "rgba(255,255,255,0.07)"}`,
                          boxShadow: active ? `0 0 10px ${c}40` : "none",
                          transform: active ? "translateY(-1px)" : "none",
                        }}>
                        <img src={elementIconUrl(el)} alt={el} className="w-5 h-5"
                          style={{ filter: active ? "none" : "brightness(0.4) saturate(0.3)" }} />
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-1.5 flex-wrap items-center">
                  <button onClick={() => setFilterPath(null)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                    style={{
                      background: filterPath === null ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                      color: filterPath === null ? "#f2ece0" : "#4a5a7a",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>All</button>
                  {PATHS.map((p) => {
                    const active = filterPath === p;
                    const c = PATH_COLOR[p];
                    return (
                      <button key={p} onClick={() => setFilterPath(filterPath === p ? null : p)} title={p}
                        className="rounded-lg p-1.5 transition-all"
                        style={{
                          background: active ? `${c}30` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? `${c}70` : "rgba(255,255,255,0.07)"}`,
                          boxShadow: active ? `0 0 10px ${c}40` : "none",
                          transform: active ? "translateY(-1px)" : "none",
                        }}>
                        <img src={pathIconUrl(p)} alt={p} className="w-5 h-5"
                          style={{ filter: active ? "none" : "brightness(0.4) saturate(0.3)" }} />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Grid ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="text-4xl opacity-20">◈</div>
              <p className="text-sm" style={{ color: "#4a5a7a" }}>No results match these filters.</p>
            </div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))" }}>

              {/* None */}
              <button
                onClick={() => onSelect("")}
                className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  aspectRatio: "3/4",
                  background: selected === "" ? "rgba(240,204,114,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1.5px solid ${selected === "" ? "rgba(240,204,114,0.45)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: selected === "" ? "0 0 20px rgba(240,204,114,0.12)" : "none",
                  transform: selected === "" ? "translateY(-2px)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (selected !== "") {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selected !== "") {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.transform = "none";
                  }
                }}
              >
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-3xl font-thin" style={{ color: "#2a3a5a" }}>—</span>
                </div>
                <div className="px-2 pb-2">
                  <div className="rounded-lg py-1 flex items-center justify-center"
                    style={{ background: "rgba(6,9,20,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-[9px] font-semibold" style={{ color: "#4a5a7a" }}>None</span>
                  </div>
                </div>
              </button>

              {filtered.map((c) => {
                const isSel  = selected === c.slug;
                const accent = c.element ? ELEMENT_COLOR[c.element] : "#f0cc72";
                const rarity = c.rarity ?? charRarity(c.slug);
                const showStars = rarity >= 4;

                return (
                  <button
                    key={c.slug}
                    onClick={() => onSelect(c.slug)}
                    className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                    style={{
                      aspectRatio: "3/4",
                      background: `linear-gradient(155deg, ${accent}55 0%, ${accent}22 45%, #060914 100%)`,
                      border: `1.5px solid ${isSel ? `${accent}80` : `${accent}22`}`,
                      boxShadow: isSel
                        ? `0 0 28px ${accent}40, 0 8px 32px rgba(0,0,0,0.7)`
                        : `0 0 6px ${accent}08`,
                      transform: isSel ? "translateY(-3px) scale(1.04)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel) {
                        e.currentTarget.style.borderColor = `${accent}55`;
                        e.currentTarget.style.boxShadow = `0 0 18px ${accent}25, 0 8px 24px rgba(0,0,0,0.55)`;
                        e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel) {
                        e.currentTarget.style.borderColor = `${accent}22`;
                        e.currentTarget.style.boxShadow = `0 0 6px ${accent}08`;
                        e.currentTarget.style.transform = "none";
                      }
                    }}
                  >
                    {/* Portrait */}
                    <img
                      src={iconUrlFn(c.slug)}
                      alt={c.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />

                    {/* Element icon */}
                    {c.element && (
                      <div className="absolute top-1.5 left-1.5 rounded-md p-0.5"
                        style={{ background: "rgba(4,6,16,0.75)", border: `1px solid ${accent}28`, backdropFilter: "blur(4px)" }}>
                        <img src={elementIconUrl(c.element)} alt={c.element} className="w-3 h-3" />
                      </div>
                    )}

                    {/* Selected checkmark */}
                    {isSel && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: accent, color: "#06091a", boxShadow: `0 0 12px ${accent}` }}>
                        ✓
                      </div>
                    )}

                    {/* Bottom fade */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(4,6,16,0.92) 0%, rgba(4,6,16,0.28) 42%, transparent 65%)" }} />

                    {/* Stars */}
                    {showStars && (
                      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                        <Stars count={rarity as 4 | 5} size={8} />
                      </div>
                    )}

                    {/* Name pill */}
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5">
                      <div className="rounded-lg px-1 py-1 flex items-center justify-center"
                        style={{ background: "rgba(4,6,16,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <span className="text-[9px] font-semibold text-center leading-tight line-clamp-1 w-full"
                          style={{ color: "#f2ece0" }}>{c.name}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 flex items-center justify-between shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="text-xs" style={{ color: "#2a3a5a" }}>
            {filtered.length} {hasRarityFilters ? "item" : "character"}{filtered.length !== 1 ? "s" : ""}
          </span>
          <button onClick={onClose}
            className="text-xs rounded-lg px-3 py-1.5 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", color: "#4a5a7a", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f2ece0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#4a5a7a"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >Close</button>
        </div>
      </div>
    </div>
  );
}
