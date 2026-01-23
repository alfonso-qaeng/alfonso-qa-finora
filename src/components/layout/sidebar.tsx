'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Target,
  RefreshCw,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  Wallet,
} from 'lucide-react';

const SIDEBAR_COLLAPSED_KEY = 'finora-sidebar-collapsed';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Transacciones',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    title: 'Deudas',
    href: '/debts',
    icon: CreditCard,
  },
  {
    title: 'Metas',
    href: '/goals',
    icon: Target,
  },
  {
    title: 'Suscripciones',
    href: '/subscriptions',
    icon: RefreshCw,
  },
  {
    title: 'Perfil',
    href: '/profile',
    icon: User,
  },
];

interface SidebarProps {
  className?: string;
}

function NavItemLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function SidebarContent({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 items-center border-b px-4',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <span className="text-lg font-bold text-foreground">Finora</span>}
        </Link>
        {onToggle && !isCollapsed && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(item => (
          <NavItemLink
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Collapse button (only when collapsed) */}
      {onToggle && isCollapsed && (
        <div className="border-t p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggle} className="w-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expandir menú</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState));
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <aside className={cn('hidden h-screen w-64 shrink-0 border-r bg-card lg:block', className)} />
    );
  }

  return (
    <aside
      className={cn(
        'hidden h-screen shrink-0 border-r bg-card transition-all duration-200 lg:block',
        isCollapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} onToggle={handleToggle} />
    </aside>
  );
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent isCollapsed={false} />
      </SheetContent>
    </Sheet>
  );
}
