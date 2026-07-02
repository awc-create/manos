// src/components/admin/contact/ContactSettings.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './ContactSettings.module.scss';

type ContactForm = {
  eyebrow: string;
  headline: string;
  sub: string;
  email: string;
  phone: string;
  location: string;
  successHeadline: string;
  successBody: string;
};

const DEFAULTS: ContactForm = {
  eyebrow: 'READY?',
  headline: "Let's bring your vision to life.",
  sub: 'Reach out to start your custom project today. Every enquiry receives a response within 24 hours.',
  email: 'hello@everythingvisual.co.uk',
  phone: '+44 7700 000 000',
  location: 'UK · Europe · International',
  successHeadline: 'Message received.',
  successBody:
    "We'll be in touch within 24 hours. Looking forward to hearing more about your project.",
};

export default function ContactSettings() {
  const [form, setForm] = useState<ContactForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/contact', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setForm({ ...DEFAULTS, ...data });
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onText =
    (key: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm((f) => ({ ...f, [key]: val }));
    };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Contact settings saved!');
    } catch {
      alert('Network error saving Contact settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>Contact</h2>
        <p>Loading current content…</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Contact</h2>
      <p>Manage the contact section copy, contact details, and success state.</p>

      <div className={styles.form}>
        {/* Section copy */}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Section copy</h3>
            <p>Text shown in the contact section on the home page.</p>
          </div>
          <div className={styles.groupGrid}>
            <label>
              Eyebrow
              <input value={form.eyebrow} onChange={onText('eyebrow')} placeholder="READY?" />
              <small>Small label above the headline.</small>
            </label>

            <label>
              Headline
              <input
                value={form.headline}
                onChange={onText('headline')}
                placeholder="Let's bring your vision to life."
              />
            </label>

            <label className={styles.full}>
              Sub-text
              <textarea
                rows={3}
                value={form.sub}
                onChange={onText('sub')}
                placeholder="Reach out to start your custom project today…"
              />
            </label>
          </div>
        </div>

        {/* Contact details */}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Contact details</h3>
            <p>Shown as clickable links in the left column.</p>
          </div>
          <div className={styles.groupGrid}>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={onText('email')}
                placeholder="hello@everythingvisual.co.uk"
              />
            </label>

            <label>
              Phone
              <input value={form.phone} onChange={onText('phone')} placeholder="+44 7700 000 000" />
            </label>

            <label>
              Location / coverage
              <input
                value={form.location}
                onChange={onText('location')}
                placeholder="UK · Europe · International"
              />
            </label>
          </div>
        </div>

        {/* Success state */}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3>Success state</h3>
            <p>Shown after a form is submitted successfully.</p>
          </div>
          <div className={styles.groupGrid}>
            <label>
              Success headline
              <input
                value={form.successHeadline}
                onChange={onText('successHeadline')}
                placeholder="Message received."
              />
            </label>

            <label className={styles.full}>
              Success body
              <textarea
                rows={2}
                value={form.successBody}
                onChange={onText('successBody')}
                placeholder="We'll be in touch within 24 hours…"
              />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.save} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save contact'}
          </button>
        </div>
      </div>

      <p className={styles.tip}>Tip: after saving, refresh the Home page to see changes.</p>
    </section>
  );
}
