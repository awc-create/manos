'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useTransform, MotionValue } from 'framer-motion';
import styles from './Featured.module.scss';

type Tab = 'all' | 'commercial' | 'travel' | 'lifestyle' | 'vr360' | 'video';

interface WorkItem {
  id: number;
  title: string;
  client: string;
  location: string;
  gradient: string;
  categories: Tab[];
  badge?: '360°' | 'video';
  svcIndex?: number;
}

const ITEMS: WorkItem[] = [
  {
    id: 1,
    title: 'Taste of Italy',
    client: 'Nike',
    location: 'Tuscany',
    gradient: 'linear-gradient(135deg,#2a1f10 0%,#5c3d1e 30%,#b07a3a 65%,#dcc48e 100%)',
    categories: ['commercial'],
    svcIndex: 0,
  },
  {
    id: 2,
    title: 'Sea of Serenity',
    client: 'Lexus',
    location: 'Costa Rica',
    gradient: 'linear-gradient(160deg,#081820 0%,#103040 35%,#1a5870 65%,#4090b0 100%)',
    categories: ['video'],
    svcIndex: 1,
    badge: 'video',
  },
  {
    id: 3,
    title: '360° City Walkthrough',
    client: 'Airbnb',
    location: 'Amsterdam',
    gradient: 'linear-gradient(135deg,#1a1e18 0%,#2e3828 35%,#4a5e40 65%,#b3c0a4 100%)',
    categories: ['vr360'],
    svcIndex: 2,
    badge: '360°',
  },
  {
    id: 4,
    title: 'Timeless Elegance',
    client: 'Vogue',
    location: 'Paris',
    gradient: 'linear-gradient(135deg,#1c1814 0%,#3a2e22 35%,#7a5e40 65%,#c4a882 100%)',
    categories: ['lifestyle'],
    svcIndex: 3,
  },
  {
    id: 5,
    title: 'Beyond Reality',
    client: 'Hilton',
    location: 'Maldives',
    gradient: 'linear-gradient(160deg,#081420 0%,#102840 35%,#1a5070 65%,#50a0c0 100%)',
    categories: ['travel'],
  },
  {
    id: 6,
    title: 'A Californian Dream',
    client: 'Sony',
    location: 'Los Angeles',
    gradient: 'linear-gradient(160deg,#1a1000 0%,#3d2800 35%,#a06000 65%,#e0a850 100%)',
    categories: ['travel'],
  },
  {
    id: 7,
    title: 'Modern Style',
    client: 'Hyundai',
    location: 'Seoul',
    gradient: 'linear-gradient(160deg,#101418 0%,#242a34 35%,#404e68 65%,#7888a8 100%)',
    categories: ['commercial'],
  },
  {
    id: 8,
    title: 'Through Cinematic Lens',
    client: 'BBC',
    location: 'Japan',
    gradient: 'linear-gradient(160deg,#1a1408 0%,#3a2c10 35%,#7a6030 65%,#c4a860 100%)',
    categories: ['lifestyle'],
  },
  {
    id: 9,
    title: 'Alpine Adventure',
    client: 'The North Face',
    location: 'Switzerland',
    gradient: 'linear-gradient(160deg,#101418 0%,#1e2c3c 35%,#2e4870 65%,#6090c8 100%)',
    categories: ['video'],
    badge: 'video',
  },
  {
    id: 10,
    title: '360° Luxury Villa',
    client: 'Four Seasons',
    location: 'Bali',
    gradient: 'linear-gradient(160deg,#1a1408 0%,#3a2c18 35%,#7a6040 65%,#c4a870 100%)',
    categories: ['vr360'],
    badge: '360°',
  },
  {
    id: 11,
    title: 'Myanmar Adventures',
    client: 'BBC',
    location: 'Myanmar',
    gradient: 'linear-gradient(160deg,#181008 0%,#3a2810 35%,#8a6020 65%,#d4a840 100%)',
    categories: ['travel'],
  },
  {
    id: 12,
    title: 'Home Away from Home',
    client: 'Airbnb',
    location: 'Morocco',
    gradient: 'linear-gradient(160deg,#1a1208 0%,#3c2810 35%,#8a6030 65%,#d4a860 100%)',
    categories: ['lifestyle'],
  },
];

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'travel', label: 'Travel' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'vr360', label: '360° VR' },
  { key: 'video', label: 'Video' },
];

const MORPH = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

