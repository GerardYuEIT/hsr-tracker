interface ProgressBarProps {
  done: number;
  total: number;
}

export function ProgressBar({ done, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative h-2.5 flex-1 rounded-full bg-navy overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-green transition-all duration-500 shadow-[0_0_8px_#6FE3A0]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted w-10 text-right tabular-nums">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}
