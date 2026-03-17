'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import styles from './VR360.module.scss';

const SECTORS = [
  {
    id: 'real-estate',
    label: 'Real Estate',
    gradient: 'linear-gradient(135deg,#1a1e1c 0%,#2a3830 40%,#3a5448 70%,#6a9080 100%)',
    stat: '4× more enquiries',
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    gradient: 'linear-gradient(135deg,#1a1810 0%,#3a2c18 40%,#7a6040 70%,#c4a870 100%)',
    stat: '60% longer engagement',
  },
  {
    id: 'tourism',
    label: 'Tourism',
    gradient: 'linear-gradient(135deg,#101820 0%,#182838 40%,#1e3c58 70%,#4878a8 100%)',
    stat: '2× booking confidence',
  },
];

const T = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export default function VR360() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [modal, setModal] = useState(false);

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
            IMMERSIVE TECHNOLOGY
          </motion.span>

          <motion.h2
            className={styles.headline}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...T, delay: 0.12 }}
          >
            360° VR
            <br />
            <em className={styles.em}>Media</em>
          </motion.h2>

          <motion.p
            className={styles.sub}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ ...T, delay: 0.2 }}
          >
            Place your audience inside a space before they ever visit. Our 360° VR productions are
            engineered to convert — turning viewers into believers and believers into clients.
          </motion.p>

          <motion.div
            className={styles.stats}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.28 }}
          >
            {SECTORS.map((s) => (
              <div key={s.id} className={styles.stat}>
                <span className={styles.statNum}>{s.stat}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className={styles.actions}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...T, delay: 0.36 }}
          >
            <button className={styles.learnBtn} onClick={() => setModal(true)}>
              What is 360° VR? →
            </button>
          </motion.div>
        </div>

        {/* Right — circles */}
        <div className={styles.circles}>
          {SECTORS.map((s, i) => (
            <motion.div
              key={s.id}
              className={styles.circleWrap}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ ...T, delay: 0.22 + i * 0.1 }}
            >
              <div className={styles.circle}>
                <div className={styles.circleBg} style={{ background: s.gradient }} />
                <div className={styles.badge}>
                  <span className={styles.badgeSpin}>⟳</span>
                  <span>360°</span>
                </div>
              </div>
              <span className={styles.circleLabel}>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setModal(false)}>
                ✕
              </button>
              <span className={styles.modalEyebrow}>360° VR MEDIA</span>
              <h3 className={styles.modalHeadline}>What is 360° Virtual Reality?</h3>

              <p className={styles.modalBody}>
                360° VR media captures an environment in every direction simultaneously, creating a
                fully immersive experience the viewer can explore freely — on a headset, in a
                browser, or embedded in an app. Unlike a photograph or video, VR places your
                audience <em>inside</em> the space. They look up, turn around, lean in. It is the
                closest thing to being there.
              </p>
              <p className={styles.modalBody}>
                For property, hospitality, and tourism brands, this is transformative. A buyer
                touring a penthouse from their sofa. A couple choosing a wedding venue from Tokyo. A
                traveller walking through a resort before they book. The decision is made before
                they ever arrive.
              </p>

              <div className={styles.modalGrid}>
                {[
                  {
                    n: '01',
                    t: 'Virtual Property Tours',
                    d: 'Let buyers experience every room, every angle, every view — on any device, anywhere in the world.',
                  },
                  {
                    n: '02',
                    t: 'Resort & Hotel Showcases',
                    d: 'Give guests the confidence to book by letting them explore the pool, the suite, the restaurant.',
                  },
                  {
                    n: '03',
                    t: 'Tourism & Destinations',
                    d: 'Bring locations to life before the trip. Drive aspiration. Convert browsers into bookers.',
                  },
                  {
                    n: '04',
                    t: 'Commercial Walk-throughs',
                    d: 'Show office spaces, showrooms, and retail environments to stakeholders globally.',
                  },
                ].map((item) => (
                  <div key={item.n} className={styles.modalItem}>
                    <span className={styles.modalItemNum}>{item.n}</span>
                    <div>
                      <h4 className={styles.modalItemTitle}>{item.t}</h4>
                      <p className={styles.modalItemDesc}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.contactBtn}>Start a VR project →</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
