export type AccentColor = "cyan" | "purple" | "blue";
export type StarlightRate = "unlucky" | "average" | "lucky";
export type BannerKind = "new" | "rerun";
export type PullPriority = "must" | "want" | "maybe" | "skip";
export type IncomeLevel = "f2p" | "express" | "bp";

export interface WarpPhase {
  id: string;
  label: string;
  warps: number;
}

export interface WarpData {
  bannerKind: BannerKind;
  charSlug: string;
  lcSlug: string;
  charPity: number;
  charGuaranteed: boolean;
  currentEidolon: number;
  lcPity: number;
  lcGuaranteed: boolean;
  currentSuperimposition: number;
  starlightRate: StarlightRate;
  phases: WarpPhase[];
}

export interface PullEntry {
  id: string;
  charSlug: string;
  lcSlug: string;
  patchLabel: string;
  halfPatchesSince: number; // half-patches of income before this banner
  targetEidolon: number;    // -1 = skip char, 0-6 = target eidolon
  targetSi: number;         // 0 = skip LC, 1-5 = target superimposition
  charPity: number;
  charGuaranteed: boolean;
  lcPity: number;
  lcGuaranteed: boolean;
  priority: PullPriority;
  bannerDate?: string; // ISO date "YYYY-MM-DD"
}

export interface PullPlanData {
  incomeLevel: IncomeLevel;
  entries: PullEntry[];
}

export interface RosterEntry {
  eidolon: number;
  lc?: string;  // lcSlug
  si?: number;  // superimposition 1-5
}

export interface Team {
  id: string;
  name: string;
  slots: string[]; // 4 charSlugs, empty string = empty slot
}

export interface Account {
  id: string;
  name: string;
  accent: AccentColor;
  profileSlug: string;
  jades: number;
  passes: number;
  warp: WarpData;
  pullPlan: PullPlanData;
  teams: Team[];
  roster: Record<string, RosterEntry>;
}

export interface AppState {
  accounts: Account[];
  activeAccountId: string;
}
