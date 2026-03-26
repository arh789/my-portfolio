import fs from 'fs'
import path from 'path'
import CollapsibleSections from '../components/CollapsibleSections.js'
import styles from './contentStrategy.module.css'

export const metadata = {
    title: 'Symbolic SEO Engine | Grotesque Automation & Content Compression',
    description: 'Demonstration of a recursive SEO codebase that unifies symbolic compression, adversarial suppression mapping, and surrealist aesthetic direction within a grotesque art framework.',
    keywords: [
        'symbolic SEO engine',
        'recursive content indexing',
        'suppression-aware automation',
        'semantic clustering SEO',
        'grotesque surrealism in SEO',
        'AI-driven content compression',
        'blasphemous search strategy',
        'adversarial system probing',
        'semantic horror art framework',
        'LLM-enhanced metadata extraction'
    ]
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

export default function Page() {
    const baseDir = path.join(process.cwd(), 'src/app/content-strategy')
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
                    src="/images/content_strategy_menu_images/content_strategy_hero_image.jpg"
                    alt="Hero Image"
                    className={styles.hero}
                />
                <CollapsibleSections sections={sections} />
            </main>
        </div>
    )
}
