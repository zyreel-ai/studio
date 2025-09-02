import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import SideNav from '@/components/layout/side-nav';
import BottomNav from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'ConvoTag Lite',
  description: 'Your Digital Business Card Companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex">
            <SideNav />
            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
          </div>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
