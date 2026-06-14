"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    {
        href: "/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content",
        label: "Discovering Hidden Structure",
    },
    { href: "/workflow-structure-breakdown", label: "Workflow Breakdown" },
    { href: "/code", label: "Semantic SEO Code" },
    { href: "/datamining-llm", label: "Datamining a LLM" },
    { href: "/content-strategy", label: "Content Strategy" },
    { href: "/art", label: "Blog" },
    { href: "/contact", label: "Contact" },
];

export default function SiteIndexNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isTriggerVisible, setIsTriggerVisible] = useState(true);
    const lastScrollYRef = useRef(0);
    const isHomePage = pathname === "/";

    useEffect(() => {
        lastScrollYRef.current = window.scrollY;

        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (isOpen) {
                setIsTriggerVisible(true);
                lastScrollYRef.current = currentScrollY;
                return;
            }

            if (currentScrollY <= 24) {
                setIsTriggerVisible(true);
            } else if (currentScrollY > lastScrollYRef.current) {
                setIsTriggerVisible(false);
            } else if (currentScrollY < lastScrollYRef.current) {
                setIsTriggerVisible(true);
            }

            lastScrollYRef.current = currentScrollY;
        }

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen]);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle("site-index-nav-open", isOpen);

        return () => {
            document.body.classList.remove("site-index-nav-open");
        };
    }, [isOpen]);

    useEffect(() => {
        document.body.classList.toggle("has-site-index-nav", !isHomePage);

        return () => {
            document.body.classList.remove("has-site-index-nav");
        };
    }, [isHomePage]);

    const showTrigger = isOpen || isTriggerVisible;

    if (isHomePage) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                className={`site-index-nav-trigger${showTrigger ? " is-visible" : ""}`}
                aria-label="Open site index navigation"
                aria-expanded={isOpen}
                aria-controls="site-index-nav-drawer"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src="/images/nav-icons-banner.webp"
                    alt=""
                    width={2048}
                    height={276}
                    sizes="(max-width: 768px) 90vw, 960px"
                    priority
                />
            </button>

            <div
                className={`site-index-nav-backdrop${isOpen ? " is-open" : ""}`}
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            />

            <aside
                id="site-index-nav-drawer"
                className={`site-index-nav-drawer${isOpen ? " is-open" : ""}`}
                aria-hidden={!isOpen}
            >
                <div className="site-index-nav-drawer__header">
                    <p className="site-index-nav-drawer__eyebrow">Site Index</p>
                    <button
                        type="button"
                        className="site-index-nav-drawer__close"
                        aria-label="Close site index navigation"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </button>
                </div>

                <nav className="site-index-nav-drawer__nav" aria-label="Site">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="site-index-nav-drawer__link"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
