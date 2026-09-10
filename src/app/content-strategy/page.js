import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import CollapsibleSections from '../components/CollapsibleSections.js'
import { parseMarkdown } from '../components/markdown.js'
import pageStyles from '../components/CollapsiblePage.module.css'

export const metadata = {
    title: 'Content Strategy | Grotesque Art and the Seer-Clown | DecrepitFilth.art',
    description: "An evidence-led artistic strategy defining Decrepit Filth's niche, core grotesque themes, Seer-Clown archetype, and hybrid practical-digital video direction.",
    keywords: [
        'grotesque art content strategy',
        'artistic niche development',
        'dark surrealism',
        'horror art direction',
        'Seer-Clown archetype',
        'grotesque symbolism',
        'creative identity system',
        'ritual horror',
        'hybrid video production',
        'content strategy for artists'
    ],
    alternates: {
        canonical: '/content-strategy',
    },
};

const sectionDefs = [
    {
        file: '1_synopsis_and_execution_plan.md',
        title: 'Synopsis & Execution Plan',
        image: '/images/content_strategy_menu_images/1_synopsis_and_execution_plan.jpg',
    },
    {
        file: '2_defining_a_niche.md',
        title: 'Defining a Niche',
        image: '/images/content_strategy_menu_images/2_defining_a_niche.jpg',
    },
    {
        file: '3_specialised_niche_directions.md',
        title: 'Specialised Niche Directions',
        image: '/images/content_strategy_menu_images/3_specialised_niche_directions.jpg',
    },
    {
        file: '4_core_artistic_themes.md',
        title: 'Core Artistic Themes',
        image: '/images/content_strategy_menu_images/4_core_artistic_themes.jpg',
    },
    {
        file: '5_truthteller_perceived_as_fool.md',
        title: 'The Truth-Teller Perceived as a Fool',
        image: '/images/content_strategy_menu_images/5_truthteller_perceived_as_fool.jpg',
    },
    {
        file: '6_role_of_the_clown.md',
        title: 'Role of the Clown',
        image: '/images/content_strategy_menu_images/6_role_of_the_clown.jpg',
    },
    {
        file: '7_role_of_the_seer.md',
        title: 'Role of the Seer',
        image: '/images/content_strategy_menu_images/7_role_of_the_seer.jpg',
    },
    {
        file: '8_video_production_approach.md',
        title: 'Video Production Approach',
        image: '/images/content_strategy_menu_images/8_video_production_approach.jpg',
    },
]

export default async function Page() {
    const baseDir = path.join(process.cwd(), 'src/app/content-strategy')

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
                <h1 className={pageStyles.pageTitle}>Content Strategy</h1>

                <Image
                    src="/images/content_strategy_menu_images/content_strategy_hero_image.jpg"
                    alt="Content Strategy"
                    className={pageStyles.hero}
                    width={525}
                    height={232}
                    sizes="(max-width: 768px) calc(100vw - 3.5rem), 852px"
                    priority
                    fetchPriority="high"
                    quality={70}
                />

                <CollapsibleSections sections={sections} />
            </div>
        </main>
    )
}
