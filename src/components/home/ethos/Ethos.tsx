'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';
import styles from './Ethos.module.scss';

const beliefs = [
  {
    number: '01',
    headline: 'Light is everything.',
    body: 'Every frame begins before the shutter opens — in the patience to wait for the moment the world stops performing and starts being.',
  },
  {
    number: '02',
    headline: 'Story over spectacle.',
    body: 'The most powerful image is the one that makes a stranger feel something true. Technique is invisible when the story is real.',
  },
  {
    number: '03',
    headline: 'Craft, obsessively.',
    body: 'From pre-production to final grade, every decision is intentional. Good enough is not a standard. It is a starting point.',
  },
];

interface EthosProps {
  progress: MotionValue<number>;
  exitProgress: MotionValue<number>;
}

export default function Ethos({ progress, exitProgress }: EthosProps) {
  const kickerX = useTransform(progress, [0.28, 0.7], [-20, 0]);
  const kickerOp = useTransform(progress, [0.28, 0.7], [0, 1]);
  const ruleScale = useTransform(progress, [0.35, 0.75], [0, 1]);

  const subOp = useTransform(progress, [0.42, 0.82], [0, 1]);
  const subY = useTransform(progress, [0.42, 0.82], [14, 0]);

  const divScale = useTransform(progress, [0.52, 0.88], [0, 1]);

  const b0EnterOp = useTransform(progress, [0.6, 0.88], [0, 1]);
  const b0EnterY = useTransform(progress, [0.6, 0.88], [14, 0]);

  const b1EnterOp = useTransform(progress, [0.66, 0.92], [0, 1]);
  const b1EnterY = useTransform(progress, [0.66, 0.92], [14, 0]);

  const b2EnterOp = useTransform(progress, [0.72, 0.97], [0, 1]);
  const b2EnterY = useTransform(progress, [0.72, 0.97], [14, 0]);

  const topExitOp = useTransform(exitProgress, [0, 0.34], [1, 0]);
  const topExitY = useTransform(exitProgress, [0, 0.34], [0, 22]);
  const topExitBlur = useTransform(exitProgress, [0, 0.34], ['blur(0px)', 'blur(4px)']);

  const b0ExitOp = useTransform(exitProgress, [0.08, 0.42], [1, 0]);
  const b0ExitY = useTransform(exitProgress, [0.08, 0.42], [0, 28]);
  const b0ExitBlur = useTransform(exitProgress, [0.08, 0.42], ['blur(0px)', 'blur(5px)']);

  const b1ExitOp = useTransform(exitProgress, [0.18, 0.54], [1, 0]);
  const b1ExitY = useTransform(exitProgress, [0.18, 0.54], [0, 38]);
  const b1ExitBlur = useTransform(exitProgress, [0.18, 0.54], ['blur(0px)', 'blur(6px)']);

  const b2ExitOp = useTransform(exitProgress, [0.3, 0.66], [1, 0]);
  const b2ExitY = useTransform(exitProgress, [0.3, 0.66], [0, 48]);
  const b2ExitBlur = useTransform(exitProgress, [0.3, 0.66], ['blur(0px)', 'blur(7px)']);

  const kickerOpFinal = useTransform([kickerOp, topExitOp], (values) => {
    const [a, b] = values as [number, number];
    return a * b;
  });

  const subOpFinal = useTransform([subOp, topExitOp], (values) => {
    const [a, b] = values as [number, number];
    return a * b;
  });

  const divScaleFinal = useTransform([divScale, topExitOp], (values) => {
    const [a, b] = values as [number, number];
    return a * b;
  });

  const subYFinal = useTransform([subY, topExitY], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const b0Op = useTransform([b0EnterOp, b0ExitOp], (values) => {
    const [a, b] = values as [number, number];
    return a * b;
  });

  const b1Op = useTransform([b1EnterOp, b1ExitOp], (values) => {
    const [a, b] = values as [number, number];
    return a * b;
  });

  const b2Op = useTransform([b2EnterOp, b2ExitOp], (values) => {
    const [a, b] = values as [number, number];
    return a * b;
  });

  const b0Y = useTransform([b0EnterY, b0ExitY], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const b1Y = useTransform([b1EnterY, b1ExitY], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  const b2Y = useTransform([b2EnterY, b2ExitY], (values) => {
    const [a, b] = values as [number, number];
    return a + b;
  });

  return (
    <div className={styles.ethos}>
      <motion.div
        className={styles.kickerRow}
        style={{
          x: kickerX,
          y: topExitY,
          opacity: kickerOpFinal,
          filter: topExitBlur,
        }}
      >
        <span className={styles.kicker}>The Philosophy</span>
        <motion.div
          className={styles.kickerRule}
          style={{ scaleX: ruleScale, transformOrigin: 'left' }}
        />
      </motion.div>

      <motion.div
        className={styles.subBlock}
        style={{
          opacity: subOpFinal,
          y: subYFinal,
          filter: topExitBlur,
        }}
      >
        <p className={styles.sub}>
          Visual storytelling at its highest is invisible. The viewer doesn&apos;t notice the
          composition or the colour grade — they simply feel something they can&apos;t quite
          explain. That quiet effect is the work.
        </p>
        <a href="#services" className={styles.cta}>
          View Work <span className={styles.arrow}>→</span>
        </a>
      </motion.div>

      <motion.div
        className={styles.divider}
        style={{
          scaleX: divScaleFinal,
          transformOrigin: 'left',
          filter: topExitBlur,
        }}
      />

      <div className={styles.beliefs}>
        <motion.article
          className={styles.belief}
          style={{ opacity: b0Op, y: b0Y, filter: b0ExitBlur }}
        >
          <span className={styles.beliefNumber}>{beliefs[0].number}</span>
          <div className={styles.beliefLine} />
          <h3 className={styles.beliefHeadline}>{beliefs[0].headline}</h3>
          <p className={styles.beliefBody}>{beliefs[0].body}</p>
        </motion.article>

        <motion.article
          className={styles.belief}
          style={{ opacity: b1Op, y: b1Y, filter: b1ExitBlur }}
        >
          <span className={styles.beliefNumber}>{beliefs[1].number}</span>
          <div className={styles.beliefLine} />
          <h3 className={styles.beliefHeadline}>{beliefs[1].headline}</h3>
          <p className={styles.beliefBody}>{beliefs[1].body}</p>
        </motion.article>

        <motion.article
          className={styles.belief}
          style={{ opacity: b2Op, y: b2Y, filter: b2ExitBlur }}
        >
          <span className={styles.beliefNumber}>{beliefs[2].number}</span>
          <div className={styles.beliefLine} />
          <h3 className={styles.beliefHeadline}>{beliefs[2].headline}</h3>
          <p className={styles.beliefBody}>{beliefs[2].body}</p>
        </motion.article>
      </div>
    </div>
  );
}
