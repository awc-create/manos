// src/components/navbar/floating-dial/FloatingDialNav.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { NAV_LINKS } from '@/config/menu.config';
import styles from './FloatingDialNav.module.scss';

function getShortLabel(label: string) {
  const cleaned = label.replace(/[^a-zA-Z0-9 ]/g, '').trim();

  if (!cleaned) return '•';

  const words = cleaned.split(/\s+/);

  if (words.length === 1) return cleaned.slice(0, 2).toUpperCase();

  return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase();
}

export default function FloatingDialNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const items = useMemo(() => NAV_LINKS, []);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeSection)
  );

  const stepAngle = 360 / items.length;
  const wheelRotation = -(activeIndex * stepAngle);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const handleNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    setActiveSection(sectionId);
    closeMenu();
  };

  useEffect(() => {
    const sections = NAV_LINKS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.35, 0.5, 0.7],
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={styles.floatingTrigger}
        onClick={openMenu}
        aria-label="Open section navigation"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerIcon}>◎</span>
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!isOpen}
        onClick={closeMenu}
      >
        <div
          className={`${styles.dialStage} ${isOpen ? styles.dialStageOpen : ''}`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Section navigation"
        >
          <div className={styles.pointer} />

          <div className={styles.dialShell}>
            <div className={styles.dialWheel} style={{ transform: `rotate(${wheelRotation}deg)` }}>
              {items.map((item, index) => {
                const angle = index * stepAngle - 90;
                const radius = 220;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isActive = item.id === activeSection;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.dialItem} ${isActive ? styles.activeItem : ''}`}
                    style={
                      {
                        '--x': `${x}px`,
                        '--y': `${y}px`,
                        '--item-rotation': `${-wheelRotation}deg`,
                      } as React.CSSProperties
                    }
                    onClick={() => handleNavigate(item.id)}
                    aria-label={`Go to ${item.label}`}
                    title={item.label}
                  >
                    <span
                      className={styles.itemContent}
                      style={{ transform: `rotate(${-wheelRotation}deg)` }}
                    >
                      <span className={styles.itemInner}>{getShortLabel(item.label)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.centerButton}
              onClick={closeMenu}
              aria-label="Close section navigation"
            >
              <span className={styles.centerLabel}>{items[activeIndex]?.label ?? 'Close'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
