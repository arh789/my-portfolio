/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
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