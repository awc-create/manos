// src/components/home/hero/Hero.tsx
'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';
import styles from './Hero.module.scss';

const services = ['Photography', 'Video', '360 VR', 'Digital Content'];

const serviceFlip = {
  hidden: { opacity: 0, rotateX: 90, y: 12, scale: 0.92 },
  show: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.6 + i * 0.13,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const dotVariant = {
  hidden: { opacity: 0, scale: 0 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.72 + i * 0.13,
      duration: 0.4,
      ease: 'backOut' as const,
    },
  }),
};

interface HeroProps {
  progress: MotionValue<number>;
  slot: 'top' | 'bottom';
}

// ── HeroTop — kicker pill ─────────────────────────────────────────────────────
function HeroTop({ progress }: { progress: MotionValue<number> }) {
  const op = useTransform(progress, [0, 0.38], [1, 0]);
  const y = useTransform(progress, [0, 0.38], ['0px', '-10px']);

  return (
    <motion.p
      className={styles.kicker}
      style={{ opacity: op, y }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      Visual Storytelling
    </motion.p>
  );
}

// ── HeroBottom — role + services ──────────────────────────────────────────────
function HeroBottom({ progress }: { progress: MotionValue<number> }) {
  const roleOp = useTransform(progress, [0, 0.36], [1, 0]);
  const roleY = useTransform(progress, [0, 0.36], ['0px', '10px']);
  const servicesOp = useTransform(progress, [0, 0.4], [1, 0]);
  const servicesY = useTransform(progress, [0, 0.4], ['0px', '12px']);

  return (
    <div className={styles.bottom}>
      <motion.p
        className={styles.role}
        style={{ opacity: roleOp, y: roleY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        Photographer / Videographer
      </motion.p>

      <motion.div className={styles.services} style={{ opacity: servicesOp, y: servicesY }}>
        {services.map((service, i) => (
          <span key={service} className={styles.serviceGroup}>
            <motion.span
              className={styles.serviceWord}
              custom={i}
              variants={serviceFlip}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.08, color: 'var(--color-accent)' }}
              style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8 + i * 0.4,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
                style={{ display: 'inline-block' }}
              >
                {service}
              </motion.span>
            </motion.span>
            {i < services.length - 1 && (
              <motion.i
                className={styles.dot}
                custom={i}
                variants={dotVariant}
                initial="hidden"
                animate="show"
                aria-hidden
              >
                •
              </motion.i>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Hero — public export, slot prop controls which part renders ───────────────
export default function Hero({ progress, slot }: HeroProps) {
  if (slot === 'top') return <HeroTop progress={progress} />;
  if (slot === 'bottom') return <HeroBottom progress={progress} />;
  return null;
}
