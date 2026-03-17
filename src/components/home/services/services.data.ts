export const SERVICES = [
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

export type ServiceItem = (typeof SERVICES)[number];
