import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RealismThrift Export Co., Ltd',
    short_name: 'RealismThrift',
    description: 'Leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#c0392b',
    icons: [
      {
        src: '/img/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
