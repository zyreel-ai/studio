
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader } from '@/components/ui/sidebar';
import SideNav from './side-nav';

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
      <Sidebar>
        <SideNav />
      </Sidebar>
      <SidebarInset>
         <SidebarHeader className="border-b">
           <SidebarTrigger />
         </SidebarHeader>
         <main className="p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
