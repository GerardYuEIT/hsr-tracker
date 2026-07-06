// @ts-nocheck
import { useState } from "react";
import type { AccentColor, Region } from "../types";
import { ACCENT_HEX, genId } from "../utils";
import { MapRowItem } from "./MapRowItem";

interface RegionSectionProps {
  region: Region;
  onChange: (region: Region) => void;
  onDelete: () => void;
}

const ACCENTS: AccentColor[] = ["cyan", "purple", "blue"];

export function RegionSection({ region, onChange, onDelete }: RegionSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(region.name);

  const done = region.maps.reduce((s, m) => s + m.done, 0);
  const total = region.maps.reduce((s, m) => s + m.total, 0);
  const pct = total > 0 ? (done / total) * 100 : 0;
  const accent = ACCENT_HEX[region.color];

  const addMap = () => {
    onChange({
      ...region,
      maps: [...region.maps, { id: genId("map"), name: "New Map", done: 0, total: 0 }],
    });
  };

  const updateMap = (idx: number, map: Region["maps"][number]) => {
    const maps = [...region.maps];
    maps[idx] = map;
    onChange({ ...region, maps });
  };

  const deleteMap = (idx: number) => {
    onChange({ ...region, maps: region.maps.filter((_, i) => i !== idx) });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-panel-2 bg-panel">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${accent}33 0%, transparent 100%)`,
          borderBottom: collapsed ? "none" : `1px solid ${accent}44`,
        }}
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className="text-muted text-xs w-4">{collapsed ? "▸" : "▾"}</span>

        {editingName ? (
          <input
            autoFocus
            value={draftName}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              if (draftName.trim()) onChange({ ...region, name: draftName.trim() });
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="bg-navy text-cream text-sm font-semibold rounded px-2 py-0.5 outline-none border border-panel-2"
          />
        ) : (
          <span className="group flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-wide" style={{ color: accent }}>
              {region.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDraftName(region.name);
                setEditingName(true);
              }}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-gold text-xs transition-opacity"
              title="Rename region"
            >
              ✎
            </button>
          </span>
        )}

        <div className="flex gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
          {ACCENTS.map((a) => (
            <button
              key={a}
              onClick={() => onChange({ ...region, color: a })}
              className="w-3 h-3 rounded-full border"
              style={{
                backgroundColor: ACCENT_HEX[a],
                borderColor: region.color === a ? "#EDE7D6" : "transparent",
              }}
            />
          ))}
        </div>

        <span className="text-xs text-muted ml-auto tabular-nums">
          {done}/{total} · {pct.toFixed(0)}%
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete region "${region.name}" and all its maps?`)) onDelete();
          }}
          className="text-muted hover:text-red-400 text-xs px-1"
          title="Delete region"
        >
          ✕
        </button>
      </div>

      {!collapsed && (
        <div className="py-2">
          {region.maps.map((map, idx) => (
            <MapRowItem
              key={map.id}
              map={map}
              onChange={(m) => updateMap(idx, m)}
              onDelete={() => deleteMap(idx)}
            />
          ))}
          <button
            onClick={addMap}
            className="ml-4 mt-1 text-xs text-muted hover:text-gold transition-colors"
          >
            + Add map
          </button>
        </div>
      )}
    </div>
  );
}
