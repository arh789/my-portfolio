'use client';

import { useState } from 'react';
import { marked } from 'marked';
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

    return (
        <div className={styles.wrapper}>
            {sections.map((section, index) => {
                const isActive = activeIndex === index;

                return (
                    <div key={index} className={styles.section}>
                        <button
                            onClick={() => setActiveIndex(isActive ? null : index)}
                            className={styles.imageButton}
                        >
                            {section.image && (
                                <Image
                                    src={section.image}
                                    alt={section.title}
                                    className={styles.banner}
                                    width={877}
                                    height={155}
                                    sizes="(max-width: 768px) 100vw, 522px"
                                    loading="lazy"
                                />
                            )}
                        </button>

                        <div
                            className={`${styles.content} ${isActive ? styles.active : styles.hidden}`}
                        >
                            <div
                                className={`${styles['paragraph-section']} ${medieval.variable}`}
                                dangerouslySetInnerHTML={{
                                    __html: marked(section.markdown),
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}