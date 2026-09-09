'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './CollapsibleSections.module.css';
import proseStyles from './MarkdownContent.module.css';

export default function CollapsibleSections({ sections }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const contentRefs = useRef([]);
    const accordionId = useId();

    useEffect(() => {
        if (activeIndex === null) return undefined;

        const frame = requestAnimationFrame(() => {
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

            contentRefs.current[activeIndex]?.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [activeIndex]);

    return (
        <div className={styles.wrapper}>
            {sections.map((section, index) => {
                const isActive = activeIndex === index;
                const buttonId = `${accordionId}-button-${index}`;
                const panelId = `${accordionId}-panel-${index}`;

                return (
                    <section key={section.title} className={styles.section}>
                        <h2 className={styles.sectionHeading}>
                            <button
                                id={buttonId}
                                type="button"
                                onClick={() => setActiveIndex(isActive ? null : index)}
                                className={styles.imageButton}
                                aria-controls={panelId}
                                aria-expanded={isActive}
                            >
                                {section.image && (
                                    <Image
                                        src={section.image}
                                        alt=""
                                        className={styles.banner}
                                        width={877}
                                        height={155}
                                        sizes="(max-width: 768px) calc(100vw - 3rem), 469px"
                                        loading="lazy"
                                    />
                                )}
                                <span className={styles.titleRow}>
                                    <span>{section.title}</span>
                                    <span className={styles.indicator} aria-hidden="true">
                                        {isActive ? '\u2212' : '+'}
                                    </span>
                                </span>
                            </button>
                        </h2>

                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isActive}
                            className={styles.panel}
                            ref={(element) => {
                                contentRefs.current[index] = element;
                            }}
                        >
                            <div
                                className={proseStyles.prose}
                                dangerouslySetInnerHTML={{
                                    __html: section.html,
                                }}
                            />
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
