import { Geist, Geist_Mono, MedievalSharp } from "next/font/google";
import "./styles.css";
import Link from "next/link";
import PageWrapper from "./PageWrapper";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const medieval = MedievalSharp({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

export const metadata = {
    metadataBase: new URL("https://decrepitfilth.art"),
    title: "Andrew Hale - DecrepitFilth",
    description: "Portfolio, blog, and experimental work exploring procedural systems, art, and algorithmic structure.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>

                {/* PAGE CONTENT */}
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <PageWrapper>
                        <div style={{ flex: 1 }}>{children}</div>
                    </PageWrapper>

                    <footer>
                        <div className="social-links-container">
                            <Link href="https://www.youtube.com/@DecrepitFilth_art" target="_blank" rel="noopener noreferrer">
                                YouTube
                            </Link>
                            <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </Link>
                            <Link href="https://www.linkedin.com/in/andrewrhale1/" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </Link>
                            <Link href="https://github.com/arh789/" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </Link>
                        </div>
                        <p>&copy; 2026 Andrew Hale. All Rights Reserved.</p>
                    </footer>
                </div>

                {/* STRUCTURED DATA */}
                <Script
                    id="structured-data"
                    type="application/ld+json"
                    strategy="afterInteractive"
                >
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Andrew Hale",
                        "url": "https://decrepitfilth.art",
                        "sameAs": [
                            "https://github.com/arh789",
                            "https://www.linkedin.com/in/andrewrhale1/",
                            "https://www.youtube.com/@DecrepitFilth_art"
                        ]
                    })}
                </Script>

                {/* GOOGLE ANALYTICS (deferred properly) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-QDWKVV0NEW"
                    strategy="lazyOnload"
                />

                <Script id="ga-script" strategy="lazyOnload">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        window.gtag = gtag;

                        gtag('js', new Date());
                        gtag('config', 'G-QDWKVV0NEW', {
                            page_path: window.location.pathname,
                        });
                    `}
                </Script>

            </body>
        </html>
    );
}