import fs from 'fs'
import path from 'path'
import CollapsibleSections from '../components/CollapsibleSections.js'
import styles from './datamining-a-llm.module.css'

export const metadata = {
  title: 'Recursive SEO Strategy | Symbolic Compression Engine & Emergent Mapping',
  description: 'Full execution system for adversarial SEO using symbolic compression, structural suppression mapping, and recursive semantic scaffolding. This is not a content strategy—it’s a compression framework.',
  keywords: [
    'symbolic compression SEO',
    'emergent structural mapping',
    'semantic scaffolding',
    'adversarial content generation',
    'suppression-aware architecture',
    'recursive SEO system',
    'token collapse strategy',
    'SDA-3 framework',
    'LLM-resilient content',
    'structural SEO methodology'
  ]
};

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

    console.log(sections)

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <img
                    src="/images/datamining_a_llm_menu_images/datamining_llm_hero_image.jpg"
                    alt="Hero Image"
                    className={styles.hero}
                />
                <CollapsibleSections sections={sections} />
            </main>
        </div>
    )
}
