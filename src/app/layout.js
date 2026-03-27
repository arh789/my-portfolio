import { Geist, Geist_Mono } from "next/font/google";
import "./styles.css";
import Link from "next/link";
import PageWrapper from "./PageWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "My Portfolio",
    description: "My personal website",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
                style={{ margin: 0 }}
            >
                {/* GLOBAL BLUR OVERLAY */}
                <div
                    suppressHydrationWarning
                    style={{
                        position: "fixed",
                        inset: 0,
                        backdropFilter: "blur(6px)",
                        background: "rgba(0, 0, 0, 0.22)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                {/* PAGE CONTENT */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
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
                            <Link
                                href="https://www.youtube.com/@DecrepitFilth_art"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube
                            </Link>
                            <Link
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/andrewrhale1/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </Link>
                        </div>
                        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
                    </footer>
                </div>
            </body>
        </html>
    );
}