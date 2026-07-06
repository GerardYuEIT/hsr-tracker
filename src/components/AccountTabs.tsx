import { useState } from "react";
import type { Account, AccentColor } from "../types";
import { ACCENT_HEX } from "../utils";

interface AccountTabsProps {
  accounts: Account[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string, accent: AccentColor) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const ACCENTS: AccentColor[] = ["cyan", "purple", "blue"];

export function AccountTabs({ accounts, activeId, onSelect, onAdd, onRename, onDelete }: AccountTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAccent, setNewAccent] = useState<AccentColor>("cyan");

  const commitEdit = () => {
    if (editingId && draftName.trim()) onRename(editingId, draftName.trim());
    setEditingId(null);
  };

  const submitAdd = () => {
    if (newName.trim()) onAdd(newName.trim(), newAccent);
    setAdding(false);
    setNewName("");
    setNewAccent("cyan");
  };

  return (
    <div className="flex items-end gap-1.5 px-6 pt-4 flex-wrap">
      {accounts.map((acc) => {
        const isActive = acc.id === activeId;
        const accent = ACCENT_HEX[acc.accent];
        return (
          <div
            key={acc.id}
            className="group relative rounded-t-lg px-4 py-2 cursor-pointer transition-all"
            style={{
              backgroundColor: isActive ? "#1B2440" : "#141B33",
              boxShadow: isActive ? `0 -2px 0 0 ${accent} inset` : undefined,
            }}
            onClick={() => onSelect(acc.id)}
          >
            {editingId === acc.id ? (
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                onClick={(e) => e.stopPropagation()}
                className="bg-navy text-cream text-sm rounded px-2 py-0.5 outline-none border border-panel-2 w-28"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <span className="text-sm" style={{ color: isActive ? "#EDE7D6" : "#8893B8" }}>
                  {acc.name}
                </span>
                <span className="hidden group-hover:flex items-center gap-1 ml-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingId(acc.id); setDraftName(acc.name); }}
                    className="text-muted hover:text-gold text-xs" title="Rename"
                  >✎</button>
                  {accounts.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${acc.name}"?`)) onDelete(acc.id); }}
                      className="text-muted hover:text-red-400 text-xs" title="Delete"
                    >✕</button>
                  )}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {adding ? (
        <div className="flex items-center gap-2 rounded-t-lg px-3 py-2 bg-panel-2" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            placeholder="Account name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitAdd()}
            className="bg-navy text-cream text-sm rounded px-2 py-1 outline-none border border-panel-2 w-32"
          />
          <div className="flex gap-1">
            {ACCENTS.map((a) => (
              <button
                key={a}
                onClick={() => setNewAccent(a)}
                className="w-4 h-4 rounded-full border-2 transition-colors"
                style={{ backgroundColor: ACCENT_HEX[a], borderColor: newAccent === a ? "#EDE7D6" : "transparent" }}
              />
            ))}
          </div>
          <button onClick={submitAdd} className="text-green text-sm px-1">✓</button>
          <button onClick={() => setAdding(false)} className="text-muted text-sm px-1">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-t-lg px-3 py-2 text-muted hover:text-gold hover:bg-panel transition-colors text-sm"
        >+ Add</button>
      )}
    </div>
  );
}
