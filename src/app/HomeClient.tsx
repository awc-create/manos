'use client';

import styles from './page.module.scss';

import Hero from '@/components/home/hero/Hero';
import Ethos from '@/components/home/ethos/Ethos';
import Services from '@/components/home/services/Service';
import Featured from '@/components/home/featured/Featured';
import VR360 from '@/components/home/vr360/VR360';
import Worldwide from '@/components/home/worldwide/Worldwide';
import Testimonials from '@/components/home/testimonials/Testimonials';
import Instagram from '@/components/home/instagram/Instagram';
import Contact from '@/components/home/contact/Contact';

export default function HomeClient() {
  return (
    <main className={styles.homeContainer}>
      <section id="hero">
        <Hero />
      </section>

      <section id="ethos">
        <Ethos />
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="featured-work">
        <Featured />
      </section>

      <section id="vr-360">
        <VR360 />
      </section>

      <section id="worldwide">
        <Worldwide />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="instagram">
        <Instagram />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
