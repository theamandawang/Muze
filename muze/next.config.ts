import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    env: {
        SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
        TICKET_MASTER_API_KEY: process.env.TICKET_MASTER_API_KEY,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        S3_KEY_ID: process.env.S3_KEY_ID,
        S3_KEY_SECRET: process.env.S3_KEY_SECRET,
    },
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