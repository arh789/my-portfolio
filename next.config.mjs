/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/how-to-locate-hidden-structure',
                destination: '/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content',
                permanent: true,
            },
            {
                source: '/art/this-process-is-not-seo',
                destination: '/art/seo-is-an-information-retrieval-engineering-problem-not-a-content-marketing-problem',
                permanent: true,
            },
            {
                source: '/art/seo-visibility-structural-legibility',
                destination: '/art/seo-is-an-information-retrieval-engineering-problem-not-a-content-marketing-problem',
                permanent: true,
            },
            {
                source: '/art/semantic-seo-begins-before-optimisation',
                destination: '/art/seo-is-an-information-retrieval-engineering-problem-not-a-content-marketing-problem',
                permanent: true,
            },
            {
                source: '/art/semantic-seo-is-graph-positioning',
                destination: '/art/seo-is-an-information-retrieval-engineering-problem-not-a-content-marketing-problem',
                permanent: true,
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'www.decrepitfilth.art',
                    },
                ],
                destination: 'https://decrepitfilth.art/:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;