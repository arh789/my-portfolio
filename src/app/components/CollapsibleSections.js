'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MedievalSharp } from 'next/font/google';
import styles from '../datamining-llm/datamining-a-llm.module.css';

const medieval = MedievalSharp({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-medieval',
});

export default function CollapsibleSections({ sections }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const contentRefs = useRef([]);

    useEffect(() => {
        if (activeIndex === null) return undefined;

        const frame = requestAnimationFrame(() => {
            contentRefs.current[activeIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [activeIndex]);

    return (
        <div className={styles.wrapper}>
            {sections.map((section, index) => {
                const isActive = activeIndex === index;

                return (
                    <div key={index} className={styles.section}>
                        <button
                            onClick={() => setActiveIndex(isActive ? null : index)}
                            className={styles.imageButton}
                            aria-expanded={isActive}
                        >
                            {section.image && (
                                <Image
                                    src={section.image}
                                    alt={section.title}
                                    className={styles.banner}
                                    width={877}
                                    height={155}
                                    sizes="(max-width: 768px) 75vw, 469px"
                                    loading="lazy"
                                />
                            )}
                        </button>

                        <div
                            className={`${styles.content} ${isActive ? styles.active : styles.hidden}`}
                        >
                            <div
                                ref={(element) => {
                                    contentRefs.current[index] = element;
                                }}
                                className={`${styles['paragraph-section']} ${medieval.variable}`}
                                dangerouslySetInnerHTML={{
                                    __html: section.html,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
