'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Instagram.module.scss';

const POSTS = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg,#2a1f10 0%,#b07a3a 100%)',
    caption: 'Commercial · Nike · Tuscany',
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg,#081420 0%,#1a5070 100%)',
    caption: 'Travel · Hilton · Maldives',
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg,#1a1e18 0%,#4a5e40 100%)',
    caption: '360° VR · Airbnb · Amsterdam',
  },
  {
    id: 4,
    gradient: 'linear-gradient(135deg,#1a1000 0%,#a06000 100%)',
    caption: 'Travel · Sony · Los Angeles',
  },
  {
    id: 5,
    gradient: 'linear-gradient(135deg,#18100c 0%,#7a4020 100%)',
    caption: 'Lifestyle · Vogue · Paris',
  },
  {
    id: 6,
    gradient: 'linear-gradient(135deg,#101418 0%,#404e68 100%)',
    caption: 'Commercial · Hyundai · Seoul',
  },
  {
    id: 7,
    gradient: 'linear-gradient(135deg,#081820 0%,#1a5870 100%)',
    caption: 'Video · Lexus · Costa Rica',
  },
  {
    id: 8,
    gradient: 'linear-gradient(135deg,#1c1814 0%,#7a5e40 100%)',
    caption: 'Social · Reeves · London',
  },
];

const T = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

export default function Instagram() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.header}>
        <motion.div
          className={styles.eyebrowRow}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ ...T, delay: 0.05 }}
        >
          <span className={styles.eyebrow}>INSTAGRAM</span>
          <div className={styles.eyebrowRule} />
        </motion.div>

        <motion.div
          className={styles.headerRight}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ ...T, delay: 0.12 }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.handle}
          >
            @everythingvisual
          </a>
          <span className={styles.dragHint}>← drag to explore →</span>
        </motion.div>
      </div>

      <motion.div
        className={styles.trackOuter}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ ...T, delay: 0.18 }}
      >
        <motion.div
          ref={trackRef}
          className={styles.track}
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0.08}
          style={{ cursor: 'grab' }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <div className={styles.trackInner}>
            {POSTS.map((post, i) => (
              <motion.a
                key={post.id}
                className={styles.post}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ ...T, delay: 0.22 + i * 0.04 }}
                whileHover={{ scale: 1.03, zIndex: 2 }}
              >
                <div className={styles.postBg} style={{ background: post.gradient }} />
                <div className={styles.postOverlay} />
                <div className={styles.postCaption}>{post.caption}</div>
                <div className={styles.postIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
