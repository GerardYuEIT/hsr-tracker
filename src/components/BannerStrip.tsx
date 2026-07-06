import { useState } from "react";
import type { BannerGroup, BannerItem } from "../data/banners";
import { ELEMENT_COLOR } from "../data/banners";
import { useBanners, formatCountdown, formatStartDate } from "../hooks/useBanners";
import { iconUrl } from "../data/characters";
import { lcIconUrl } from "../data/lightcones";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function itemArtSrc(item: BannerItem, type: "char" | "lc"): string {
  if (item.iconUrl) return item.iconUrl;
  if (item.slug)    return type === "char" ? iconUrl(item.slug) : lcIconUrl(item.slug);
  return "";
}

function elementAccent(items: BannerItem[]): string {
  const el = items.find(i => i.rarity === 5)?.element;
  return el ? ELEMENT_COLOR[el] ?? "#f0cc72" : "#f0cc72";
}

// ─── Small portrait circle / LC card ─────────────────────────────────────────

function ItemThumb({ item, type, size }: { item: BannerItem; type: "char" | "lc"; size: number }) {
  const src = itemArtSrc(item, type);
  const isChar = type === "char";
  return (
    <div
      className={`shrink-0 overflow-hidden ${isChar ? "rounded-full" : "rounded-md"}`}
      style={{
        width: size,
        height: isChar ? size : Math.round(size * 1.25),
        background: "rgba(255,255,255,0.08)",
        border: "1.5px solid rgba(255,255,255,0.12)",
      }}
    >
      {src && (
        <img
          src={src} alt={item.name} loading="lazy" decoding="async"
          className="w-full h-full object-cover object-top"
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      )}
    </div>
  );
}

// ─── Banner card (char or LC side) ───────────────────────────────────────────

interface CardProps {
  group: BannerGroup;
  type: "char" | "lc";
  isLive: boolean;
  nowSec: number;
}

// ─── Combined card (char + LC, single timer) ─────────────────────────────────

