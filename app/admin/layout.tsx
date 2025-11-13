"use client";

import type { ReactNode } from 'react';
import NavigationShell from '../components/NavigationShell';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  return <NavigationShell>{children}</NavigationShell>;
}
