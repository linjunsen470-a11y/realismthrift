import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RealismThrift Export Co., Ltd',
    short_name: 'RealismThrift',
    description: 'Wholesale supplier of sorted second-hand clothes, shoes and bags from China.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#c0392b',
    icons: [
      {
        src: '/img/logo.webp',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
