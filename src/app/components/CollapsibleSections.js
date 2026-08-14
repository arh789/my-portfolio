'use client';

import { useState } from 'react';
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
    const activeSection = activeIndex === null ? null : sections[activeIndex];

    return (
        <div className={styles.wrapper}>
            <div className={styles.menuContainer}>
                {sections.map((section, index) => {
                    const isActive = activeIndex === index;

                    return (
                        <button
                            key={index}
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
                    );
                })}
            </div>

            <div
                className={`${styles.content} ${activeSection ? styles.active : styles.hidden}`}
            >
                {activeSection && (
                    <div
                        className={`${styles['paragraph-section']} ${medieval.variable}`}
                        dangerouslySetInnerHTML={{
                            __html: activeSection.html,
                        }}
                    />
                )}
            </div>
        </div>
    );
}