'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SideNav from '@/components/layout/side-nav';
import BottomNav from '@/components/layout/bottom-nav';
import { useAuth } from '@/contexts/auth-context';

const noNavRoutes = ['/login', '/signup'];

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const showNav = user && !noNavRoutes.includes(pathname);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex">
        {showNav && <SideNav />}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
