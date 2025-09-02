
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, QrCode, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarSeparator 
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/scan', label: 'Scan', icon: QrCode },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function SideNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <>
        <SidebarHeader>
             <Link
                href="/"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-all group-hover:scale-110"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M2 8h20"/><path d="M17 14h.01"/><path d="M12 14h.01"/><path d="M7 14h.01"/><path d="M18 18H6a2 2 0 0 1-2-2V8h16v8a2 2 0 0 1-2 2Z"/></svg>
                <span className="sr-only">ConvoTag Lite</span>
            </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
            <SidebarMenu>
                {navItems.map((item) => (
                     <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                             <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                                <item.icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2">
            <SidebarSeparator />
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