function Card({ item, index }: { item: WorkItem; index: number }) {
  const isMorphed = item.svcIndex !== undefined;

  return (
    <motion.article
      className={styles.card}
      layout
      whileHover="hover"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: isMorphed ? 0.04 + index * 0.03 : 0.16 + index * 0.04,
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {isMorphed ? (
        <motion.div
          className={styles.cardBg}
          style={{ background: item.gradient }}
          layoutId={`svc-card-${item.svcIndex}`}
          transition={MORPH}
        />
      ) : (
        <div className={styles.cardBg} style={{ background: item.gradient }} />
      )}

      {item.badge === '360°' && (
        <motion.div
          className={styles.badge360}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.28 }}
        >
          <span className={styles.badgeSpin}>⟳</span>
          <span>360°</span>
        </motion.div>
      )}

      {item.badge === 'video' && (
        <motion.div
          className={styles.badgePlay}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.28 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.div>
      )}

      <div className={styles.overlay} />

      <motion.div
        className={styles.expandHint}
        variants={{ hover: { opacity: 1 }, initial: { opacity: 0 } }}
        initial="initial"
      >
        ⤢
      </motion.div>

      <motion.div
        className={styles.caption}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: isMorphed ? 0.18 : 0.26,
          duration: 0.34,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardMeta}>
          <span className={styles.cardClient}>{item.client}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.cardLocation}>{item.location}</span>
        </p>
      </motion.div>
    </motion.article>
  );
}

export default function Featured({
  progress,
  onContinue,
}: {
  progress: MotionValue<number>;
  onContinue: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filtered = useMemo(
    () => (activeTab === 'all' ? ITEMS : ITEMS.filter((i) => i.categories.includes(activeTab))),
    [activeTab]
  );

  const visible = filtered.slice(0, 6);

  const panelOp = useTransform(progress, (v) => Math.max(0, Math.min(1, v)));
  const panelY = useTransform(panelOp, [0, 1], [36, 0]);
  const panelScale = useTransform(panelOp, [0, 1], [0.992, 1]);

  const headerOpacity = useTransform(panelOp, [0.18, 0.55, 1], [0, 0.9, 1]);
  const headerY = useTransform(panelOp, [0, 1], [18, 0]);

  const tabsOpacity = useTransform(panelOp, [0.24, 0.62, 1], [0, 0.92, 1]);
  const tabsY = useTransform(panelOp, [0, 1], [12, 0]);

  const taglineOpacity = useTransform(panelOp, [0.3, 0.7, 1], [0, 0.94, 1]);
  const gridOpacity = useTransform(panelOp, [0.08, 0.42, 1], [0, 0.95, 1]);
  const gridY = useTransform(panelOp, [0, 1], [24, 0]);
  const footerOpacity = useTransform(panelOp, [0.36, 0.76, 1], [0, 0.94, 1]);

  return (
    <motion.div
      className={styles.panel}
      style={{
        opacity: panelOp,
        y: panelY,
        scale: panelScale,
      }}
    >
      <motion.div
        className={styles.panelShield}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      />

      <motion.div className={styles.header} style={{ opacity: headerOpacity, y: headerY }}>
        <div className={styles.eyebrow}>
          <motion.span
            className={styles.eyebrowLabel}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.04 }}
          >
            FEATURED WORK
          </motion.span>

          <motion.div
            className={styles.eyebrowLine}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.46, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        <motion.nav className={styles.tabs} style={{ opacity: tabsOpacity, y: tabsY }}>
          {TABS.map((t, i) => (
            <motion.button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.08 + i * 0.028 }}
            >
              {t.label}
              {activeTab === t.key && (
                <motion.span
                  className={styles.tabBar}
                  layoutId="feat-tab-bar"
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </motion.button>
          ))}
        </motion.nav>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${activeTab}-tag`}
          className={styles.tagline}
          style={{ opacity: taglineOpacity }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {TABS.find((t) => t.key === activeTab)?.label}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className={styles.gridWrap}
          style={{ opacity: gridOpacity, y: gridY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className={styles.grid} data-count={visible.length} layout>
            {visible.map((item, i) => (
              <Card key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.div className={styles.footer} style={{ opacity: footerOpacity }}>
        <a href="/portfolio" className={styles.portfolioBtn}>
          <span>View full portfolio</span>
          <span className={styles.btnArrow}>→</span>
        </a>

        <button className={styles.continueBtn} onClick={onContinue}>
          <span>Continue</span>
          <span className={styles.btnArrow}>↓</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
