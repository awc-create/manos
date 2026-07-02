// src/app/HomeClient.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  animate,
  LayoutGroup,
} from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.scss';

import Hero, { type HeroConfig } from '@/components/home/hero/Hero';
import Ethos from '@/components/home/ethos/Ethos';
import Services from '@/components/home/services/Services';
import Featured from '@/components/home/featured/Featured';
import VR360 from '@/components/home/vr360/VR360';
import Worldwide from '@/components/home/worldwide/Worldwide';
import Testimonials from '@/components/home/testimonials/Testimonials';
import Instagram from '@/components/home/instagram/Instagram';
import Contact from '@/components/home/contact/Contact';

const cards = [
  {
    id: 1,
    type: 'image',
    src: '/assets/hero/hero-1.jpg',
    alt: 'Landscape photography',
    priority: true,
  },
  {
    id: 2,
    type: 'video',
    src: '/assets/hero/hero-2.mp4',
    alt: '',
    priority: false,
  },
  {
    id: 3,
    type: 'video',
    src: '/assets/hero/hero-3.mp4',
    alt: '',
    priority: false,
  },
  {
    id: 4,
    type: 'image',
    src: '/assets/hero/hero-4.avif',
    alt: 'Digital content creation',
    priority: false,
  },
] as const;

const staggerStart = [0, 34, 0, 34];
const TOTAL = 8; // 0 hero, 1 ethos, 2 services list, 3-6 detail, 7 featured
const FEATURED_STOP = 7;

// Snappier duration — 1.1s was too long for trackpad inertia to catch up
const T = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1] as const,
};

function useScrollHijack(
  driverRef: React.RefObject<HTMLDivElement | null>,
  indexMV: ReturnType<typeof useMotionValue<number>>,
  getExpanded: () => boolean,
  featuredStop: number,
  onExitToFlow: () => void
) {
  useEffect(() => {
    const el = driverRef.current;
    if (!el) return;

    const driver = el;
    let cur = Math.round(indexMV.get());
    let busy = false;
    let wheelAccum = 0;
    const THRESH = 60;
    let touchY0 = 0;

    // Cache active state via IntersectionObserver — avoids a
    // getBoundingClientRect layout-reflow on every single wheel event.
    let isActive = false;
    // Once the user exits to the flow section, stop capturing wheel events
    // entirely until the driver leaves the viewport (IntersectionObserver resets it).
    let captureDisabled = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        isActive = entry.isIntersecting;
        // Reset capture-disabled when driver fully leaves the viewport
        // so scroll-back works naturally.
        if (!entry.isIntersecting) captureDisabled = false;
      },
      { threshold: 0.01 }
    );
    io.observe(driver);

    const unsubscribe = indexMV.on('change', (v) => {
      cur = Math.round(v);
    });

    function go(dir: 1 | -1) {
      if (busy) return;

      let next = cur + dir;

      if (!getExpanded()) {
        if (dir === 1 && next >= 3 && next <= 6) next = 7;
        if (dir === -1 && next >= 3 && next <= 6) next = 2;
      }

      if (next < 0 || next >= TOTAL) return;

      cur = next;
      busy = true;
      wheelAccum = 0;

      animate(indexMV, cur, {
        ...T,
        onComplete: () => {
          busy = false;
          // Clear accumulated inertia so trackpad momentum
          // doesn't immediately trigger the next section.
          wheelAccum = 0;
        },
      });
    }

    const onWheel = (e: WheelEvent) => {
      if (!isActive || captureDisabled) return;

      if (cur >= featuredStop && e.deltaY > 0) {
        // Hand off to natural scroll — disable hijack so the
        // smooth scrollIntoView runs without interference.
        captureDisabled = true;
        onExitToFlow();
        wheelAccum = 0;
        return;
      }

      e.preventDefault();

      // While animating, drop incoming events instead of letting
      // them stack up and fire a burst when busy clears.
      if (busy) {
        wheelAccum = 0;
        return;
      }

      wheelAccum += e.deltaY;

      if (wheelAccum > THRESH) go(1);
      else if (wheelAccum < -THRESH) go(-1);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isActive && !captureDisabled) touchY0 = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isActive || captureDisabled) return;
      const delta = touchY0 - e.touches[0].clientY;
      if (cur >= featuredStop && delta > 0) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isActive || captureDisabled) return;
      const d = touchY0 - e.changedTouches[0].clientY;
      if (cur >= featuredStop && d > 0) {
        captureDisabled = true;
        onExitToFlow();
        return;
      }
      if (Math.abs(d) > 40) go(d > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isActive || captureDisabled) return;

      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && cur >= featuredStop) {
        captureDisabled = true;
        onExitToFlow();
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        go(1);
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        go(-1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      io.disconnect();
      unsubscribe();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [driverRef, indexMV, getExpanded, featuredStop, onExitToFlow]);
}

