// @ts-nocheck
import type { ExplorationData } from "../types";
import { genId } from "../utils";
import { StatCard } from "./StatCard";
import { RegionSection } from "./RegionSection";

interface ExplorationTrackerProps {
  data: ExplorationData;
  onChange: (data: ExplorationData) => void;
}

export function ExplorationTracker({ data, onChange }: ExplorationTrackerProps) {
  const allMaps = data.regions.flatMap((r) => r.maps);
  const totalDone = allMaps.reduce((s, m) => s + m.done, 0);
  const totalTotal = allMaps.reduce((s, m) => s + m.total, 0);
  const overallPct = totalTotal > 0 ? (totalDone / totalTotal) * 100 : 0;
  const mapsCleared = allMaps.filter((m) => m.total > 0 && m.done >= m.total).length;

  const addRegion = () => {
    onChange({
      regions: [
        ...data.regions,
        { id: genId("region"), name: "New Region", color: "cyan", maps: [] },
      ],
    });
  };

  const updateRegion = (idx: number, region: ExplorationData["regions"][number]) => {
    const regions = [...data.regions];
    regions[idx] = region;
    onChange({ ...data, regions });
  };

  const deleteRegion = (idx: number) => {
    onChange({ regions: data.regions.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 flex-wrap">
        <StatCard label="Overall %" value={`${overallPct.toFixed(1)}%`} />
        <StatCard label="Maps 100%" value={`${mapsCleared}/${allMaps.length}`} />
        <StatCard label="Treasures" value={`${totalDone}/${totalTotal}`} />
      </div>

      <div className="flex flex-col gap-4">
        {data.regions.map((region, idx) => (
          <RegionSection
            key={region.id}
            region={region}
            onChange={(r) => updateRegion(idx, r)}
            onDelete={() => deleteRegion(idx)}
          />
        ))}
      </div>

      <button
        onClick={addRegion}
        className="self-start rounded-lg px-4 py-2 text-sm text-muted hover:text-gold border border-dashed border-panel-2 hover:border-gold/50 transition-colors"
      >
        + Add region
      </button>
    </div>
  );
}
