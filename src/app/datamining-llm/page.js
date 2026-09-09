import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import CollapsibleSections from '../components/CollapsibleSections.js'
import { parseMarkdown } from '../components/markdown.js'
import pageStyles from '../components/CollapsiblePage.module.css'

export const metadata = {
    title: 'Data-Mining an LLM: Emergent Structural Mapping | DecrepitFilth.art',
    description: 'A framework for analysing LLM outputs under generative pressure, identifying persistent semantic structures, and converting them into evidence-led content and SEO systems.',
    keywords: [
        'data mining large language models',
        'emergent structural mapping',
        'LLM output analysis',
        'generative pressure',
        'semantic structure analysis',
        'symbolic compression',
        'SDA-3',
        'AI content research',
        'semantic SEO',
        'black-box model analysis',
    ],
    alternates: {
        canonical: '/datamining-llm',
    },
}

const sectionDefs = [
    {
        file: '00_INTRODUCTION.md',
        title: 'Introduction',
        image: '/images/datamining_a_llm_menu_images/00_INTRODUCTION.jpg',
    },
    {
        file: '01_EMERGENT_STRUCTURAL_MAPPING_DOCTRINE.md',
        title: 'Emergent Structural Mapping Doctrine',
        image: '/images/datamining_a_llm_menu_images/01_EMERGENT_STRUCTURAL_MAPPING_DOCTRINE.jpg',
    },
    {
        file: '02_METHODOLOGY_PIPELINE.md',
        title: 'Methodology Pipeline',
        image: '/images/datamining_a_llm_menu_images/02_METHODOLOGY_PIPELINE.jpg',
    },
    {
        file: '03_SYMBOLIC_ENGINE_SCHEMA.md',
        title: 'Symbolic Engine Schema',
        image: '/images/datamining_a_llm_menu_images/03_SYMBOLIC_ENGINE_SCHEMA.jpg',
    },
    {
        file: '04_IMPLEMENTATION_EXAMPLE.md',
        title: 'Implementation Example',
        image: '/images/datamining_a_llm_menu_images/04_IMPLEMENTATION_EXAMPLE.jpg',
    },
    {
        file: '05_SEM_EXECUTION_SYSTEM.md',
        title: 'SEM Execution System',
        image: '/images/datamining_a_llm_menu_images/05_SEM_EXECUTION_SYSTEM.jpg',
    },
    {
        file: '06_FULL_THREAD_ARCHIVE_REFERENCE.md',
        title: 'Full Thread Archive Reference',
        image: '/images/datamining_a_llm_menu_images/06_FULL_THREAD_ARCHIVE_REFERENCE.jpg',
    },
    {
        file: '07_FINAL_CONCLUSION_AND_NEXT_STEPS.md',
        title: 'Final Conclusion and Next Steps',
        image: '/images/datamining_a_llm_menu_images/07_FINAL_CONCLUSION_AND_NEXT_STEPS.jpg',
    },
]

export default async function Page() {
    const baseDir = path.join(process.cwd(), 'src/app/datamining-llm')

    const sections = await Promise.all(sectionDefs.map(async ({ file, title, image }) => {
        const content = fs.readFileSync(path.join(baseDir, file), 'utf8')
        return {
            title,
            image,
            html: await parseMarkdown(content),
        }
    }))

    return (
        <main className={pageStyles.page}>
            <div className={pageStyles.container}>
                <h1 className={pageStyles.pageTitle}>Data-Mining an LLM</h1>

                <Image
                    src="/images/datamining_a_llm_menu_images/datamining_llm_hero_image.webp"
                    alt="Data-Mining an LLM"
                    className={pageStyles.hero}
                    width={525}
                    height={232}
                    sizes="(max-width: 768px) calc(100vw - 3.5rem), 852px"
                    priority
                    quality={70}
                />

                <CollapsibleSections sections={sections} />
            </div>
        </main>
    )
}
