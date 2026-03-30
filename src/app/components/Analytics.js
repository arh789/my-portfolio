'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Analytics() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined' || !window.gtag) return;

        window.gtag('config', 'G-QDWKVV0NEW', {
            page_path: pathname,
        });
    }, [pathname]);

    return null;
}