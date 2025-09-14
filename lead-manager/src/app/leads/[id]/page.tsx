'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Lead } from '@/lib/types';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/leads/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(res.status === 404 ? 'Not found' : 'Failed to load');
        const data: Lead = await res.json();
        if (!cancelled) setLead(data);
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="card" style={{ maxWidth: 740, margin: '0 auto' }}>Loading…</div>;
  if (err) return <div className="card" style={{ maxWidth: 740, margin: '0 auto', color: '#b00020' }}>{err}</div>;
  if (!lead) return <div className="card" style={{ maxWidth: 740, margin: '0 auto' }}>Not found</div>;

  return (
    <div className="card" style={{ maxWidth: 740, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>{lead.firstName} {lead.lastName}</h2>

      <div className="grid">
        <div><label>Email</label><div><a href={`mailto:${lead.email}`}>{lead.email}</a></div></div>
        <div><label>LinkedIn</label><div><a href={lead.linkedin} target="_blank">Open profile</a></div></div>
        <div><label>Country</label><div>{lead.country}</div></div>
        <div><label>Visas</label><div>{lead.visas.join(', ')}</div></div>
        <div><label>Submitted</label><div>{new Date(lead.createdAt).toLocaleString()}</div></div>
        <div><label>Status</label><div>{lead.state}</div></div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Notes</label>
        <p style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{lead.notes || '—'}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Resume</label>
        <div>
          {lead.resume ? (
            <a download={lead.resume.filename} href={`data:${lead.resume.mime};base64,${lead.resume.base64}`}>Download</a>
          ) : '—'}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <a href="/leads"><button className="secondary">Back to list</button></a>
      </div>
    </div>
  );
}
