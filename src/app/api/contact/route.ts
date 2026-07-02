// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/apiAuth';
import { getSiteConfig, setSiteConfig } from '@/lib/siteConfig';

export type ContactConfig = {
  eyebrow: string;
  headline: string;
  sub: string;
  email: string;
  phone: string;
  location: string;
  successHeadline: string;
  successBody: string;
};

const DEFAULTS: ContactConfig = {
  eyebrow: 'READY?',
  headline: "Let's bring your vision to life.",
  sub: 'Reach out to start your custom project today. Every enquiry receives a response within 24 hours.',
  email: 'hello@everythingvisual.co.uk',
  phone: '+44 7700 000 000',
  location: 'UK · Europe · International',
  successHeadline: 'Message received.',
  successBody:
    "We'll be in touch within 24 hours. Looking forward to hearing more about your project.",
};

export async function GET() {
  const data = await getSiteConfig<ContactConfig>('contact', DEFAULTS);
  return NextResponse.json({ ...DEFAULTS, ...data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = (await req.json()) as Partial<ContactConfig>;

  const updated: ContactConfig = {
    eyebrow: body.eyebrow ?? DEFAULTS.eyebrow,
    headline: body.headline ?? DEFAULTS.headline,
    sub: body.sub ?? DEFAULTS.sub,
    email: body.email ?? DEFAULTS.email,
    phone: body.phone ?? DEFAULTS.phone,
    location: body.location ?? DEFAULTS.location,
    successHeadline: body.successHeadline ?? DEFAULTS.successHeadline,
    successBody: body.successBody ?? DEFAULTS.successBody,
  };

  await setSiteConfig('contact', updated);
  return NextResponse.json({ ok: true });
}
