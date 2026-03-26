'use client';  // Mark this file as a client-side component

import { usePathname } from 'next/navigation';  // This hook gives the current path
import { Geist, Geist_Mono } from "next/font/google";
import './styles.css'; // Make sure the styles are imported
import Link from 'next/link'; // Import Link component from Next.js

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }) {
    const pathname = usePathname();  // Get the current route (path)

    // Automatically determine the current page based on the URL path
    const page = pathname === '/' ? 'home' : pathname.split('/')[1]; // Default to 'home' for root

    return (
        <html lang="en">
            <body>
                <div>{children}</div>
                <footer>
                    <div className="social-links-container">
                        <Link href="https://www.youtube.com/@DecrepitFilth_art" target="_blank" rel="noopener noreferrer">
                            YouTube
                        </Link>
                        <Link href="https://www.instagram.com" target="_blank">
                            Instagram
                        </Link>
                        <Link href="https://www.linkedin.com/in/andrewrhale1/" target="_blank">
                            LinkedIn
                        </Link>
                    </div>
                    <p>&copy; 2024 Your Company. All Rights Reserved.</p>
                </footer>
            </body>
        </html>
    );
}
