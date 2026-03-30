'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!window.gtag) return;

        const url =
            pathname + (searchParams.toString() ? `?${searchParams}` : '');

        window.gtag('config', 'G-QDWKVV0NEW', {
            page_path: url,
        });
    }, [pathname, searchParams]);

    return null;
}