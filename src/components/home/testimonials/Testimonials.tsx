'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import styles from './Testimonials.module.scss';

const TESTIMONIALS = [
  {
    id: 0,
    quote:
      'Working with Everything Visual completely changed how we present our properties. The 360° tours alone increased our qualified enquiries by over 40% in the first month.',
    name: 'Sarah Mitchell',
    title: 'Director of Sales',
    company: 'Meridian Property Group',
    rating: 5,
  },
  {
    id: 1,
    quote:
      'The level of craft is extraordinary. Every frame looks like it belongs in a magazine. Our brand has never looked this good — and our clients notice immediately.',
    name: 'James Okafor',
    title: 'Creative Director',
    company: 'Voss Hotels & Resorts',
    rating: 5,
  },
  {
    id: 2,
    quote:
      "What sets them apart is the strategy behind the lens. They didn't just shoot — they understood our audience, our story, and exactly what we needed to say.",
    name: 'Priya Sharma',
    title: 'Head of Marketing',
    company: 'Latitude Travel',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'The social content series they built us runs like a machine. Consistent, beautiful, on-brand every week. Our following grew 3× in six months.',
    name: 'Tom Reeves',
    title: 'Founder',
    company: 'Reeves Fitness',
    rating: 5,
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function go(i: number) {
    setDir(i > active ? 1 : -1);
    setActive(i);
  }

  const t = TESTIMONIALS[active];

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.eyebrowRow}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <span className={styles.eyebrow}>TESTIMONIALS</span>
          <div className={styles.eyebrowRule} />
        </motion.div>

        <motion.div
          className={styles.quoteMarkWrap}
          aria-hidden="true"
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.quoteMark}>&quot;</span>
        </motion.div>

        <motion.div
          className={styles.quoteWrap}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={t.id}
              className={styles.quote}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -30 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {t.quote}
            </motion.blockquote>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id + '-attr'}
            className={styles.attribution}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.stars}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className={styles.star}>
                  ★
                </span>
              ))}
            </div>
            <div className={styles.person}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.role}>
                {t.title} · {t.company}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.nav}>
          <div className={styles.dots}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                onClick={() => go(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
          <div className={styles.progress}>
            <motion.div
              className={styles.progressBar}
              key={active}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
