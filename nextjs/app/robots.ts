import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Single source for /robots.txt. Keep /search crawlable so its noindex is read.
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://www.realismthrift.com/sitemap.xml',
  };
}
