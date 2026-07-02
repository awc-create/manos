// src/app/api/about/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/apiAuth';
import { getSiteConfig, setSiteConfig } from '@/lib/siteConfig';

type AboutConfig = {
  title: string;
  description: string;
  bullets: string[];
};

const DEFAULTS: AboutConfig = {
  title: 'About Us',
  description: "We're a team of passionate developers turning ideas into reality.",
  bullets: ['🚀 Fast & scalable', '🎨 Design-driven', '🤝 Client-focused'],
};

export async function GET() {
  const data = await getSiteConfig<AboutConfig>('about', DEFAULTS);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = (await req.json()) as Partial<AboutConfig>;

  const updated: AboutConfig = {
    title: body.title ?? DEFAULTS.title,
    description: body.description ?? DEFAULTS.description,
    bullets: Array.isArray(body.bullets) ? body.bullets : DEFAULTS.bullets,
  };

  await setSiteConfig('about', updated);
  return NextResponse.json({ ok: true });
}
