// @ts-nocheck
import type { Priority, PullPlanData, PullRow, PullStatus } from "../types";
import { genId } from "../utils";
import { PillSelect } from "./Pill";

interface PullPlanTrackerProps {
  data: PullPlanData;
  onChange: (data: PullPlanData) => void;
}

const PRIORITIES: Priority[] = ["Must Pull", "Want", "Maybe", "Skip", "Pulled"];
const STATUSES: PullStatus[] = ["Saving", "Pulling", "Got It", "Building", "Done"];

const PRIORITY_COLORS: Record<Priority, string> = {
  "Must Pull": "#F2596B",
  Want: "#E8C36B",
  Maybe: "#4F86F7",
  Skip: "#8893B8",
  Pulled: "#6FE3A0",
};

const STATUS_COLORS: Record<PullStatus, string> = {
  Saving: "#4F86F7",
  Pulling: "#B98BE8",
  "Got It": "#5FD3F3",
  Building: "#E8C36B",
  Done: "#6FE3A0",
};

export function PullPlanTracker({ data, onChange }: PullPlanTrackerProps) {
  const mustCount = data.rows.filter((r) => r.priority === "Must Pull").length;
  const wantCount = data.rows.filter((r) => r.priority === "Want").length;

  const updateRow = (idx: number, row: PullRow) => {
    const rows = [...data.rows];
    rows[idx] = row;
    onChange({ ...data, rows });
  };

  const deleteRow = (idx: number) => {
    onChange({ ...data, rows: data.rows.filter((_, i) => i !== idx) });
  };

  const addRow = () => {
    onChange({
      ...data,
      rows: [
        ...data.rows,
        {
          id: genId("pull"),
          priority: "Maybe",
          character: "New Character",
          eidolonGoal: "E0",
          lightCone: "—",
          status: "Saving",
          notes: "",
        },
      ],
    });
  };

  const moveRow = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= data.rows.length) return;
    const rows = [...data.rows];
    [rows[idx], rows[target]] = [rows[target], rows[idx]];
    onChange({ ...data, rows });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 flex-wrap items-stretch">
        <div className="flex-1 min-w-[220px] rounded-xl bg-panel border border-panel-2 px-5 py-4 shadow-lg">
          <div className="text-xs uppercase tracking-wider text-muted">Main Carry</div>
          <input
            value={data.mainCarry}
            onChange={(e) => onChange({ ...data, mainCarry: e.target.value })}
            className="text-2xl font-semibold text-gold bg-transparent outline-none mt-1 w-full"
          />
        </div>
        <div className="flex-1 min-w-[220px] rounded-xl bg-panel border border-panel-2 px-5 py-4 shadow-lg flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-semibold" style={{ color: PRIORITY_COLORS["Must Pull"] }}>
              {mustCount}
            </div>
            <div className="text-xs text-muted">must</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold" style={{ color: PRIORITY_COLORS.Want }}>
              {wantCount}
            </div>
            <div className="text-xs text-muted">want</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-panel-2 bg-panel overflow-hidden">
        <div className="grid grid-cols-[110px_1fr_90px_1fr_120px_1.4fr_70px] gap-2 px-4 py-2 text-xs uppercase tracking-wider text-muted border-b border-panel-2">
          <span>Priority</span>
          <span>Character</span>
          <span>Eidolon</span>
          <span>Light Cone</span>
          <span>Status</span>
          <span>Notes</span>
          <span></span>
        </div>

        {data.rows.map((row, idx) => (
          <div
            key={row.id}
            className="group grid grid-cols-[110px_1fr_90px_1fr_120px_1.4fr_70px] gap-2 items-center px-4 py-2 hover:bg-panel-2/60 transition-colors border-b border-panel-2/50 last:border-b-0"
          >
            <PillSelect
              value={row.priority}
              options={PRIORITIES}
              colors={PRIORITY_COLORS}
              onChange={(priority) => updateRow(idx, { ...row, priority })}
            />
            <input
              value={row.character}
              onChange={(e) => updateRow(idx, { ...row, character: e.target.value })}
              className="bg-transparent text-sm text-cream outline-none rounded px-1 py-0.5 focus:bg-navy"
            />
            <input
              value={row.eidolonGoal}
              onChange={(e) => updateRow(idx, { ...row, eidolonGoal: e.target.value })}
              className="bg-navy text-cream text-xs text-center rounded px-1 py-1 outline-none border border-panel-2"
            />
            <input
              value={row.lightCone}
              onChange={(e) => updateRow(idx, { ...row, lightCone: e.target.value })}
              className="bg-transparent text-sm text-cream outline-none rounded px-1 py-0.5 focus:bg-navy"
            />
            <PillSelect
              value={row.status}
              options={STATUSES}
              colors={STATUS_COLORS}
              onChange={(status) => updateRow(idx, { ...row, status })}
            />
            <input
              value={row.notes}
              onChange={(e) => updateRow(idx, { ...row, notes: e.target.value })}
              placeholder="notes"
              className="bg-transparent text-sm text-muted outline-none rounded px-1 py-0.5 focus:bg-navy focus:text-cream"
            />
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
              <button onClick={() => moveRow(idx, -1)} className="text-muted hover:text-gold text-xs px-0.5" title="Move up">
                ▲
              </button>
              <button onClick={() => moveRow(idx, 1)} className="text-muted hover:text-gold text-xs px-0.5" title="Move down">
                ▼
              </button>
              <button onClick={() => deleteRow(idx)} className="text-muted hover:text-red-400 text-xs px-0.5" title="Delete row">
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addRow}
          className="w-full text-left px-4 py-2 text-xs text-muted hover:text-gold transition-colors"
        >
          + Add row
        </button>
      </div>
    </div>
  );
}
