'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { NAV_LINKS } from '@/config/menu.config';
import styles from './FloatingDialNav.module.scss';

export default function FloatingDialNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [dragAngle, setDragAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ angle: number; wheelAngle: number } | null>(null);

  const items = useMemo(() => NAV_LINKS, []);
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === activeSection)
  );
  const stepAngle = 360 / items.length;
  const baseRotation = -(activeIndex * stepAngle);
  const totalRotation = baseRotation + dragAngle;

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => {
    setIsOpen(false);
    setDragAngle(0);
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
    closeMenu();
  };

  // Pointer to angle helper
  const pointerAngle = (cx: number, cy: number, px: number, py: number) =>
    Math.atan2(py - cy, px - cx) * (180 / Math.PI);

  const getDialCenter = () => {
    if (!dialRef.current) return { cx: 0, cy: 0 };
    const rect = dialRef.current.getBoundingClientRect();
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  };

  // Mouse drag
  useEffect(() => {
    if (!isOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!dialRef.current?.contains(target)) return;
      if (target.closest('button')) return;
      const { cx, cy } = getDialCenter();
      dragStartRef.current = {
        angle: pointerAngle(cx, cy, e.clientX, e.clientY),
        wheelAngle: dragAngle,
      };
      setIsDragging(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const { cx, cy } = getDialCenter();
      const current = pointerAngle(cx, cy, e.clientX, e.clientY);
      const delta = current - dragStartRef.current.angle;
      setDragAngle(dragStartRef.current.wheelAngle + delta);
    };

    const onMouseUp = () => {
      dragStartRef.current = null;
      setIsDragging(false);
      // Snap to nearest item
      const snapped = Math.round(totalRotation / stepAngle) * stepAngle;
      const snappedIndex = (((-snapped / stepAngle) % items.length) + items.length) % items.length;
      setActiveSection(items[Math.round(snappedIndex) % items.length]?.id ?? activeSection);
      setDragAngle(0);
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isOpen, dragAngle, totalRotation, stepAngle, items, activeSection]);

  // Touch drag
  useEffect(() => {
    if (!isOpen) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const { cx, cy } = getDialCenter();
      dragStartRef.current = {
        angle: pointerAngle(cx, cy, touch.clientX, touch.clientY),
        wheelAngle: dragAngle,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const { cx, cy } = getDialCenter();
      const current = pointerAngle(cx, cy, touch.clientX, touch.clientY);
      const delta = current - dragStartRef.current.angle;
      setDragAngle(dragStartRef.current.wheelAngle + delta);
    };

    const onTouchEnd = () => {
      dragStartRef.current = null;
      const snapped = Math.round(totalRotation / stepAngle) * stepAngle;
      const snappedIndex = (((-snapped / stepAngle) % items.length) + items.length) % items.length;
      setActiveSection(items[Math.round(snappedIndex) % items.length]?.id ?? activeSection);
      setDragAngle(0);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen, dragAngle, totalRotation, stepAngle, items, activeSection]);

  // Escape key + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = (activeIndex + 1) % items.length;
        setActiveSection(items[next]!.id);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = (activeIndex - 1 + items.length) % items.length;
        setActiveSection(items[prev]!.id);
      }
      if (e.key === 'Enter') handleNavigate(activeSection);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, activeIndex, items, activeSection]);

  // Scroll spy
  useEffect(() => {
    const sections = NAV_LINKS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id);
      },
      { threshold: [0.35, 0.5, 0.7], rootMargin: '-20% 0px -20% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const activeItem = items[activeIndex];

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        className={styles.trigger}
        onClick={openMenu}
        aria-label="Open navigation"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerRing} />
        <span className={styles.triggerDot} />
        <span className={styles.triggerLabel}>{activeItem?.label?.slice(0, 2).toUpperCase()}</span>
      </button>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!isOpen}
        onClick={closeMenu}
      />

      {/* Dial panel */}
      <div
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Section navigation"
      >
        {/* Section label above dial */}
        <div className={styles.sectionLabel}>
          <span className={styles.sectionLabelText}>{activeItem?.label}</span>
          <span className={styles.sectionLabelHint}>drag to rotate · click to navigate</span>
        </div>

        {/* The dial */}
        <div ref={dialRef} className={`${styles.dial} ${isDragging ? styles.dialDragging : ''}`}>
          {/* Pointer notch */}
          <div className={styles.notch} />

          {/* Rotating wheel */}
          <div
            className={styles.wheel}
            style={{
              transform: `rotate(${totalRotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Nav items */}
            {items.map((item, index) => {
              const angle = index * stepAngle - 90;
              const radius = 118;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isActive = item.id === activeSection;
              const counterRotate = -totalRotation;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  onClick={() => handleNavigate(item.id)}
                  aria-label={`Go to ${item.label}`}
                >
                  <span
                    className={styles.itemLabel}
                    style={{ transform: `rotate(${counterRotate}deg)` }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center hub */}
          <button
            type="button"
            className={styles.hub}
            onClick={() => handleNavigate(activeSection)}
            aria-label={`Navigate to ${activeItem?.label}`}
          >
            <span className={styles.hubIcon}>↵</span>
            <span className={styles.hubLabel}>{activeItem?.label}</span>
          </button>
        </div>

        {/* Close */}
        <button type="button" className={styles.closeBtn} onClick={closeMenu} aria-label="Close">
          ESC
        </button>
      </div>
    </>
  );
}
