import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString()

    return {
        name: 'Life in the UK Test',
        short_name: 'LifeUK',
        description: 'Practice for your British citizenship test',
        start_url: './',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#012169',
        icons: [
            {
                src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="15%" fill="%23012169"/><rect x="0" y="192" width="512" height="128" fill="white"/><rect x="192" y="0" width="128" height="512" fill="white"/><rect x="0" y="224" width="512" height="64" fill="%23C8102E"/><rect x="224" y="0" width="64" height="512" fill="%23C8102E"/></svg>',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    }
}
