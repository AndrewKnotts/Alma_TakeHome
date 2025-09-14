'use client';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get('next') || '/leads';
      window.location.href = next;
    } else {
      setErr('Invalid password. Try "admin"');
    }
  }

  useEffect(() => {
    fetch('/api/auth/logout', { method: 'POST' }); // clear any stale cookie
  }, []);

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ marginTop: 0 }}>Internal Login</h2>
      <p style={{ opacity: 0.8 }}>Mock auth — enter <code>admin</code> to proceed.</p>
      <form onSubmit={login}>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="admin" />
        <div style={{ display:'flex', gap:10, alignItems:'center', marginTop: 12 }}>
          <button>Login</button>
          {err && <span className="badge" style={{ color:'#b00020' }}>{err}</span>}
        </div>
      </form>
    </div>
  );
}