export default function HomeClient() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const postFeaturedRef = useRef<HTMLElement>(null);
  const scenePanelRef = useRef<HTMLDivElement>(null);

  const [heroConfig, setHeroConfig] = useState<HeroConfig | undefined>(undefined);

  useEffect(() => {
    fetch('/api/hero', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setHeroConfig(data as HeroConfig);
      })
      .catch(() => {});
  }, []);

  const index = useMotionValue(0);
  const [expanded, setExpanded] = useState(false);
  const getExpanded = useCallback(() => expanded, [expanded]);

  // Defined before useScrollHijack so it can be passed as a stable callback.
  const handleFeaturedContinue = useCallback(() => {
    postFeaturedRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  useScrollHijack(wrapperRef, index, getExpanded, FEATURED_STOP, handleFeaturedContinue);

  const p = useTransform(index, [0, 1], [0, 1]);
  const pC = useTransform(p, (v) => Math.min(1, Math.max(0, v)));

  const heroTitleOp = useTransform(pC, [0, 0.46], [1, 0]);
  const ethosTitleOp = useTransform(pC, [0.38, 1], [0, 1]);
  const titleX = useTransform(pC, [0, 1], ['0%', '-25%']);
  const titleScale = useTransform(pC, [0, 1], [1, 0.68]);

  const s0 = useTransform(pC, [0, 0.8], [staggerStart[0], 0]);
  const s1 = useTransform(pC, [0, 0.8], [staggerStart[1], 0]);
  const s2 = useTransform(pC, [0, 0.8], [staggerStart[2], 0]);
  const s3 = useTransform(pC, [0, 0.8], [staggerStart[3], 0]);
  const staggers = [s0, s1, s2, s3];

  const cardsY = useTransform(pC, [0, 1], ['0px', '-32px']);
  const cardsScale = useTransform(pC, [0, 1], [1, 0.78]);
  // cardRadius: compositor-safe (no layout reflow)
  const cardRadius = useTransform(pC, [0, 1], ['20px', '6px']);
  // cardPad (paddingBottom) and cardsGap both trigger layout reflow every frame —
  // removed. Aspect ratio and gap are now fixed in CSS.

  const bridgeP = useTransform(index, [1.28, 1.78], [0, 1]);
  const cardsExitOp = useTransform(index, [1.2, 1.72], [1, 0]);

  const servicesOpRaw = useTransform(index, [1.48, 1.95, 6, 6.5], [0, 1, 1, 0]);
  const servicesOp = useTransform(servicesOpRaw, (v) => Math.max(0, Math.min(1, v)));

  const featuredOpRaw = useTransform(index, [6.72, 7.08, 7.45], [0, 1, 0]);
  const featuredOp = useTransform(featuredOpRaw, (v) => Math.max(0, Math.min(1, v)));

  const serviceIndex = useTransform(index, [2, 3, 4, 5, 6], [-1, 0, 1, 2, 3]);

  // Fade out the original hero/ethos/title/cards layer before the panel layer fully takes over
  const baseStageOpacity = useTransform(index, [1.55, 1.95], [1, 0]);

  // Fade in the panel layer as Services begins taking over
  const panelLayerOpacity = useTransform(index, [1.45, 1.85], [0, 1]);

  useMotionValueEvent(servicesOp, 'change', (v) => {
    if (!scenePanelRef.current) return;
    const featV = featuredOp.get();
    scenePanelRef.current.style.pointerEvents = v > 0.05 || featV > 0.05 ? 'auto' : 'none';
  });

  useMotionValueEvent(featuredOp, 'change', (v) => {
    if (!scenePanelRef.current) return;
    const svcV = servicesOp.get();
    scenePanelRef.current.style.pointerEvents = v > 0.05 || svcV > 0.05 ? 'auto' : 'none';
  });

  const handleServiceClick = useCallback(
    (serviceIdx: number) => {
      setExpanded(true);
      animate(index, serviceIdx + 3, T);
    },
    [index]
  );

  const handleBackToList = useCallback(() => {
    setExpanded(false);
    animate(index, 2, T);
  }, [index]);

  return (
    <>
      <main className={styles.main}>
        <div ref={wrapperRef} className={styles.driver}>
          <div className={styles.sticky}>
            <div className={styles.stage}>
              <motion.div
                style={{
                  opacity: baseStageOpacity,
                  pointerEvents: 'none',
                }}
              >
                <Hero progress={pC} slot="top" config={heroConfig} />

                <motion.div className={styles.titleWrap} style={{ x: titleX, scale: titleScale }}>
                  <motion.h1 className={styles.heroTitle} style={{ opacity: heroTitleOp }}>
                    Everything Visual
                  </motion.h1>

                  <motion.h2 className={styles.ethosTitle} style={{ opacity: ethosTitleOp }}>
                    Every frame is a <em className={styles.ethosEm}>decision.</em>
                    <br />
                    Not an accident.
                  </motion.h2>
                </motion.div>

                <motion.div
                  className={styles.cards}
                  style={{
                    y: cardsY,
                    scale: cardsScale,
                    opacity: cardsExitOp,
                  }}
                >
                  {cards.map((card, i) => (
                    <motion.div
                      key={card.id}
                      className={styles.card}
                      style={{ y: staggers[i], borderRadius: cardRadius }}
                    >
                      <motion.div className={styles.cardInner}>
                        <div className={styles.cardMedia}>
                          {card.type === 'video' ? (
                            <video autoPlay muted loop playsInline preload="auto">
                              <source src={card.src} type="video/mp4" />
                            </video>
                          ) : (
                            <Image
                              src={card.src}
                              alt={card.alt}
                              fill
                              priority={card.priority}
                              sizes="(max-width: 600px) 100vw, 25vw"
                            />
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className={styles.bottomZone}>
                  <Hero progress={pC} slot="bottom" config={heroConfig} />
                  <Ethos progress={pC} exitProgress={bridgeP} />
                </div>
              </motion.div>

              <motion.div
                ref={scenePanelRef}
                className={styles.panelSlot}
                style={{
                  pointerEvents: 'none',
                  opacity: panelLayerOpacity,
                }}
              >
                <LayoutGroup id="services-featured-transition">
                  <Services
                    progress={servicesOp}
                    serviceIndex={serviceIndex}
                    expanded={expanded}
                    onGoToService={handleServiceClick}
                    onBackToList={handleBackToList}
                    onExitToFeatured={() => {
                      setExpanded(false);
                      animate(index, 7, T);
                    }}
                  />

                  <Featured progress={featuredOp} onContinue={handleFeaturedContinue} />
                </LayoutGroup>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <section ref={postFeaturedRef} className={styles.flowSection}>
        <div className={styles.flowStack}>
          <VR360 />
          <Worldwide />
          <Testimonials />
          <Instagram />
          <Contact />
        </div>
      </section>
    </>
  );
}
