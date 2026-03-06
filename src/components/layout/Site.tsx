'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/footer/Footer';
import FloatingDialNav from '@/components/navbar/floating-dial/FloatingDialNav';

export default function Site({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname === '/coming-soon' || pathname.startsWith('/coming-soon');

  return (
    <div className="page-shell">
      {!hideLayout && <FloatingDialNav />}

      <main>{children}</main>

      {!hideLayout && <Footer />}
    </div>
  );
}
