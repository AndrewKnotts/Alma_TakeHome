"use client";
import { useEffect, useMemo, useState } from "react";
import type { Lead } from "@/lib/types";
import ComboSelect from "@/components/ComboSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 8;
type SortKey = "name" | "createdAt" | "status" | "country";
type SortState = { key: SortKey; dir: "asc" | "desc" };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "REACHED_OUT">("ALL");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to load");
      const data: Lead[] = await res.json();
      setLeads(data);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function toggleSort(k: SortKey) {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
  }

  async function markReached(id: string) {
    await fetch(`/api/leads?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "REACHED_OUT" }),
      headers: { "Content-Type": "application/json" },
    });
    load();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesQ = !q || `${l.firstName} ${l.lastName}`.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || l.state === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      switch (sort.key) {
        case "name":
          return dir * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "country":
          return dir * a.country.localeCompare(b.country);
        case "status":
          return dir * a.state.localeCompare(b.state);
        case "createdAt":
        default:
          return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => sorted.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE),
    [sorted, pageClamped]
  );

  return (
    <div className="leads-screen glow-corner">
      <div className="admin-button">
        {/* <a href="/" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.3 }}>alma</a> */}
        <nav style={{ marginLeft: "auto" }}>
          <a href="/">
            <button className="secondary">Back to Form</button>
          </a>
        </nav>
      </div>

      <div className="leads-left-nav">
        <a href="/">
          <img className="alma-icon-large" src="assets/icon_alma.svg" alt="" />
        </a>

        <div className="nav">
          <span>
            <b>Leads</b>
          </span>
          <span>Settings</span>
        </div>

        <div className="profile">
          <div className="profile-icon">A</div>
          <div className="profile-name">Admin</div>
        </div>
      </div>

      <div className="leads-right">
        <h2 style={{ marginTop: 0 }}>Leads</h2>

        <div className="controls">
          <input
            className="input-pill search-leads"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <ComboSelect
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as any);
              setPage(1);
            }}
            placeholder="Status"
            searchable={false} // set to true if you want type-to-filter (probably overkill here)
            options={[
              { label: "Status", value: "ALL" },
              { label: "Pending", value: "PENDING" },
              { label: "Reached Out", value: "REACHED_OUT" },
            ]}
          />
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : err ? (
          <p style={{ color: "#b00020" }}>{err}</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort("name")}>
                    Name
                    {sort.key === "name" && (
                      <FontAwesomeIcon
                        icon={sort.dir === "asc" ? faArrowUp : faArrowDown}
                        className="sort-icon"
                        aria-hidden="true"
                      />
                    )}
                  </th>

                  <th className="sortable" onClick={() => toggleSort("createdAt")}>
                    Submitted
                    {sort.key === "createdAt" && (
                      <FontAwesomeIcon
                        icon={sort.dir === "asc" ? faArrowUp : faArrowDown}
                        className="sort-icon"
                        aria-hidden="true"
                      />
                    )}
                  </th>

                  <th className="sortable" onClick={() => toggleSort("status")}>
                    Status
                    {sort.key === "status" && (
                      <FontAwesomeIcon
                        icon={sort.dir === "asc" ? faArrowUp : faArrowDown}
                        className="sort-icon"
                        aria-hidden="true"
                      />
                    )}
                  </th>

                  <th className="sortable" onClick={() => toggleSort("country")}>
                    Country
                    {sort.key === "country" && (
                      <FontAwesomeIcon
                        icon={sort.dir === "asc" ? faArrowUp : faArrowDown}
                        className="sort-icon"
                        aria-hidden="true"
                      />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <a href={`/leads/${l.id}`}>
                        {l.firstName} {l.lastName}
                      </a>
                    </td>
                    <td>{new Date(l.createdAt).toLocaleString()}</td>
                    <td>
                      {l.state === "PENDING" ? (
                        <div className="statuses">
                          Pending
                          <div
                            className="badge status-pending"
                            style={{ cursor: "pointer" }}
                            onClick={() => markReached(l.id)}
                          >
                            Reached
                          </div>
                        </div>
                      ) : (
                        <span className="badge status-reached">Reached Out</span>
                      )}
                    </td>
                    <td>{l.country}</td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#777" }}>
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageClamped === 1}>
                {<FontAwesomeIcon icon={faChevronLeft} className="sort-icon" aria-hidden="true" />}
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} className={pageClamped === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageClamped === totalPages}>
                {<FontAwesomeIcon icon={faChevronRight} className="sort-icon" aria-hidden="true" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
