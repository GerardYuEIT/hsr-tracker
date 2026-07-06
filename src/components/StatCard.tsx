interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="flex-1 min-w-[160px] rounded-xl bg-panel border border-panel-2 px-5 py-4 shadow-lg">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="text-3xl font-semibold text-gold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}
