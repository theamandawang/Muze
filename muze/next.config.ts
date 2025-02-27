import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
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
        ],
    },
};

export default nextConfig;
