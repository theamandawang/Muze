import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: true, // Skip type checking during build
    },
    images: {
        remotePatterns: [
            // for user uploaded images
            {
                protocol: 'https',
                hostname: 'axcnthaoozwhcofglcwo.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/avatars/**/avatar.png',
            },

            // for spotify images
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/image/**',
            },

            // for ticketmaster images
            {
                protocol: 'https',
                hostname: 's1.ticketm.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.universe.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
