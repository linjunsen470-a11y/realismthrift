import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.realismthrift.com';

  // Static routes
  const staticRoutes = [
    '',
    '/about-us',
    '/contact-us',
    '/how-to-order',
    '/faq',
    '/blog',
    '/used-brand-clothes',
    '/used-brand-shoes',
    '/used-brand-bag',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog posts
  const posts = await getAllBlogPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
