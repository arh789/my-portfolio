'use client'

import { useState, useEffect } from 'react'
import styles from '../content-strategy/contentStrategy.module.css'
import { parseMarkdown } from './markdown.js'

export default function CollapsibleSections({ sections }) {
    const [active, setActive] = useState(null)
    const [parsedSections, setParsedSections] = useState([])

    useEffect(() => {
        async function parseAll() {
            const htmlSections = await Promise.all(
                sections.map(async (section) => {
                    const html = await parseMarkdown(section.markdown)
                    return { ...section, html }
                })
            )
            setParsedSections(htmlSections)
        }

        parseAll()
    }, [sections])

    return (
        <div className={styles.wrapper}>
            {parsedSections.map(({ title, image, html }, index) => (
                <section key={index} className={styles.section}>
                    <button
                        onClick={() => setActive(index === active ? null : index)}
                        aria-expanded={index === active}
                        className={styles.imageButton}
                    >
                        <img src={image} alt={title} className={styles.banner} />
                    </button>
                    <div
                        className={`${styles.content} ${index === active ? styles.active : styles.hidden
                            }`}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </section>
            ))}
        </div>
    )
}
