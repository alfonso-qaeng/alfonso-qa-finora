'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </AuthProvider>
  );
}
