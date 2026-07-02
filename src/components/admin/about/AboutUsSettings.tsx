// src/components/admin/about/AboutUsSettings.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AboutSettings.module.scss';

type AboutForm = {
  title: string;
  description: string;
  bullets: string[];
};

const DEFAULTS: AboutForm = {
  title: 'About Us',
  description: "We're a team of passionate developers turning ideas into reality.",
  bullets: ['🚀 Fast & scalable', '🎨 Design-driven', '🤝 Client-focused'],
};

export default function AboutUsSettings() {
  const [form, setForm] = useState<AboutForm>(DEFAULTS);
  const [bulletsDraft, setBulletsDraft] = useState(DEFAULTS.bullets.join('\n'));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize(taRef.current);
  }, [bulletsDraft]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/about', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const merged: AboutForm = {
          title: data.title ?? DEFAULTS.title,
          description: data.description ?? DEFAULTS.description,
          bullets: Array.isArray(data.bullets) ? data.bullets : DEFAULTS.bullets,
        };
        setForm(merged);
        setBulletsDraft(merged.bullets.join('\n'));
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onText =
    (key: keyof Omit<AboutForm, 'bullets'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm((f) => ({ ...f, [key]: val }));
    };

  const commitBullets = () => {
    const parsed = bulletsDraft
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((f) => ({ ...f, bullets: parsed }));
  };

  const save = async () => {
    const bullets = bulletsDraft
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setSaving(true);
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, bullets }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setForm((f) => ({ ...f, bullets }));
      alert('About settings saved!');
    } catch {
      alert('Network error saving About settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>About Us</h2>
        <p>Loading current content…</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>About Us</h2>
      <p>Manage the About page heading, description, and bullet points.</p>

      <div className={styles.form}>
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Copy</h3>
            <p>Text shown on the About page.</p>
          </div>
          <div className={styles.groupGrid}>
            <label className={styles.full}>
              Title
              <input value={form.title} onChange={onText('title')} placeholder="About Us" />
            </label>

            <label className={styles.full}>
              Description
              <textarea
                rows={4}
                value={form.description}
                onChange={onText('description')}
                placeholder="We're a team of passionate developers turning ideas into reality."
              />
            </label>

            <label className={styles.full}>
              Bullet points (one per line)
              <textarea
                ref={taRef}
                rows={4}
                value={bulletsDraft}
                onChange={(e) => setBulletsDraft(e.target.value)}
                onBlur={commitBullets}
                onInput={(e) => autoResize(e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.stopPropagation();
                }}
                placeholder={'🚀 Fast & scalable\n🎨 Design-driven\n🤝 Client-focused'}
              />
              <small>
                Each line becomes a bullet point. {form.bullets.length} bullet
                {form.bullets.length !== 1 ? 's' : ''} currently saved.
              </small>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.save} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save about'}
          </button>
        </div>
      </div>

      <p className={styles.tip}>Tip: after saving, refresh the About page to see changes.</p>
    </section>
  );
}
