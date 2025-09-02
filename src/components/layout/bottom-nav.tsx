'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, QrCode, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  { href: '/', label: 'My Card', icon: Home },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/scan', label: 'Scan', icon: QrCode },
  { href: '/profile', label: 'Profile', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t h-16 z-50">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group"
            >
              <item.icon
                className={cn(
                  'w-6 h-6 mb-1 text-muted-foreground group-hover:text-foreground',
                  isActive && 'text-accent'
                )}
              />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group"
        >
            <LogOut className="w-6 h-6 mb-1 text-muted-foreground group-hover:text-destructive" />
            <span className="sr-only">Logout</span>
        </button>
      </div>
    </nav>
  );
}
