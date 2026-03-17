'use client';

import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';
import { useState } from 'react';
import styles from './Services.module.scss';

const SERVICES = [
  {
    num: '01',
    title: 'Commercial Photography',
    tags: ['Product', 'E-commerce', 'Branding'],
    index: 0,
    gradient: 'linear-gradient(135deg,#2a1f10 0%,#5c3d1e 30%,#b07a3a 65%,#dcc48e 100%)',
    description:
      '[PLACEHOLDER] A short paragraph describing your commercial photography service. 2–3 sentences.',
    details: [
      {
        label: 'Deliverables',
        value: '[PLACEHOLDER] e.g. High-res retouched files, web-optimised variants, raw selects',
      },
      {
        label: 'Turnaround',
        value: '[PLACEHOLDER] e.g. 5–10 business days from shoot date',
      },
      {
        label: 'Ideal for',
        value: '[PLACEHOLDER] e.g. E-commerce listings, brand campaigns, print collateral',
      },
    ],
  },
  {
    num: '02',
    title: 'Video Production',
    tags: ['Campaigns', 'Social', 'Promotional'],
    index: 1,
    gradient: 'linear-gradient(135deg,#0d1a1a 0%,#1e3a3a 35%,#2d5a4a 65%,#6b9e7e 100%)',
    description:
      '[PLACEHOLDER] A short paragraph describing your video production service. 2–3 sentences.',
    details: [
      {
        label: 'Deliverables',
        value:
          '[PLACEHOLDER] e.g. Colour-graded master, social cuts (9:16, 1:1, 16:9), subtitled variants',
      },
      {
        label: 'Turnaround',
        value: '[PLACEHOLDER] e.g. 10–20 business days from shoot date',
      },
      {
        label: 'Ideal for',
        value: '[PLACEHOLDER] e.g. Launch campaigns, brand stories, social content series',
      },
    ],
  },
  {
    num: '03',
    title: '360° Virtual Reality',
    tags: ['Real estate', 'Hospitality', 'Commercial spaces'],
    index: 2,
    gradient: 'linear-gradient(135deg,#1a1e18 0%,#2e3828 35%,#4a5e40 65%,#b3c0a4 100%)',
    description: '[PLACEHOLDER] A short paragraph describing your 360° VR service. 2–3 sentences.',
    details: [
      {
        label: 'Deliverables',
        value:
          '[PLACEHOLDER] e.g. Interactive web-embed, hosted tour link, raw equirectangular files',
      },
      {
        label: 'Turnaround',
        value: '[PLACEHOLDER] e.g. 5–8 business days from shoot date',
      },
      {
        label: 'Ideal for',
        value:
          '[PLACEHOLDER] e.g. Property listings, hotel & venue showcases, retail walk-throughs',
      },
    ],
  },
  {
    num: '04',
    title: 'Social Media Content',
    tags: ['Strategy', 'Content creation', 'Growth'],
    index: 3,
    gradient: 'linear-gradient(135deg,#1c1814 0%,#3a2e22 35%,#7a5e40 65%,#c4a882 100%)',
    description: '[PLACEHOLDER] A short paragraph on your social content approach. 2–3 sentences.',
    details: [
      {
        label: 'Deliverables',
        value:
          '[PLACEHOLDER] e.g. Monthly content calendar, photo & video assets, caption copy, scheduling',
      },
      {
        label: 'Turnaround',
        value: '[PLACEHOLDER] e.g. Ongoing monthly retainer',
      },
      {
        label: 'Ideal for',
        value: '[PLACEHOLDER] e.g. Brands building organic presence on Instagram, LinkedIn, TikTok',
      },
    ],
  },
] as const;

type ServiceItem = (typeof SERVICES)[number];

const MORPH = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 30,
  mass: 0.85,
};

const T = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
};

