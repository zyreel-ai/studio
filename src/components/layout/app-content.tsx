
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SideNav from '@/components/layout/side-nav';
import BottomNav from '@/components/layout/bottom-nav';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

const noNavRoutes = ['/login', '/signup', '/'];
const publicRoutes = ['/login', '/signup', '/', /^\/c\/[\w-]+$/];


const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(route => {
    if (typeof route === 'string') {
      return route === pathname;
    }
    return route.test(pathname);
  });
}

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const showNav = user && !isPublicRoute(pathname);

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }
  
  if (isPublicRoute(pathname)) {
      return <main>{children}</main>;
  }

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
