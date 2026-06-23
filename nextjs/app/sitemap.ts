import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export const revalidate = 86400; // Cache sitemap for 24 hours on CDN edge

const baseUrl = 'https://www.realismthrift.com';

type StaticPageConfig = {
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

// Per-page lastmod dates — update the relevant entry when page content changes.
const staticPages: StaticPageConfig[] = [
  { path: '/', lastModified: '2026-06-23', changeFrequency: 'weekly', priority: 1 },
  { path: '/used-brand-clothes', lastModified: '2026-06-02', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/used-brand-shoes', lastModified: '2026-06-02', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/used-brand-bag', lastModified: '2026-06-02', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/how-to-order', lastModified: '2026-04-27', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/contact-us', lastModified: '2026-06-19', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/about-us', lastModified: '2026-06-18', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', lastModified: '2026-04-27', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/blog', lastModified: '2026-04-27', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/privacy-policy', lastModified: '2026-06-21', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-of-service', lastModified: '2026-06-19', changeFrequency: 'yearly', priority: 0.3 },
];

function resolveLatestPostDate(
  posts: Awaited<ReturnType<typeof getAllBlogPosts>>,
  fallback: string,
): Date {
  if (!posts.length) {
    return new Date(fallback);
  }

  const timestamps = posts
    .map((post) => post._updatedAt || post.publishedAt)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  return timestamps.length ? new Date(Math.max(...timestamps)) : new Date(fallback);
}

function buildStaticRoutes(blogLastModified: Date): MetadataRoute.Sitemap {
  return staticPages.map((page) => ({
    url: page.path === '/' ? baseUrl : `${baseUrl}${page.path}`,
    lastModified: page.path === '/blog' ? blogLastModified : new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogRoutes: MetadataRoute.Sitemap = [];
  let blogLastModified = new Date('2026-04-27');

  try {
    const posts = await getAllBlogPosts();
    if (posts && Array.isArray(posts)) {
      blogLastModified = resolveLatestPostDate(posts, '2026-04-27');
      blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post._updatedAt || post.publishedAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Failed to generate blog routes for sitemap:', error);
  }

  return [...buildStaticRoutes(blogLastModified), ...blogRoutes];
}