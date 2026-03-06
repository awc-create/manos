'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Hero.module.scss';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className="container">
        <motion.div
          className={styles.inner}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.header className={styles.heading} variants={fadeUp}>
            <motion.p className={styles.kicker} variants={fadeUp}>
              Visual Storytelling
            </motion.p>

            <motion.h1 variants={fadeUp}>Everything Visual</motion.h1>

            <motion.p className={styles.role} variants={fadeUp}>
              Photographer / Videographer
            </motion.p>
          </motion.header>

          <motion.div className={styles.gallery} variants={containerVariants}>
            <motion.div
              className={`${styles.card} ${styles.cardTall}`}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className={styles.media}>
                <Image
                  src="/assets/hero/hero-1.jpg"
                  alt="Landscape photography"
                  fill
                  priority
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                />
              </div>
            </motion.div>

            <motion.div
              className={`${styles.card} ${styles.cardLower}`}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className={styles.media}>
                <video autoPlay muted loop playsInline preload="auto">
                  <source src="/assets/hero/hero-2.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.card} ${styles.cardTall}`}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className={styles.media}>
                <video autoPlay muted loop playsInline preload="auto">
                  <source src="/assets/hero/hero-3.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.card} ${styles.cardLower}`}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className={styles.media}>
                <Image
                  src="/assets/hero/hero-4.avif"
                  alt="Digital content creation"
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.p className={styles.services} variants={fadeUp}>
            <span>Photography</span>
            <i>•</i>
            <span>Video</span>
            <i>•</i>
            <span>360 VR</span>
            <i>•</i>
            <span>Digital Content</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
