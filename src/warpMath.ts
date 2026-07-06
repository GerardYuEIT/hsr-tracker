import type { StarlightRate, WarpPhase } from "./types";

// Character: 0.6% base, soft pity at pull 74 (+6%/pull), hard pity pull 90
// LC: 0.8% base, soft pity at pull 66 (+7%/pull), hard pity pull 80
// Rate-up: char 56.25%, LC 78.125% (accounts for guarantee refill mechanic)

function charBaseRate(pity: number): number {
  if (pity >= 89) return 1.0;
  if (pity >= 73) return 0.006 + 0.06 * (pity - 72);
  return 0.006;
}

function lcBaseRate(pity: number): number {
  if (pity >= 79) return 1.0;
  if (pity >= 65) return Math.min(1.0, 0.008 + 0.07 * (pity - 64));
  return 0.008;
}

const CHAR_RATE_UP = 0.5625;
const LC_RATE_UP = 0.78125;

// PMF[k] = P(rate-up 5* on exactly the kth upcoming pull)
// Tracks pity + guarantee state as a Markov chain.
function singleCopyPMF(
  startPity: number,
  guaranteed: boolean,
  type: "char" | "lc",
  maxPulls: number
): Float64Array {
  const pmf = new Float64Array(maxPulls + 1);
  const rateUpChance = type === "char" ? CHAR_RATE_UP : LC_RATE_UP;
  const baseRateFn = type === "char" ? charBaseRate : lcBaseRate;
  const maxPity = type === "char" ? 90 : 80;

  // state[p * 2 + g] = probability of being at pity p with guarantee g
  let state = new Float64Array(maxPity * 2);
  state[Math.min(startPity, maxPity - 1) * 2 + (guaranteed ? 1 : 0)] = 1;

  for (let pull = 1; pull <= maxPulls; pull++) {
    const next = new Float64Array(maxPity * 2);
    let hitProb = 0;

    for (let p = 0; p < maxPity; p++) {
      for (let g = 0; g < 2; g++) {
        const prob = state[p * 2 + g];
        if (prob < 1e-14) continue;
        const fiveStarRate = baseRateFn(p);

        // Miss: advance pity
        if (p + 1 < maxPity) {
          next[(p + 1) * 2 + g] += prob * (1 - fiveStarRate);
        }

        // Hit 5*
        if (g === 1) {
          // Guaranteed rate-up: done
          hitProb += prob * fiveStarRate;
        } else {
          // Won 50/50: done
          hitProb += prob * fiveStarRate * rateUpChance;
          // Lost 50/50: pity resets, now guaranteed
          next[0 * 2 + 1] += prob * fiveStarRate * (1 - rateUpChance);
        }
      }
    }

    pmf[pull] = hitProb;
    state = next;
  }

  return pmf;
}

function convolve(a: Float64Array, b: Float64Array, maxLen: number): Float64Array {
  const result = new Float64Array(maxLen + 1);
  const aLen = Math.min(a.length, maxLen + 1);
  const bLen = Math.min(b.length, maxLen + 1);
  for (let i = 0; i < aLen; i++) {
    if (a[i] === 0) continue;
    for (let j = 0; j < bLen && i + j <= maxLen; j++) {
      if (b[j] === 0) continue;
      result[i + j] += a[i] * b[j];
    }
  }
  return result;
}

// "s1" = get next LC copy first; "e{n}" = pull char copies up to E{n} before first LC
export type Strategy = "s1" | "e0" | "e1" | "e2" | "e3" | "e4" | "e5" | "e6";

export interface MilestoneResult {
  label: string;
  successChance: number; // 0-1
  average: number; // expected pulls
}

export interface JointMilestone {
  label: string;       // e.g. "E0 S1"
  eidolon: number;
  superimposition: number;
  successChance: number;
  average: number;
}

export interface WarpResults {
  totalWarps: number;
  charMilestones: MilestoneResult[];
  lcMilestones: MilestoneResult[];
  jointMilestones: JointMilestone[];
}

const STARLIGHT_PASSES_PER_10: Record<StarlightRate, number> = {
  unlucky: 8 / 20,   // every 4* is a LC
  average: 14 / 20,  // 50/50 char/LC split
  lucky: 20 / 20,    // every 4* is a char (E6, full refund)
};

