'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Worldwide.module.scss';

const REGIONS = [
  { label: 'United Kingdom', detail: 'London · Manchester · Edinburgh', num: '01' },
  { label: 'Europe', detail: 'Paris · Amsterdam · Barcelona · Milan', num: '02' },
  { label: 'International', detail: 'New York · Dubai · Tokyo · Bali', num: '03' },
];

const OFFERINGS = [
  'Free strategic planning on every project',
  'Bespoke packages — no off-the-shelf solutions',
  'Local fixers & crew where you need them',
  'End-to-end production, globally',
];

const T = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export default function Worldwide() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ ...T, delay: 0.04 }}
          >
            REACH
          </motion.span>

          <motion.h2
            className={styles.headline}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...T, delay: 0.1 }}
          >
            Sky is the
            <br />
            <em className={styles.em}>limit.</em>
          </motion.h2>

          <motion.p
            className={styles.sub}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.18 }}
          >
            UK-based, globally minded. Every project — wherever it takes us.
          </motion.p>
        </div>

        <div className={styles.mapWrap} aria-hidden="true">
          <div className={styles.mapDots} />
          <svg className={styles.mapLines} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M18,28 Q30,35 24,34"
              stroke="rgba(220,196,142,0.3)"
              strokeWidth="0.3"
              fill="none"
            />
            <path
              d="M24,34 Q32,40 39,48"
              stroke="rgba(220,196,142,0.3)"
              strokeWidth="0.3"
              fill="none"
            />
            <path
              d="M39,48 Q55,43 71,38"
              stroke="rgba(220,196,142,0.3)"
              strokeWidth="0.3"
              fill="none"
            />
          </svg>
          <div className={styles.mapPins}>
            {[
              { left: '18%', top: '28%', label: 'London' },
              { left: '24%', top: '34%', label: 'Paris' },
              { left: '39%', top: '48%', label: 'Dubai' },
              { left: '71%', top: '38%', label: 'Tokyo' },
              { left: '22%', top: '42%', label: 'New York' },
              { left: '68%', top: '70%', label: 'Bali' },
            ].map((p) => (
              <span
                key={p.label}
                className={styles.pin}
                style={{ left: p.left, top: p.top }}
                data-label={p.label}
              />
            ))}
          </div>
        </div>

        <motion.div
          className={styles.regions}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ ...T, delay: 0.22 }}
        >
          {REGIONS.map((r, i) => (
            <motion.div
              key={r.num}
              className={styles.region}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ ...T, delay: 0.26 + i * 0.08 }}
            >
              <span className={styles.regionNum}>{r.num}</span>
              <div className={styles.regionDivider} />
              <div className={styles.regionCopy}>
                <span className={styles.regionLabel}>{r.label}</span>
                <span className={styles.regionDetail}>{r.detail}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.offerings}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ ...T, delay: 0.44 }}
        >
          {OFFERINGS.map((o) => (
            <div key={o} className={styles.offering}>
              <span className={styles.offeringDot} />
              <span>{o}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
