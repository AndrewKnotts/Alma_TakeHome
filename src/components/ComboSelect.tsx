"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Option = { label: string; value: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  searchable?: boolean; // set to true if you want type-to-filter
  className?: string;
};

export default function ComboSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchable = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0); // highlighted index
  const [input, setInput] = useState(""); // visible text when searchable
  const boxRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) || null;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keep input text in sync with selected when not searching / when closed
  useEffect(() => {
    if (!searchable || !open) setInput(selected?.label ?? "");
  }, [selected, open, searchable]);

  const filtered = useMemo(() => {
    if (!searchable) return options;
    const q = input.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [input, options, searchable]);

  function choose(opt: Option) {
    onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[hi]) choose(filtered[hi]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={`combo ${className}`}>
      <div className="combo-wrap">
        <input
          className="combo-input input-pill"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete={searchable ? "list" : "none"}
          aria-haspopup="listbox"
          placeholder={placeholder}
          value={searchable ? input : selected?.label ?? ""}
          onChange={
            searchable
              ? (e) => {
                  setInput(e.target.value);
                  setOpen(true);
                  setHi(0);
                }
              : undefined
          }
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          readOnly={!searchable}
        />
        <button type="button" className="combo-btn" aria-label="Toggle options" onClick={() => setOpen((o) => !o)}>
          <svg width="14" height="9" viewBox="0 0 12 8" aria-hidden>
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && filtered.length > 0 && (
        <ul className="combo-list" role="listbox">
          {filtered.map((opt, idx) => {
            const active = idx === hi;
            const sel = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={sel}
                className={`combo-option${active ? " active" : ""}${sel ? " selected" : ""}`}
                onMouseEnter={() => setHi(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(opt);
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
      {open && filtered.length === 0 && <div className="combo-empty">No matches</div>}
    </div>
  );
}