// Identical to the refund loop inside computeWarpResults — exported so other
// views (Pull Planner) can show the same total instead of a raw jade-only count.
export function calcStartingWarps(
  jades: number,
  passes: number,
  starlightRate: StarlightRate,
  extraWarps = 0,
): number {
  const base = Math.floor(jades / 160) + passes + extraWarps;
  let total = base;
  for (let i = 0; i < 6; i++) {
    total = base + Math.floor(total / 10) * STARLIGHT_PASSES_PER_10[starlightRate];
  }
  return Math.floor(total);
}

export function computeWarpResults(
  jades: number,
  passes: number,
  starlightRate: StarlightRate,
  phases: WarpPhase[],
  charPity: number,
  charGuaranteed: boolean,
  lcPity: number,
  lcGuaranteed: boolean,
  currentEidolon: number, // -1 to 5
  currentSuperimposition: number, // 0 to 4
  strategy: Strategy = "e0"
): WarpResults {
  const phaseWarps = phases.reduce((s, p) => s + p.warps, 0);
  const baseWarps = Math.floor(jades / 160) + passes + phaseWarps;

  // Compound starlight refunds (converges in a few iterations)
  let totalWarps = baseWarps;
  for (let i = 0; i < 6; i++) {
    const refunds = Math.floor(totalWarps / 10) * STARLIGHT_PASSES_PER_10[starlightRate];
    totalWarps = baseWarps + refunds;
  }
  const N = Math.floor(totalWarps);

  // --- Character banner ---
  const MAX_CHAR = 750;
  const charSubPMF = singleCopyPMF(0, false, "char", 200);

  const charMilestones: MilestoneResult[] = [];
  const charAccumPMFs: Float64Array[] = []; // stored for joint computation
  let charAccum = singleCopyPMF(charPity, charGuaranteed, "char", 200);

  for (let e = currentEidolon + 1; e <= 6; e++) {
    if (e > currentEidolon + 1) charAccum = convolve(charAccum, charSubPMF, MAX_CHAR);
    charAccumPMFs.push(charAccum);
    let cdf = 0, avg = 0;
    for (let k = 0; k < charAccum.length; k++) {
      if (k <= N) cdf += charAccum[k];
      avg += k * charAccum[k];
    }
    charMilestones.push({ label: `E${e}`, successChance: Math.min(1, cdf), average: avg });
  }

  // --- LC banner ---
  const MAX_LC = 450;
  const lcSubPMF = singleCopyPMF(0, false, "lc", 180);

  const lcMilestones: MilestoneResult[] = [];
  const lcAccumPMFs: Float64Array[] = [];
  let lcAccum = singleCopyPMF(lcPity, lcGuaranteed, "lc", 180);

  for (let s = currentSuperimposition + 1; s <= 5; s++) {
    if (s > currentSuperimposition + 1) lcAccum = convolve(lcAccum, lcSubPMF, MAX_LC);
    lcAccumPMFs.push(lcAccum);
    let cdf = 0, avg = 0;
    for (let k = 0; k < lcAccum.length; k++) {
      if (k <= N) cdf += lcAccum[k];
      avg += k * lcAccum[k];
    }
    lcMilestones.push({ label: `S${s}`, successChance: Math.min(1, cdf), average: avg });
  }

  // --- Joint milestones ---
  // Convention (for new banners): E0 S0 → E0 S1 → E1 S1 → … → E6 S1 → E6 S2 → … → E6 S5
  const MAX_JOINT = MAX_CHAR + MAX_LC;
  const jointMilestones: JointMilestone[] = [];
  const nC = charAccumPMFs.length;
  const nL = lcAccumPMFs.length;

  function pmfStats(pmf: Float64Array) {
    let cdf = 0, avg = 0;
    for (let k = 0; k < pmf.length; k++) {
      if (k <= N) cdf += pmf[k];
      avg += k * pmf[k];
    }
    return { successChance: Math.min(1, cdf), average: avg };
  }

  if (nC > 0 && nL === 0) {
    // Char goals only
    for (let i = 0; i < nC; i++) {
      const e = currentEidolon + 1 + i;
      jointMilestones.push({ label: `E${e}`, eidolon: e, superimposition: currentSuperimposition, ...pmfStats(charAccumPMFs[i]) });
    }
  } else if (nC === 0 && nL > 0) {
    // LC goals only
    for (let j = 0; j < nL; j++) {
      const s = currentSuperimposition + 1 + j;
      jointMilestones.push({ label: `S${s}`, eidolon: currentEidolon, superimposition: s, ...pmfStats(lcAccumPMFs[j]) });
    }
  } else if (nC > 0 && nL > 0) {
    // How many char copies to pull before touching the LC banner
    let charTurn: number;
    if (strategy === "s1") {
      charTurn = 0;
    } else {
      const targetE = parseInt(strategy.slice(1), 10); // "e0"→0, "e6"→6
      charTurn = Math.max(0, Math.min(nC, targetE - currentEidolon));
    }

    // Phase 1: char-only rows up to the turning eidolon
    for (let i = 0; i < charTurn; i++) {
      const e = currentEidolon + 1 + i;
      jointMilestones.push({ label: `E${e}`, eidolon: e, superimposition: currentSuperimposition, ...pmfStats(charAccumPMFs[i]) });
    }

    // Phase 2: LC-only row when LC is prioritized first (charTurn === 0)
    if (charTurn === 0) {
      const s = currentSuperimposition + 1;
      jointMilestones.push({ label: `S${s}`, eidolon: currentEidolon, superimposition: s, ...pmfStats(lcAccumPMFs[0]) });
    }

    // Phase 3: char at turning point (and all remaining eidolons) × first new LC
    const charCombineStart = charTurn > 0 ? charTurn - 1 : 0;
    const firstNewS = currentSuperimposition + 1;
    for (let i = charCombineStart; i < nC; i++) {
      const e = currentEidolon + 1 + i;
      const joint = convolve(charAccumPMFs[i], lcAccumPMFs[0], MAX_JOINT);
      jointMilestones.push({ label: `E${e} S${firstNewS}`, eidolon: e, superimposition: firstNewS, ...pmfStats(joint) });
    }

    // Phase 4: max eidolon × each subsequent LC copy
    const maxCharPMF = charAccumPMFs[nC - 1];
    const maxE = currentEidolon + nC; // always 6 when pulling to E6
    for (let j = 1; j < nL; j++) {
      const s = currentSuperimposition + 1 + j;
      const joint = convolve(maxCharPMF, lcAccumPMFs[j], MAX_JOINT);
      jointMilestones.push({ label: `E${maxE} S${s}`, eidolon: maxE, superimposition: s, ...pmfStats(joint) });
    }
  }

  return { totalWarps: N, charMilestones, lcMilestones, jointMilestones };
}

