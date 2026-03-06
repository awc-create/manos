// src/config/menu.config.ts

export type NavLink = {
  id: string; // matches <section id="...">
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { id: 'hero', label: 'Home' },
  { id: 'ethos', label: 'Ethos' },
  { id: 'services', label: 'Services' },
  { id: 'featured-work', label: 'Work' },
  { id: 'vr-360', label: '360° VR' },
  { id: 'worldwide', label: 'Worldwide' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
  { id: 'instagram', label: 'Instagram' },
];
