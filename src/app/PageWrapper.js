'use client';

import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const page = pathname === '/' ? 'home' : pathname.split('/')[1];

  return <div className={page}>{children}</div>;
}