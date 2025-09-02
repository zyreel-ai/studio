
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader } from '@/components/ui/sidebar';
import SideNav from './side-nav';
import BottomNav from './bottom-nav'; // Import BottomNav

const publicRoutes = ['/login', '/signup', '/', /^\/c\/[\w-]+$/];

const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(route => {
    if (typeof route === 'string') {
      return route === pathname;
    }
    return route.test(pathname);
  });
};

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isPublicRoute(pathname) || !user) {
    return <main>{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="md:flex">
        <Sidebar className="hidden md:block">
          <SideNav />
        </Sidebar>
        <main className="flex-1 pb-20 md:pb-0">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
