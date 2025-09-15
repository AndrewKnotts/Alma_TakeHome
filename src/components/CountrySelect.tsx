"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

type Props = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
};

export default function CountrySelect({
  name,
  placeholder = "Country of Citizenship",
  defaultValue = "",
  options = COUNTRIES,
}: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(defaultValue);
  const [selected, setSelected] = useState(defaultValue);
  const [hi, setHi] = useState(0); // highlighted index
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = `${name}-listbox`;

  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    return q ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  }, [input, options]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function selectValue(val: string) {
    setSelected(val);
    setInput(val);
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
      if (filtered[hi]) selectValue(filtered[hi]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="combo" ref={boxRef}>
      {/* Hidden field so FormData includes the country */}
      <input type="hidden" name={name} value={selected} />

      <div className="combo-wrap">
        <input
          className="combo-input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
            setHi(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="combo-btn" aria-label="Toggle country list" onClick={() => setOpen((o) => !o)}>
          <svg width="14" height="9" viewBox="0 0 12 8" aria-hidden>
            <path
              d="M1 1l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity=".3"
            />
          </svg>
        </button>
      </div>

      {open && filtered.length > 0 && (
        <ul className="combo-list" id={listId} role="listbox">
          {filtered.map((opt, idx) => {
            const active = idx === hi;
            const sel = opt === selected;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={sel}
                className={`combo-option${active ? " active" : ""}${sel ? " selected" : ""}`}
                onMouseEnter={() => setHi(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectValue(opt);
                }}
              >
                {opt}
              </li>
            );
          })}
        </ul>
      )}
      {open && filtered.length === 0 && <div className="combo-empty">No matches</div>}
    </div>
  );
}
