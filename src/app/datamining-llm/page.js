import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { MedievalSharp } from 'next/font/google'
import CollapsibleSections from '../components/CollapsibleSections.js'
import styles from './datamining-a-llm.module.css'

/* LOAD FONT (page-specific) */
const medieval = MedievalSharp({
    subsets: ['latin'],
    weight: '400',
})

export const metadata = {
    title: 'Content Strategy | Recursive Systems & Symbolic Mapping',
    description: 'Exploration of symbolic compression, emergent mapping, and recursive content structures.',
}

const sectionDefs = [
    {
        file: '00_INTRODUCTION.md',
        title: 'Synopsis & Execution Plan',
        image: '/images/datamining_a_llm_menu_images/00_INTRODUCTION.jpg',
    },
    {
        file: '01_EMERGENT_STRUCTURAL_MAPPING_DOCTRINE.md',
        title: 'Defining a Niche',
        image: '/images/datamining_a_llm_menu_images/01_EMERGENT_STRUCTURAL_MAPPING_DOCTRINE.jpg',
    },
    {
        file: '02_METHODOLOGY_PIPELINE.md',
        title: 'Specialised Niche Directions',
        image: '/images/datamining_a_llm_menu_images/02_METHODOLOGY_PIPELINE.jpg',
    },
    {
        file: '03_SYMBOLIC_ENGINE_SCHEMA.md',
        title: 'Core Artistic Themes',
        image: '/images/datamining_a_llm_menu_images/03_SYMBOLIC_ENGINE_SCHEMA.jpg',
    },
    {
        file: '04_IMPLEMENTATION_EXAMPLE.md',
        title: 'The Truth-Teller Perceived as a Fool',
        image: '/images/datamining_a_llm_menu_images/04_IMPLEMENTATION_EXAMPLE.jpg',
    },
    {
        file: '05_SEM_EXECUTION_SYSTEM.md',
        title: 'Role of the Clown',
        image: '/images/datamining_a_llm_menu_images/05_SEM_EXECUTION_SYSTEM.jpg',
    },
    {
        file: '06_FULL_THREAD_ARCHIVE_REFERENCE.md',
        title: 'Role of the Seer',
        image: '/images/datamining_a_llm_menu_images/06_FULL_THREAD_ARCHIVE_REFERENCE.jpg',
    },
    {
        file: '07_FINAL_CONCLUSION_AND_NEXT_STEPS.md',
        title: 'Video Production Approach',
        image: '/images/datamining_a_llm_menu_images/07_FINAL_CONCLUSION_AND_NEXT_STEPS.jpg',
    },
]

export default function Page() {
    const baseDir = path.join(process.cwd(), 'src/app/datamining-llm')

    const sections = sectionDefs.map(({ file, title, image }) => {
        const content = fs.readFileSync(path.join(baseDir, file), 'utf8')
        return {
            title,
            image,
            markdown: content,
        }
    })

    return (
        <div className={styles.container}>
            <main className={styles.main}>

                {/* HERO IMAGE */}
                <Image
                    src="/images/datamining_a_llm_menu_images/datamining_llm_hero_image.webp"
                    alt="Hero Image"
                    className={styles.hero}
                    width={525}
                    height={232}
                    sizes="(max-width: 768px) 100vw, 525px"
                    priority
                    quality={70}
                />

                <CollapsibleSections sections={sections} />

            </main>
        </div>
    )
}