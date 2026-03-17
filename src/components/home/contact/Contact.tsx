'use client';

import { useRef, useState } from 'react';
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

const T = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('sent');
  }

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
            READY?
          </motion.span>

          <motion.h2
            className={styles.headline}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...T, delay: 0.12 }}
          >
            Let&apos;s bring
            <br />
            your vision
            <br />
            <em className={styles.em}>to life.</em>
          </motion.h2>

          <motion.p
            className={styles.sub}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.2 }}
          >
            Reach out to start your custom project today. Every enquiry receives a response within
            24 hours.
          </motion.p>

          <motion.div
            className={styles.details}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.28 }}
          >
            <a href="mailto:hello@everythingvisual.co.uk" className={styles.detailLink}>
              hello@everythingvisual.co.uk
            </a>
            <a href="tel:+447700000000" className={styles.detailLink}>
              +44 7700 000 000
            </a>
            <span className={styles.detailText}>UK · Europe · International</span>
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
                <h3 className={styles.thankHeadline}>Message received.</h3>
                <p className={styles.thankBody}>
                  We&apos;ll be in touch within 24 hours. Looking forward to hearing more about your
                  project.
                </p>
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
