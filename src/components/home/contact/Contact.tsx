'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import styles from './Contact.module.scss';

const SERVICES = [
  'Commercial Photography',
  'Video Production',
  '360° Virtual Reality',
  'Social Media Content',
  'Multiple / Not sure yet',
];

type Status = 'idle' | 'sending' | 'sent';

type ContactConfig = {
  eyebrow: string;
  headline: string;
  sub: string;
  email: string;
  phone: string;
  location: string;
  successHeadline: string;
  successBody: string;
};

const DEFAULTS: ContactConfig = {
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

const T = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const [config, setConfig] = useState<ContactConfig>(DEFAULTS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    fetch('/api/contact', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setConfig({ ...DEFAULTS, ...d });
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('sent');
  }

  const phoneRaw = config.phone.replace(/\s+/g, '');

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        {/* Left */}
        <div className={styles.left}>
          <motion.span
            className={styles.eyebrow}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ ...T, delay: 0.05 }}
          >
            {config.eyebrow}
          </motion.span>

          <motion.h2
            className={styles.headline}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...T, delay: 0.12 }}
          >
            {config.headline}
          </motion.h2>

          <motion.p
            className={styles.sub}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.2 }}
          >
            {config.sub}
          </motion.p>

          <motion.div
            className={styles.details}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.28 }}
          >
            <a href={`mailto:${config.email}`} className={styles.detailLink}>
              {config.email}
            </a>
            <a href={`tel:${phoneRaw}`} className={styles.detailLink}>
              {config.phone}
            </a>
            <span className={styles.detailText}>{config.location}</span>
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div
          className={styles.formWrap}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ...T, delay: 0.18 }}
        >
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="sent"
                className={styles.thankYou}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.thankIcon}>✓</span>
                <h3 className={styles.thankHeadline}>{config.successHeadline}</h3>
                <p className={styles.thankBody}>{config.successBody}</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                className={styles.form}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.row}>
                  <Field label="Name" value={name} onChange={setName} />
                  <Field label="Email" value={email} onChange={setEmail} type="email" />
                </div>

                <div className={styles.serviceGrid}>
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.serviceChip} ${service === s ? styles.chipActive : ''}`}
                      onClick={() => setService(service === s ? '' : s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className={styles.fieldWrap}>
                  <label className={`${styles.fieldLabel} ${message ? styles.labelUp : ''}`}>
                    Message
                  </label>
                  <textarea
                    className={styles.fieldInput}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <button
                  className={`${styles.submitBtn} ${status === 'sending' ? styles.sending : ''}`}
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <span>Send enquiry</span>
                      <span className={styles.arrow}>→</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={`${styles.fieldLabel} ${value ? styles.labelUp : ''}`}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
