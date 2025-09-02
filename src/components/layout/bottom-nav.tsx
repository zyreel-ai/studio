
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, QrCode, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/scan', label: 'Scan', icon: QrCode },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-t-lg z-50">
      <div className="grid h-16 grid-cols-4 items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground"
          >
            <item.icon
              className={cn(
                'h-6 w-6',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
