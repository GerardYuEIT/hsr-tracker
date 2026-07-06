import type { Account, AppState } from "../types";

function defaultWarp(charSlug = "", lcSlug = "") {
  return {
    bannerKind: "new" as const,
    charSlug, lcSlug,
    charPity: 0, charGuaranteed: false, currentEidolon: -1,
    lcPity: 0, lcGuaranteed: false, currentSuperimposition: 0,
    starlightRate: "average" as const, phases: [],
  };
}

function defaultPullPlan() {
  return { incomeLevel: "f2p" as const, entries: [] };
}

function makeAccount(id: string, name: string, accent: Account["accent"], charSlug = ""): Account {
  return { id, name, accent, profileSlug: charSlug, jades: 0, passes: 0, warp: defaultWarp(charSlug), pullPlan: defaultPullPlan(), teams: [], roster: {} };
}

export function createSeedState(): AppState {
  return {
    activeAccountId: "acc-1",
    accounts: [
      makeAccount("acc-1", "Calvin", "cyan"),
      makeAccount("acc-2", "E2 DHIL", "blue", "dan-heng-permansor-terrae"),
      makeAccount("acc-3", "E2 Acheron", "purple", "acheron"),
    ],
  };
}