function ListView({
  progress,
  onSelect,
  onContinue,
}: {
  progress: MotionValue<number>;
  onSelect: (i: number) => void;
  onContinue: () => void;
}) {
  const eyebrowOp = useTransform(progress, [0.05, 0.28], [0, 1]);
  const eyebrowX = useTransform(progress, [0.05, 0.28], ['-16px', '0px']);
  const ruleScale = useTransform(progress, [0.1, 0.38], [0, 1]);

  const row0Op = useTransform(progress, [0.18, 0.46], [0, 1]);
  const row0BaseY = useTransform(progress, [0.18, 0.46], [22, 0]);

  const row1Op = useTransform(progress, [0.3, 0.56], [0, 1]);
  const row1BaseY = useTransform(progress, [0.3, 0.56], [28, 0]);

  const row2Op = useTransform(progress, [0.42, 0.66], [0, 1]);
  const row2BaseY = useTransform(progress, [0.42, 0.66], [34, 0]);

  const row3Op = useTransform(progress, [0.54, 0.76], [0, 1]);
  const row3BaseY = useTransform(progress, [0.54, 0.76], [40, 0]);

  const footerOp = useTransform(progress, [0.68, 0.88], [0, 1]);

  const collapseScaleX = useTransform(progress, [0, 1], [1, 0.996]);
  const collapseScaleY = useTransform(progress, [0, 1], [1, 0.978]);
  const collapseY = useTransform(progress, [0, 1], [0, 26]);
  const collapseOpacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0.82]);

  const rowSink0 = useTransform(progress, [0, 1], [0, 6]);
  const rowSink1 = useTransform(progress, [0, 1], [0, 10]);
  const rowSink2 = useTransform(progress, [0, 1], [0, 14]);
  const rowSink3 = useTransform(progress, [0, 1], [0, 18]);

  const row0Y = useTransform([row0BaseY, rowSink0], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const row1Y = useTransform([row1BaseY, rowSink1], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const row2Y = useTransform([row2BaseY, rowSink2], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const row3Y = useTransform([row3BaseY, rowSink3], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const rowCollapseScale = useTransform(progress, [0, 1], [1, 0.975]);

  const rowOps = [row0Op, row1Op, row2Op, row3Op];
  const rowYs = [row0Y, row1Y, row2Y, row3Y];

  return (
    <motion.div
      className={styles.list}
      style={{
        scaleX: collapseScaleX,
        scaleY: collapseScaleY,
        y: collapseY,
        opacity: collapseOpacity,
        transformOrigin: 'center top',
      }}
      exit={{ opacity: 1 }}
      transition={T}
    >
      <motion.div className={styles.eyebrow} style={{ x: eyebrowX, opacity: eyebrowOp }}>
        <span className={styles.eyebrowText}>SERVICES</span>
        <motion.div
          className={styles.eyebrowRule}
          style={{ scaleX: ruleScale, transformOrigin: 'left' }}
        />
      </motion.div>

      <div className={styles.listRows}>
        {SERVICES.map((s, i) => (
          <motion.button
            key={s.num}
            className={styles.listRow}
            onClick={() => onSelect(s.index)}
            style={{
              opacity: rowOps[i],
              y: rowYs[i],
              scaleY: rowCollapseScale,
              transformOrigin: 'center top',
            }}
            whileHover="hover"
            layout="position"
          >
            <span className={styles.listNum}>{s.num}</span>
            <div className={styles.listDivider} />
            <div className={styles.listCopy}>
              <motion.span
                className={styles.listTitle}
                layoutId={`svc-title-${s.index}`}
                transition={MORPH}
              >
                {s.title}
              </motion.span>

              <motion.span
                className={styles.listTags}
                layoutId={`svc-tags-${s.index}`}
                transition={MORPH}
              >
                {s.tags.map((t, ti) => (
                  <span key={t} className={styles.tagGroup}>
                    {t}
                    {ti < s.tags.length - 1 && <i className={styles.tagDot}>·</i>}
                  </span>
                ))}
              </motion.span>
            </div>

            <motion.div
              className={styles.listImage}
              layoutId={`svc-card-${s.index}`}
              transition={MORPH}
            >
              <div className={styles.imgPlaceholder} style={{ background: s.gradient }} />
            </motion.div>

            <motion.span
              className={styles.listArrow}
              variants={{ hover: { x: 5, opacity: 1 } }}
              style={{ opacity: 0.35 }}
            >
              →
            </motion.span>
          </motion.button>
        ))}
      </div>

      <motion.div className={styles.listFooter} style={{ opacity: footerOp }}>
        <div className={styles.scrollHint}>
          <span>Scroll to skip to Featured</span>
          <span className={styles.scrollHintArrow}>↓</span>
        </div>

        <button className={styles.continueBtn} onClick={onContinue}>
          <span>Skip to featured work</span>
          <span className={styles.nextArrow}>→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

function DetailView({
  service,
  onBack,
  onExitToFeatured,
  isLast,
}: {
  service: ServiceItem;
  onBack: () => void;
  onExitToFeatured: () => void;
  isLast: boolean;
}) {
  return (
    <motion.div
      className={styles.detail}
      initial={{ opacity: 0.98 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      key={`detail-${service.index}`}
      layout="position"
    >
      <button className={styles.backBtn} onClick={onBack}>
        <span className={styles.backArrow}>←</span>
        <span>All services</span>
      </button>

      <div className={styles.detailBody}>
        <div className={styles.detailLeft}>
          <motion.span
            className={styles.detailNum}
            initial={false}
            animate={{ opacity: 1 }}
            transition={T}
          >
            {service.num}
          </motion.span>

          <div className={styles.detailNumDivider} />

          <div className={styles.detailMeta}>
            <motion.h3
              className={styles.detailTitle}
              layoutId={`svc-title-${service.index}`}
              transition={MORPH}
            >
              {service.title}
            </motion.h3>

            <motion.p
              className={styles.detailTags}
              layoutId={`svc-tags-${service.index}`}
              transition={MORPH}
            >
              {service.tags.map((t, i) => (
                <span key={t} className={styles.tagGroup}>
                  {t}
                  {i < service.tags.length - 1 && <i className={styles.tagDot}>·</i>}
                </span>
              ))}
            </motion.p>

            <motion.p
              className={styles.detailDescription}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...T, delay: 0.08 }}
            >
              {service.description}
            </motion.p>

            <motion.dl
              className={styles.detailTable}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...T, delay: 0.12 }}
            >
              {service.details.map((d) => (
                <div key={d.label} className={styles.detailTableRow}>
                  <dt className={styles.detailTableLabel}>{d.label}</dt>
                  <dd className={styles.detailTableValue}>{d.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>

        <motion.div
          className={styles.detailImage}
          layoutId={`svc-card-${service.index}`}
          transition={MORPH}
        >
          <div className={styles.imgPlaceholder} style={{ background: service.gradient }} />
        </motion.div>
      </div>

      <div className={styles.detailFooter}>
        <div className={styles.detailDots}>
          {SERVICES.map((s) => (
            <span
              key={s.num}
              className={`${styles.detailDot} ${
                s.index === service.index ? styles.detailDotActive : ''
              }`}
            />
          ))}
        </div>

        {!isLast ? (
          <div className={styles.scrollHint}>
            <span>Scroll to continue</span>
            <span className={styles.scrollHintArrow}>↓</span>
          </div>
        ) : (
          <button className={styles.nextBtn} onClick={onExitToFeatured}>
            <span>View featured work</span>
            <span className={styles.nextArrow}>→</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Services({
  progress,
  serviceIndex,
  expanded,
  onGoToService,
  onBackToList,
  onExitToFeatured,
}: {
  progress: MotionValue<number>;
  serviceIndex: MotionValue<number>;
  expanded: boolean;
  onGoToService: (i: number) => void;
  onBackToList: () => void;
  onExitToFeatured: () => void;
}) {
  const [activeServiceIdx, setActiveServiceIdx] = useState(-1);

  useMotionValueEvent(serviceIndex, 'change', (v) => {
    setActiveServiceIdx(Math.round(v));
  });

  const isListView = !expanded || activeServiceIdx < 0;

  const sceneY = useTransform(progress, [0, 1], [80, 0]);
  const sceneOpacity = useTransform(progress, [0, 0.28, 1], [0, 1, 1]);
  const sceneScale = useTransform(progress, [0, 1], [0.985, 1]);
  const panelBgOpacity = useTransform(progress, [0, 0.24, 1], [0, 0.42, 1]);

  return (
    <motion.div className={styles.panel} style={{ opacity: progress }}>
      <motion.div className={styles.panelBg} style={{ opacity: panelBgOpacity }} />

      <motion.div
        className={styles.panelInner}
        style={{
          y: sceneY,
          opacity: sceneOpacity,
          scale: sceneScale,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isListView ? (
            <ListView
              key="list"
              progress={progress}
              onSelect={onGoToService}
              onContinue={onExitToFeatured}
            />
          ) : (
            <DetailView
              key={`detail-${activeServiceIdx}`}
              service={SERVICES[activeServiceIdx] ?? SERVICES[0]}
              onBack={onBackToList}
              onExitToFeatured={onExitToFeatured}
              isLast={activeServiceIdx === SERVICES.length - 1}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
