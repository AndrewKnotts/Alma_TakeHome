'use client';
import { useState } from 'react';
import { leadSchema, VISA_OPTIONS } from '@/lib/validation';

export default function PublicFormPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const visas = fd.getAll('visas').map(String);
    const data = {
      firstName: String(fd.get('firstName') || ''),
      lastName: String(fd.get('lastName') || ''),
      email: String(fd.get('email') || ''),
      country: String(fd.get('country') || ''),
      linkedin: String(fd.get('linkedin') || ''),
      visas: visas as typeof VISA_OPTIONS[number][],
      notes: (String(fd.get('notes') || '') || undefined) as string | undefined,
    };

    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      setErr(parsed.error.issues.map(({ message }) => message).join(' • '));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setSubmitted(true);
      form.reset();
    } catch (e: any) {
      setErr(e.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center' }}>
        <img src="/icon.svg" alt="" width={44} height={44} style={{ marginBottom: 8 }} />
        <h2 style={{ marginTop: 0 }}>Thank You</h2>
        <p className="subtle">
          Your information was submitted to our team. Expect an email from <strong>hello@rialma.ai</strong>.
        </p>
        <div style={{ marginTop: 16 }}>
          <a href="/"><button>Go Back to Homepage</button></a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1>Get An Assessment Of Your Immigration Case</h1>
      </div>
      <div className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
        {err && <p style={{ color: '#b00020' }}>{err}</p>}
        <form onSubmit={onSubmit}>
          <div className="grid">
            <div>
              <label>First Name *</label>
              <input name="firstName" required placeholder="First Name" />
            </div>
            <div>
              <label>Last Name *</label>
              <input name="lastName" required placeholder="Last Name" />
            </div>
            <div>
              <label>Email *</label>
              <input name="email" type="email" required placeholder="Email" />
            </div>
            <div>
              <label>Country of Citizenship *</label>
              <input name="country" required placeholder="Country of Citizenship" />
            </div>
            <div>
              <label>LinkedIn / Personal Website URL *</label>
              <input name="linkedin" type="url" required placeholder="https://www.linkedin.com/in/…" />
            </div>
            <div>
              <label>Resume / CV (PDF preferred) *</label>
              <input name="resume" type="file" accept=".pdf,.doc,.docx,.txt" required />
            </div>
          </div>

          <div style={{ display: 'grid', placeItems: 'center', margin: '18px 0' }}>
            <img src="/dice.svg" alt="" width={36} height={36} />
          </div>

          <div style={{ marginTop: 6 }}>
            <label>Visa categories of interest *</label>
            <div className="checkbox-row">
              {['O-1', 'EB-1A', 'EB-2 NIW', "I don't know"].map(v => (
                <label key={v} style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
                  <input type="checkbox" name="visas" value={v} /> {v}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>How can we help you?</label>
            <textarea name="notes" rows={5} placeholder="What is your current status and goals?" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <button disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
