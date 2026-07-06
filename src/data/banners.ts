export interface BannerItem {
  name: string;
  iconUrl?: string; // full URL (from live API) or left empty for static entries
  slug?: string;    // local character/LC slug for art lookup
  rarity: 5 | 4 | 3;
  element?: string; // "1"=Physical "2"=Fire "3"=Ice "4"=Lightning "5"=Wind "6"=Quantum "7"=Imaginary
}

export const ELEMENT_COLOR: Record<string, string> = {
  "1": "#a8b4d0", "2": "#f87171", "3": "#67e8f9",
  "4": "#c09df0", "5": "#72e8a8", "6": "#6095f8", "7": "#f0cc72",
};

export interface BannerGroup {
  version: string;
  phase?: 1 | 2;
  startUtc: number; // Unix seconds
  endUtc: number;
  charFiveStars: BannerItem[];
  charFourStars: BannerItem[];
  lcFiveStars: BannerItem[];
  lcFourStars: BannerItem[];
}

// All 4.4 banners (Indelible Coterie reruns, Himeko Nova, Fate collab, Phase 2)
// are served by the live API and need no static entries.
//
// 4.4 Phase 2 ends: Aug 25 14:00 UTC = 1787666400
// 4.5 estimated start: ~4h after maintenance = Aug 25 18:00 UTC
const V45_START = 1787680800; // Aug 25 18:00 UTC (estimate; API overrides when live)
const PHASE     = 21 * 86400; // standard 21-day phase

export const UPCOMING_BANNER_GROUPS: BannerGroup[] = [
  // ── 4.5 Phase 1 (est. Aug 25 – Sep 15 2026) ───────────────────────────────
  {
    version: "4.5", phase: 1,
    startUtc: V45_START,
    endUtc:   V45_START + PHASE,
    charFiveStars: [{ name: "Robin (Summeretto)", slug: "robin-summeretto", rarity: 5 }],
    charFourStars: [],
    lcFiveStars:   [],
    lcFourStars:   [],
  },

  // ── 4.5 Phase 2 (est. Sep 15 – Oct 6 2026) ────────────────────────────────
  {
    version: "4.5", phase: 2,
    startUtc: V45_START + PHASE,
    endUtc:   V45_START + 2 * PHASE,
    charFiveStars: [{ name: "Aventurine (Waveflair)", slug: "aventurine-waveflair", rarity: 5 }],
    charFourStars: [],
    lcFiveStars:   [],
    lcFourStars:   [],
  },
];
