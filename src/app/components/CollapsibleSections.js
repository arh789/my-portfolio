'use client';

import { useState } from 'react';
import { marked } from 'marked';
import styles from '../content-strategy/contentStrategy.module.css';

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
                                <img
                                    src={section.image}
                                    alt={section.title}
                                    className={styles.banner}
                                />
                            )}
                        </button>

                        <div
                            className={`${styles.content} ${isActive ? styles.active : styles.hidden
                                }`}
                        >
                            <div
                                className={styles['paragraph-section']}
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