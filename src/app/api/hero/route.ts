// src/app/api/hero/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/apiAuth';
import { getSiteConfig, setSiteConfig } from '@/lib/siteConfig';

export type HeroConfig = {
  kicker: string;
  role: string;
  services: string[];
};

const DEFAULTS: HeroConfig = {
  kicker: 'Visual Storytelling',
  role: 'Photographer / Videographer',
  services: ['Photography', 'Video', '360 VR', 'Digital Content'],
};

export async function GET() {
  const data = await getSiteConfig<HeroConfig>('hero', DEFAULTS);
  return NextResponse.json({ ...DEFAULTS, ...data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = (await req.json()) as Partial<HeroConfig>;

  const updated: HeroConfig = {
    kicker: body.kicker ?? DEFAULTS.kicker,
    role: body.role ?? DEFAULTS.role,
    services:
      Array.isArray(body.services) && body.services.length > 0 ? body.services : DEFAULTS.services,
  };

  await setSiteConfig('hero', updated);
  return NextResponse.json({ ok: true });
}
