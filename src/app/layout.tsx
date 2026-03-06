import '@/styles/Global.scss';
import Site from '@/components/layout/Site';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="background-wrapper" aria-hidden="true" />
        <Site>{children}</Site>
      </body>
    </html>
  );
}
