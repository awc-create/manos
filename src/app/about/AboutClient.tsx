'use client';

import { useEffect, useState } from 'react';
import styles from './About.module.scss';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import developerAnim from '../../assets/lottie/developer.json';

type AboutData = {
  title: string;
  description: string;
  bullets: string[];
};

const DEFAULTS: AboutData = {
  title: 'About Us',
  description: "We're a team of passionate developers turning ideas into reality.",
  bullets: ['🚀 Fast & scalable', '🎨 Design-driven', '🤝 Client-focused'],
};

export default function AboutClient() {
  const [data, setData] = useState<AboutData>(DEFAULTS);

  useEffect(() => {
    fetch('/api/about', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d)
          setData({
            ...DEFAULTS,
            ...d,
            bullets: Array.isArray(d.bullets) ? d.bullets : DEFAULTS.bullets,
          });
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <ul>
          {data.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      <div className={styles.right}>
        <Lottie animationData={developerAnim} loop autoplay style={{ height: 300 }} />
      </div>
    </div>
  );
}
