// src/components/admin/settings/HeroSection.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './HeroSettings.module.scss';

type HeroForm = {
  kicker: string;
  role: string;
  services: string[];
};

const DEFAULTS: HeroForm = {
  kicker: 'Visual Storytelling',
  role: 'Photographer / Videographer',
  services: ['Photography', 'Video', '360 VR', 'Digital Content'],
};

export default function HeroSettings() {
  const [form, setForm] = useState<HeroForm>(DEFAULTS);
  const [servicesDraft, setServicesDraft] = useState(DEFAULTS.services.join(', '));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/hero', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<HeroForm>;
        const merged = { ...DEFAULTS, ...data };
        setForm(merged);
        setServicesDraft((merged.services ?? DEFAULTS.services).join(', '));
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onText =
    (key: keyof Omit<HeroForm, 'services'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setForm((f) => ({ ...f, [key]: val }));
    };

  const commitServices = () => {
    const parsed = servicesDraft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((f) => ({ ...f, services: parsed }));
  };

  const save = async () => {
    const services = servicesDraft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setSaving(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, services }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setForm((f) => ({ ...f, services }));
      alert('Hero updated! Refresh Home to see changes.');
    } catch {
      alert('Network error saving hero.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>Home Hero</h2>
        <p>Loading current hero content…</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Home Hero</h2>
      <p>Update the kicker pill, role title, and animated services shown in the hero.</p>

      <div className={styles.form}>
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Hero text</h3>
            <p>The pill at the very top and the role shown beneath the scroll cards.</p>
          </div>
          <div className={styles.groupGrid}>
            <label>
              Kicker pill
              <input
                value={form.kicker}
                onChange={onText('kicker')}
                placeholder="Visual Storytelling"
              />
              <small>Short phrase inside the pill at the top of the hero.</small>
            </label>

            <label>
              Role / title
              <input
                value={form.role}
                onChange={onText('role')}
                placeholder="Photographer / Videographer"
              />
              <small>Shown beneath the scroll cards.</small>
            </label>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Services</h3>
            <p>Each becomes an animated floating tag in the hero strip.</p>
          </div>
          <div className={styles.groupGrid}>
            <label className={styles.full}>
              Services (comma-separated)
              <input
                value={servicesDraft}
                onChange={(e) => setServicesDraft(e.target.value)}
                onBlur={commitServices}
                placeholder="Photography, Video, 360 VR, Digital Content"
              />
              <small>
                {form.services.length} service{form.services.length !== 1 ? 's' : ''} —{' '}
                {form.services.join(' · ')}
              </small>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.save} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save hero'}
          </button>
        </div>
      </div>

      <p className={styles.tip}>Tip: after saving, refresh the Home page to see changes.</p>
    </section>
  );
}
