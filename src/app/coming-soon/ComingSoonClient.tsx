'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.scss';

export default function ComingSoonClient() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/';

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const unlock = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/gate/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error || 'Not quite — try again.');
        setLoading(false);
        return;
      }

      window.location.href = from;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.kicker}>Private preview</p>

        <h1 className={styles.title}>Coming soon.</h1>

        <p className={styles.lead}>
          This site is currently in a private preview state while content, layout, and final details
          are being refined.
        </p>

        <div className={styles.row}>
          <span className={styles.pill}>Design · Build · Private access</span>

          <button type="button" className={styles.private} onClick={() => setOpen(true)}>
            Enter password
          </button>
        </div>
      </section>

      {open ? (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTop}>
              <h2 className={styles.modalTitle}>Private access</h2>

              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className={styles.modalLead}>Enter the password to unlock the full site.</p>

            <div className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>Password</span>

                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      void unlock();
                    }
                  }}
                />
              </label>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button
              type="button"
              className={styles.unlock}
              onClick={() => void unlock()}
              disabled={loading || !password.trim()}
            >
              {loading ? 'Unlocking…' : 'Unlock'}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