// Like computeWarpResults but takes a pre-computed warp count (no refund calc).
// Use this when the budget has already been calculated via calcStartingWarps.
export function computeMilestones(
  N: number,
  charPity: number, charGuaranteed: boolean,
  lcPity: number,   lcGuaranteed: boolean,
  currentEidolon: number,        // -1 = from scratch
  currentSuperimposition: number // 0 = from scratch
): { charMilestones: MilestoneResult[]; lcMilestones: MilestoneResult[] } {
  const MAX_CHAR = 750;
  const charSubPMF = singleCopyPMF(0, false, "char", 200);
  const charMilestones: MilestoneResult[] = [];
  let charAccum = singleCopyPMF(charPity, charGuaranteed, "char", 200);
  for (let e = currentEidolon + 1; e <= 6; e++) {
    if (e > currentEidolon + 1) charAccum = convolve(charAccum, charSubPMF, MAX_CHAR);
    let cdf = 0, avg = 0;
    for (let k = 0; k < charAccum.length; k++) {
      if (k <= N) cdf += charAccum[k];
      avg += k * charAccum[k];
    }
    charMilestones.push({ label: `E${e}`, successChance: Math.min(1, cdf), average: avg });
  }

  const MAX_LC = 450;
  const lcSubPMF = singleCopyPMF(0, false, "lc", 180);
  const lcMilestones: MilestoneResult[] = [];
  let lcAccum = singleCopyPMF(lcPity, lcGuaranteed, "lc", 180);
  for (let s = currentSuperimposition + 1; s <= 5; s++) {
    if (s > currentSuperimposition + 1) lcAccum = convolve(lcAccum, lcSubPMF, MAX_LC);
    let cdf = 0, avg = 0;
    for (let k = 0; k < lcAccum.length; k++) {
      if (k <= N) cdf += lcAccum[k];
      avg += k * lcAccum[k];
    }
    lcMilestones.push({ label: `S${s}`, successChance: Math.min(1, cdf), average: avg });
  }

  return { charMilestones, lcMilestones };
}
