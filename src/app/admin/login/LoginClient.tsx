// src/app/admin/login/LoginClient.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import styles from './Login.module.scss';

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = useMemo(() => sp.get('callbackUrl') ?? '/admin', [sp]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const csrfRes = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfRes.json();

      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email,
          password,
          csrfToken,
          callbackUrl,
          json: 'true',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.error) {
        setErr('Invalid email or password.');
        return;
      }

      router.replace(data.url ?? callbackUrl);
      router.refresh();
    } catch {
      setLoading(false);
      setErr('Something went wrong. Please try again.');
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <strong>Manos</strong>
          <span>Studio Admin</span>
        </div>

        <div className={styles.divider} />

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.fieldWrap}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="admin@everything-visual.co.uk"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldWrap}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="••••••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && <div className={styles.error}>{err}</div>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  );
}
