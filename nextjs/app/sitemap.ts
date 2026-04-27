import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

const baseUrl = 'https://www.realismthrift.com';
const staticLastModified = new Date('2026-04-27');

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: staticLastModified,
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${baseUrl}/used-brand-clothes`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly',
    priority: 0.95,
  },
  {
    url: `${baseUrl}/used-brand-shoes`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly',
    priority: 0.95,
  },
  {
    url: `${baseUrl}/used-brand-bag`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly',
    priority: 0.95,
  },
  {
    url: `${baseUrl}/how-to-order`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly',
    priority: 0.85,
  },
  {
    url: `${baseUrl}/contact-us`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly',
    priority: 0.85,
  },
  {
    url: `${baseUrl}/about-us`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/faq`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly',
    priority: 0.75,
  },
  {
    url: `${baseUrl}/blog`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  },
  {
    url: `${baseUrl}/privacy-policy`,
    lastModified: staticLastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${baseUrl}/terms-of-service`,
    lastModified: staticLastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