function CombinedBannerCard({ group, isLive, nowSec }: { group: BannerGroup; isLive: boolean; nowSec: number }) {
  const charAccent = elementAccent(group.charFiveStars);
  const lcAccent   = "#6095f8";
  const bgSrc      = group.charFiveStars[0] ? itemArtSrc(group.charFiveStars[0], "char") : "";

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-xl"
      style={{
        background: "var(--t-bg1)",
        border: `1.5px solid ${isLive ? `${charAccent}50` : "var(--t-border0)"}`,
        boxShadow: isLive ? `0 0 18px ${charAccent}15` : "none",
      }}
    >
      {/* Faded art bg */}
      {bgSrc && (
        <img
          src={bgSrc} aria-hidden loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{ objectFit: "cover", objectPosition: "top", opacity: 0.12, filter: "blur(1.5px)" }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `linear-gradient(to bottom, ${charAccent}08 0%, rgba(14,22,48,0.55) 45%, rgba(11,17,36,0.97) 100%)`,
      }} />

      <div className="relative flex flex-col p-3 gap-2.5">
        {/* Two columns */}
        <div className="flex gap-2.5">
          {/* Character side */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `${charAccent}90` }}>
              Character
            </div>
            {group.charFiveStars.length === 0 ? (
              <span className="text-[10px] italic" style={{ color: "var(--t-text3)" }}>TBA</span>
            ) : group.charFiveStars.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <ItemThumb item={item} type="char" size={32} />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold leading-tight truncate" style={{ color: "var(--t-text0)" }}>
                    {item.name}
                  </div>
                  <div className="text-[9px]" style={{ color: `${charAccent}80` }}>★★★★★</div>
                </div>
              </div>
            ))}
            {group.charFourStars.length > 0 && (
              <div className="flex gap-0.5 mt-0.5">
                {group.charFourStars.slice(0, 3).map(item => (
                  <div key={item.name} title={item.name}>
                    <ItemThumb item={item} type="char" size={18} />
                  </div>
                ))}
                {group.charFourStars.length > 3 && (
                  <span className="text-[9px] self-end" style={{ color: "var(--t-text3)" }}>
                    +{group.charFourStars.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px self-stretch shrink-0" style={{ background: "var(--t-border1)" }} />

          {/* Light Cone side */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `${lcAccent}90` }}>
              Light Cone
            </div>
            {group.lcFiveStars.length === 0 ? (
              <span className="text-[10px] italic" style={{ color: "var(--t-text3)" }}>TBA</span>
            ) : group.lcFiveStars.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <ItemThumb item={item} type="lc" size={28} />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold leading-tight truncate" style={{ color: "var(--t-text0)" }}>
                    {item.name}
                  </div>
                  <div className="text-[9px]" style={{ color: `${lcAccent}80` }}>★★★★★</div>
                </div>
              </div>
            ))}
            {group.lcFourStars.length > 0 && (
              <div className="flex gap-0.5 mt-0.5">
                {group.lcFourStars.slice(0, 3).map(item => (
                  <div key={item.name} title={item.name}>
                    <ItemThumb item={item} type="lc" size={18} />
                  </div>
                ))}
                {group.lcFourStars.length > 3 && (
                  <span className="text-[9px] self-end" style={{ color: "var(--t-text3)" }}>
                    +{group.lcFourStars.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Single shared timer */}
        <div className="pt-2 border-t" style={{ borderColor: "var(--t-border1)" }}>
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px]" style={{ color: "var(--t-text2)" }}>ends</span>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: "#72e8a8" }}>
                {formatCountdown(group.endUtc - nowSec)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px]" style={{ color: "var(--t-text2)" }}>starts</span>
              <span className="text-[11px] font-semibold" style={{ color: "rgba(240,204,114,0.7)" }}>
                {formatStartDate(group.startUtc)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Phase section (header + combined card) ───────────────────────────────────

function PhaseSection({ group, nowSec }: { group: BannerGroup; nowSec: number }) {
  const isLive   = nowSec >= group.startUtc && nowSec < group.endUtc;
  const isUpNext = !isLive && nowSec < group.startUtc;

  return (
    <div className="flex flex-col gap-2">
      {/* Phase header */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-xs font-semibold" style={{ color: "var(--t-text1)" }}>
          v{group.version}{group.phase != null ? ` · Phase ${group.phase}` : ""}
        </span>

        {isLive ? (
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(114,232,168,0.12)",
              color: "#72e8a8",
              border: "1px solid rgba(114,232,168,0.3)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            Live
          </span>
        ) : isUpNext ? (
          <span className="text-[10px] font-medium" style={{ color: "rgba(240,204,114,0.5)" }}>
            {formatStartDate(group.startUtc)}
          </span>
        ) : null}
      </div>

      {/* Single combined card */}
      <CombinedBannerCard group={group} isLive={isLive} nowSec={nowSec} />
    </div>
  );
}

// ─── Full-page tab view ───────────────────────────────────────────────────────

function BigBannerCard({ group, type, isLive, nowSec }: CardProps) {
  const fiveStars = type === "char" ? group.charFiveStars : group.lcFiveStars;
  const fourStars = type === "char" ? group.charFourStars : group.lcFourStars;
  const accent     = elementAccent(fiveStars.length ? fiveStars : []);
  const typeAccent = type === "char" ? accent : "#6095f8";
  const bgItem     = fiveStars[0];
  const bgSrc      = bgItem ? itemArtSrc(bgItem, type) : "";

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl flex-1"
      style={{
        minHeight: 300,
        background: "linear-gradient(160deg, #141e38 0%, #0c1228 100%)",
        border: `1.5px solid ${isLive ? `${typeAccent}50` : "rgba(31,45,82,0.8)"}`,
        boxShadow: isLive ? `0 0 28px ${typeAccent}18` : "none",
      }}
    >
      {/* Art bg */}
      {bgSrc && (
        <img src={bgSrc} aria-hidden loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{ objectFit: "cover", objectPosition: "top center", opacity: 0.22 }}
          onError={e => { e.currentTarget.style.display = "none"; }} />
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${typeAccent}10 0%, rgba(12,18,40,0.55) 40%, rgba(10,15,32,0.97) 100%)` }} />

      <div className="relative flex flex-col h-full p-5 gap-3">
        {/* Type label */}
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: `${typeAccent}90` }}>
          {type === "char" ? "Character" : "Light Cone"}
        </span>

        {/* 5-stars */}
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {fiveStars.length === 0 ? (
            <span className="text-sm italic" style={{ color: "rgba(168,180,208,0.2)" }}>TBA</span>
          ) : fiveStars.map(item => (
            <div key={item.name} className="flex items-center gap-3">
              <ItemThumb item={item} type={type} size={type === "char" ? 54 : 44} />
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight" style={{ color: "#f2ece0" }}>{item.name}</div>
                <div className="text-xs mt-0.5" style={{ color: `${typeAccent}80` }}>★★★★★</div>
              </div>
            </div>
          ))}
        </div>

        {/* 4-stars */}
        {fourStars.length > 0 && (
          <div className="flex gap-1.5">
            {fourStars.slice(0, 5).map(item => (
              <div key={item.name} title={item.name}>
                <ItemThumb item={item} type={type} size={28} />
              </div>
            ))}
          </div>
        )}

        {/* Countdown / date */}
        <div className="pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {isLive ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">ends</span>
              <span className="text-sm font-bold tabular-nums" style={{ color: "#72e8a8" }}>
                {formatCountdown(group.endUtc - nowSec)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">starts</span>
              <span className="text-sm font-semibold" style={{ color: "rgba(240,204,114,0.7)" }}>
                {formatStartDate(group.startUtc)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BannersTab() {
  const { groups, nowMs } = useBanners();
  const nowSec = nowMs / 1000;
  const visible  = groups.filter(g => g.endUtc > nowSec - 3600);
  const live     = visible.filter(g => nowSec >= g.startUtc && nowSec < g.endUtc);
  const upcoming = visible.filter(g => nowSec < g.startUtc);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">

      {/* Live */}
      {live.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(168,180,208,0.45)" }}>
              v{live[0].version}{live[0].phase != null ? ` · Phase ${live[0].phase}` : ""}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{ background: "rgba(114,232,168,0.12)", color: "#72e8a8", border: "1px solid rgba(114,232,168,0.3)" }}>
              Live
            </span>
          </div>
          {live.map(group => (
            <div key={`${group.version}-${group.phase}`} className="flex gap-4">
              <BigBannerCard group={group} type="char" isLive={true} nowSec={nowSec} />
              <BigBannerCard group={group} type="lc"   isLive={true} nowSec={nowSec} />
            </div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(31,45,82,0.7)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "rgba(168,180,208,0.3)" }}>Upcoming</span>
            <div className="flex-1 h-px" style={{ background: "rgba(31,45,82,0.7)" }} />
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))" }}>
            {upcoming.map(group => (
              <div key={`${group.version}-${group.phase}`} className="flex flex-col gap-2">
                <span className="text-xs font-semibold px-0.5" style={{ color: "rgba(168,180,208,0.45)" }}>
                  v{group.version}{group.phase != null ? ` · Phase ${group.phase}` : ""}
                  <span className="ml-2 font-normal" style={{ color: "rgba(240,204,114,0.5)" }}>
                    {formatStartDate(group.startUtc)}
                  </span>
                </span>
                <div className="flex gap-3">
                  <BigBannerCard group={group} type="char" isLive={false} nowSec={nowSec} />
                  <BigBannerCard group={group} type="lc"   isLive={false} nowSec={nowSec} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <span className="text-sm text-muted">Loading banners…</span>
        </div>
      )}

      {/* Footer */}
      {visible.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="w-full h-px" style={{ background: "rgba(31,45,82,0.4)" }} />
          <div className="flex flex-col items-center gap-1 pt-4">
            <span className="text-sm" style={{ color: "rgba(168,180,208,0.2)" }}>✦</span>
            <span className="text-xs" style={{ color: "rgba(168,180,208,0.25)" }}>That's all! More banners will appear when announced.</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile expandable banner strip ──────────────────────────────────────────

export function BannerMobileStrip() {
  const [expanded, setExpanded] = useState(false);
  const { groups, nowMs } = useBanners();
  const nowSec = nowMs / 1000;
  const visible  = groups.filter(g => g.endUtc > nowSec - 3600);
  const live     = visible.filter(g => nowSec >= g.startUtc && nowSec < g.endUtc);

  if (visible.length === 0) return null;

  const liveChar = live[0]?.charFiveStars[0];
  const liveLc   = live[0]?.lcFiveStars[0];
  const timeLeft = live[0] ? formatCountdown(live[0].endUtc - nowSec) : null;
  return (
    <div className="md:hidden shrink-0" style={{ borderBottom: "1px solid var(--t-border2)" }}>

      {/* ── Collapsed header row ── */}
      <button
        className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors"
        style={{ background: expanded ? "var(--t-bg1)" : "transparent" }}
        onClick={() => setExpanded(e => !e)}
      >
        {live.length > 0 ? (
          <>
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: "rgba(114,232,168,0.12)", color: "#72e8a8", border: "1px solid rgba(114,232,168,0.28)" }}>
              Live
            </span>
            {liveChar && <ItemThumb item={liveChar} type="char" size={20} />}
            {liveChar && <span className="text-xs font-semibold shrink-0" style={{ color: "var(--t-text0)" }}>{liveChar.name}</span>}
            {liveLc   && <span className="text-[10px] shrink-0" style={{ color: "var(--t-text3)" }}>·</span>}
            {liveLc   && <ItemThumb item={liveLc} type="lc" size={16} />}
            {liveLc   && <span className="text-xs shrink-0 truncate" style={{ color: "var(--t-text2)" }}>{liveLc.name}</span>}
            {timeLeft && (
              <span className="text-xs font-bold tabular-nums ml-auto shrink-0" style={{ color: "#72e8a8" }}>
                {timeLeft}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs font-semibold" style={{ color: "var(--t-text1)" }}>Banners</span>
        )}

        {/* Chevron */}
        <svg className="w-3.5 h-3.5 shrink-0 ml-1 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "none", color: "var(--t-text2)", marginLeft: live.length > 0 ? 0 : "auto" }}
          viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Expanded full content ── */}
      {expanded && (
        <div className="flex flex-col gap-5 px-4 pb-5 pt-1">
          {visible.map((group, i) => {
            const isLive    = nowSec >= group.startUtc && nowSec < group.endUtc;
            const prevLive  = i > 0 && nowSec >= visible[i - 1].startUtc && nowSec < visible[i - 1].endUtc;
            return (
              <div key={`${group.version}-${group.phase}-${group.startUtc}`}>
                {i > 0 && !isLive && prevLive && (
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: "var(--t-border0)" }} />
                    <span className="text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--t-text3)" }}>Upcoming</span>
                    <div className="flex-1 h-px" style={{ background: "var(--t-border0)" }} />
                  </div>
                )}
                <PhaseSection group={group} nowSec={nowSec} />
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-1.5 pt-2">
            <span className="text-sm" style={{ color: "var(--t-text3)" }}>✦</span>
            <span className="text-[10px]" style={{ color: "var(--t-text3)" }}>More banners will appear when announced.</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function BannerSidebar() {
  const { groups, nowMs } = useBanners();
  const nowSec = nowMs / 1000;

  const visible = groups.filter(g => g.endUtc > nowSec - 3600);

  return (
    <aside
      className="flex flex-col overflow-y-auto shrink-0 flex-1"
      style={{
        width: 340,
        background: "var(--t-sidebar)",
        borderRight: "1px solid var(--t-border2)",
      }}
    >
      {/* Sidebar title */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.14em]"
          style={{ color: "var(--t-text2)" }}>
          Banners
        </span>
      </div>

      {/* Phase sections */}
      <div className="flex flex-col gap-5 px-4 pb-4">
        {visible.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <span className="text-xs" style={{ color: "rgba(168,180,208,0.2)" }}>Loading…</span>
          </div>
        )}

        {visible.map((group, i) => {
          const isLive = nowSec >= group.startUtc && nowSec < group.endUtc;
          const prevIsLive = i > 0 && nowSec >= visible[i - 1].startUtc && nowSec < visible[i - 1].endUtc;

          return (
            <div key={`${group.version}-${group.phase}-${group.startUtc}`}>
              {/* Divider between live and upcoming sections */}
              {i > 0 && !isLive && prevIsLive && (
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "var(--t-border0)" }} />
                  <span className="text-[9px] uppercase tracking-[0.14em]"
                    style={{ color: "var(--t-text3)" }}>
                    Upcoming
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--t-border0)" }} />
                </div>
              )}
              <PhaseSection group={group} nowSec={nowSec} />
            </div>
          );
        })}

        {/* "That's all!" footer */}
        {visible.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-full h-px" style={{ background: "var(--t-border0)" }} />
            <div className="flex flex-col items-center gap-1.5 pt-4">
              <span className="text-base" style={{ color: "var(--t-text3)" }}>✦</span>
              <span className="text-xs font-medium" style={{ color: "var(--t-text2)" }}>
                That's all!
              </span>
              <span className="text-[10px] text-center" style={{ color: "var(--t-text3)" }}>
                More banners will appear when announced.
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
