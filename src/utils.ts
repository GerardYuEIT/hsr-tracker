export function genId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}


export const ACCENT_HEX: Record<"cyan" | "purple" | "blue", string> = {
  cyan: "#5FD3F3",
  purple: "#B98BE8",
  blue: "#4F86F7",
};
