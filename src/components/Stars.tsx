export function Stars({ count, size = 10 }: { count: 4 | 5; size?: number }) {
  const color = count === 5 ? "#f0cc72" : "#c084fc";
  return (
    <div className="flex gap-px">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={color}
          style={{ filter: `drop-shadow(0 0 3px ${color}bb)` }}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
      ))}
    </div>
  );
}
