import { useEffect, useState } from "react";
import type { AppState } from "./types";
import { createSeedState } from "./data/seed";

const STORAGE_KEY = "hsr-tracker-v3";

function migrateRoster(raw: Record<string, any>): Record<string, { eidolon: number; lc?: string; si?: number }> {
  if (!raw) return {};
  const out: Record<string, { eidolon: number; lc?: string; si?: number }> = {};
  for (const [slug, val] of Object.entries(raw)) {
    out[slug] = typeof val === "number" ? { eidolon: val } : (val as any) ?? { eidolon: 0 };
  }
  return out;
}

function migrate(state: AppState): AppState {
  return {
    ...state,
    accounts: state.accounts.map((a) => {
      const raw = a as any;
      return {
        ...a,
        profileSlug: a.profileSlug ?? "",
        jades: a.jades ?? raw.warp?.jades ?? raw.pullPlan?.jades ?? 0,
        passes: a.passes ?? raw.warp?.passes ?? raw.pullPlan?.passes ?? 0,
        roster: migrateRoster(a.roster ?? {}),
        teams: a.teams ?? [],
        pullPlan: {
          ...a.pullPlan,
          incomeLevel: a.pullPlan?.incomeLevel ?? "f2p",
          entries: a.pullPlan?.entries ?? [],
        },
      };
    }),
  };
}

function loadState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createSeedState();
  try {
    return migrate(JSON.parse(raw) as AppState);
  } catch {
    return createSeedState();
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
}
