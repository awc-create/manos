// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

type AdminRole = 'HEAD' | 'ADMIN' | 'STAFF';

const ADMIN_ROLES = new Set<string>(['HEAD', 'ADMIN', 'STAFF']);

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        const email = creds?.email?.toLowerCase?.();
        const password = creds?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            image: true,
          },
        });

        if (!user?.password) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        // Only allow HEAD / ADMIN / STAFF to sign in via this route
        if (!ADMIN_ROLES.has(user.role)) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role as AdminRole,
          image: user.image ?? null,
        };
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: AdminRole }).role;
        token.picture = (user as { image?: string | null }).image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = (token.role as AdminRole) ?? 'CLIENT';
      session.user.image = (token.picture as string | null) ?? session.user.image ?? null;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
