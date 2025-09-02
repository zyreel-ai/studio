'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, QrCode, UserCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: '/', label: 'My Card', icon: Home },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/scan', label: 'Scan', icon: QrCode },
  { href: '/profile', label: 'Profile', icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-16 bg-card border-r transition-all">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-all group-hover:scale-110"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M2 8h20"/><path d="M17 14h.01"/><path d="M12 14h.01"/><path d="M7 14h.01"/><path d="M18 18H6a2 2 0 0 1-2-2V8h16v8a2 2 0 0 1-2 2Z"/></svg>
          <span className="sr-only">ConvoTag Lite</span>
        </Link>
        <TooltipProvider>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    isActive && 'bg-accent text-accent-foreground hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
