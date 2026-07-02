// src/app/admin/login/page.tsx
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#fff' }}>Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
