import { useEffect, useRef, useState } from "react";
import type { BannerGroup, BannerItem } from "../data/banners";
import { UPCOMING_BANNER_GROUPS } from "../data/banners";

// ─── ennead API types ─────────────────────────────────────────────────────────

interface ApiItem {
  name: string;
  icon: string;
  rarity: number;
  element?: number | string;
}

interface ApiBanner {
  id: number;
  version: string;
  start_time: number;
  end_time: number;
  characters: ApiItem[];
  light_cones: ApiItem[];
}

interface ApiResponse {
  banners: ApiBanner[];
}

// ─── Parse ennead response into BannerGroup format ───────────────────────────

function uniqueByName<T extends { name: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(t => !seen.has(t.name) && (seen.add(t.name), true));
}

function parseGroups(banners: ApiBanner[], nowSec: number): BannerGroup[] {
  // Round to nearest minute — the API sometimes offsets concurrent banners by 1s
  const byStart = new Map<number, ApiBanner[]>();
  for (const b of banners) {
    const key = Math.floor(b.start_time / 60) * 60;
    if (!byStart.has(key)) byStart.set(key, []);
    byStart.get(key)!.push(b);
  }

  const groups: BannerGroup[] = [];
  const versionPhase: Record<string, number> = {};

  for (const [startKey, group] of Array.from(byStart.entries()).sort((a, b) => a[0] - b[0])) {
    const version = group[0].version;
    versionPhase[version] = (versionPhase[version] ?? 0) + 1;
    const phase = Math.min(versionPhase[version], 2) as 1 | 2;

    const toItem = (x: ApiItem): BannerItem => ({
      name: x.name,
      iconUrl: x.icon,
      rarity: x.rarity as 5 | 4 | 3,
      element: x.element != null ? String(x.element) : undefined,
    });

    const allChars = uniqueByName(group.flatMap(b => b.characters).map(toItem));
    const allLCs   = uniqueByName(group.flatMap(b => b.light_cones).map(toItem));

    // Use minimum valid end_time; when 0 (TBA), estimate ~6 months from now
    const validEnds = group.map(b => b.end_time).filter(t => t > 0);
    const endUtc = validEnds.length > 0 ? Math.min(...validEnds) : nowSec + 180 * 86400;

    groups.push({
      version,
      phase,
      startUtc: startKey,
      endUtc,
      charFiveStars: allChars.filter(c => c.rarity === 5),
      charFourStars: allChars.filter(c => c.rarity === 4),
      lcFiveStars:   allLCs.filter(l => l.rarity === 5),
      lcFourStars:   allLCs.filter(l => l.rarity === 4),
    });
  }

  return groups;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBanners() {
  const [groups, setGroups] = useState<BannerGroup[]>([]);
  const [nowMs, setNowMs]   = useState(Date.now());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const nowSec = Date.now() / 1000;

    fetch("https://api.ennead.cc/mihoyo/starrail/calendar")
      .then(r => r.json())
      .then((data: ApiResponse) => {
        const live = parseGroups(data.banners ?? [], nowSec);
        // Exclude static groups that start within the same clock-hour as an API group
        const apiStartHours = new Set(live.map(g => Math.floor(g.startUtc / 3600)));
        const upcoming = UPCOMING_BANNER_GROUPS.filter(g =>
          g.endUtc > nowSec &&
          !apiStartHours.has(Math.floor(g.startUtc / 3600))
        );
        setGroups([...live, ...upcoming]);
      })
      .catch(() => {
        setGroups(UPCOMING_BANNER_GROUPS.filter(g => g.endUtc > nowSec));
      });

    timer.current = setInterval(() => setNowMs(Date.now()), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  return { groups, nowMs };
}

// ─── Countdown helpers (exported for use in BannerStrip) ─────────────────────

export function formatCountdown(remainSec: number): string {
  if (remainSec <= 0) return "Ended";
  const d = Math.floor(remainSec / 86400);
  const h = Math.floor((remainSec % 86400) / 3600);
  const m = Math.floor((remainSec % 3600) / 60);
  const s = Math.floor(remainSec % 60);
  if (d >= 1) return `${d}d ${h}h ${m}m ${s}s`;
  if (h >= 1) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export function formatStartDate(utcSec: number): string {
  return new Date(utcSec * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
