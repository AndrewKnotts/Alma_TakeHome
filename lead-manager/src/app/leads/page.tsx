'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Lead } from '@/lib/types';

const PAGE_SIZE = 8;
type SortKey = 'name' | 'createdAt' | 'status' | 'country';
type SortState = { key: SortKey; dir: 'asc' | 'desc' };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'REACHED_OUT'>('ALL');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', dir: 'desc' });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('Failed to load');
      const data: Lead[] = await res.json();
      setLeads(data);
    } catch (e: any) {
      setErr(e.message);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function toggleSort(k: SortKey) {
    setSort(s => (s.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }));
  }

  async function markReached(id: string) {
    await fetch(`/api/leads?id=${id}`, { method: 'PATCH', body: JSON.stringify({ state: 'REACHED_OUT' }), headers: { 'Content-Type': 'application/json' } });
    load();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter(l => {
      const matchesQ = !q || `${l.firstName} ${l.lastName}`.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || l.state === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      switch (sort.key) {
        case 'name':     return dir * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'country':  return dir * a.country.localeCompare(b.country);
        case 'status':   return dir * a.state.localeCompare(b.state);
        case 'createdAt':
        default:         return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const pageItems = useMemo(() => sorted.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE), [sorted, pageClamped]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Leads</h2>

      <div className="controls">
        <input className="input-pill" placeholder="Search" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
        <select className="input-pill" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}>
          <option value="ALL">Status</option>
          <option value="PENDING">Pending</option>
          <option value="REACHED_OUT">Reached Out</option>
        </select>
      </div>

      {loading ? <p>Loading…</p> : err ? <p style={{ color:'#b00020' }}>{err}</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('name')}>Name {sort.key==='name' ? (sort.dir==='asc'?'↑':'↓') : ''}</th>
                <th className="sortable" onClick={() => toggleSort('createdAt')}>Submitted {sort.key==='createdAt' ? (sort.dir==='asc'?'↑':'↓') : ''}</th>
                <th className="sortable" onClick={() => toggleSort('status')}>Status {sort.key==='status' ? (sort.dir==='asc'?'↑':'↓') : ''}</th>
                <th className="sortable" onClick={() => toggleSort('country')}>Country {sort.key==='country' ? (sort.dir==='asc'?'↑':'↓') : ''}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(l => (
                <tr key={l.id}>
                  <td><a href={`/leads/${l.id}`}>{l.firstName} {l.lastName}</a></td>
                  <td>{new Date(l.createdAt).toLocaleString()}</td>
                  <td>
                    {l.state === 'PENDING'
                      ? <span className="badge status-pending" style={{ cursor:'pointer' }} onClick={() => markReached(l.id)}>Pending (mark reached)</span>
                      : <span className="badge status-reached">Reached Out</span>}
                  </td>
                  <td>{l.country}</td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 24, textAlign:'center', color:'#777' }}>No results</td></tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={pageClamped===1}>{'<'}</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} className={pageClamped===i+1 ? 'active' : ''} onClick={() => setPage(i+1)}>{i+1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={pageClamped===totalPages}>{'>'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
