// @ts-nocheck
import type { MapRow } from "../types";
import { ProgressBar } from "./ProgressBar";

interface MapRowItemProps {
  map: MapRow;
  onChange: (map: MapRow) => void;
  onDelete: () => void;
}

export function MapRowItem({ map, onChange, onDelete }: MapRowItemProps) {
  return (
    <div className="group grid grid-cols-[1fr_64px_64px_140px_auto] items-center gap-3 px-4 py-2 rounded-lg hover:bg-panel-2/60 transition-colors">
      <input
        value={map.name}
        onChange={(e) => onChange({ ...map, name: e.target.value })}
        className="bg-transparent text-sm text-cream outline-none rounded px-1 py-0.5 focus:bg-navy"
      />
      <input
        type="number"
        min={0}
        value={map.done}
        onChange={(e) => onChange({ ...map, done: Number(e.target.value) })}
        className="bg-navy text-cream text-sm text-center rounded px-1 py-0.5 outline-none border border-panel-2 w-16"
      />
      <input
        type="number"
        min={0}
        value={map.total}
        onChange={(e) => onChange({ ...map, total: Number(e.target.value) })}
        className="bg-navy text-cream text-sm text-center rounded px-1 py-0.5 outline-none border border-panel-2 w-16"
      />
      <ProgressBar done={map.done} total={map.total} />
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 text-xs px-1 transition-opacity"
        title="Delete map"
      >
        ✕
      </button>
    </div>
  );
}
