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
                destination: '/art/semantic-seo-begins-before-optimisation',
                permanent: true,
            },
            {
                source: '/art/seo-visibility-structural-legibility',
                destination: '/art/semantic-seo-begins-before-optimisation',
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