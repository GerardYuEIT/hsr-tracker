interface PillSelectProps<T extends string> {
  value: T;
  options: readonly T[];
  colors: Record<T, string>;
  onChange: (value: T) => void;
}

export function PillSelect<T extends string>({
  value,
  options,
  colors,
  onChange,
}: PillSelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-full px-3 py-1 text-xs font-semibold border-0 outline-none cursor-pointer appearance-none text-center"
      style={{ backgroundColor: `${colors[value]}26`, color: colors[value] }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-panel-2 text-cream">
          {opt}
        </option>
      ))}
    </select>
  );
}
