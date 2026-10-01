import type {NextConfig} from 'next';

/**
 * CSP tuned for this site's runtime third parties:
 * - Next.js hydration / inline boot scripts
 * - GA4 (gtag)
 * - Sanity CDN images + draft/live API
 * - Google Maps embed on contact page
 *
 * next/font self-hosts fonts, so no fonts.googleapis.com entry is required.
 */
const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
];

const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src",
    ...scriptSources,
  ].join(' '),
  "style-src 'self' 'unsafe-inline'",
  [
    'img-src',
    "'self'",
    'data:',
    'blob:',
    'https://cdn.sanity.io',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://*.google.com',
    'https://*.googleapis.com',
    'https://*.gstatic.com',
  ].join(' '),
  "font-src 'self' data:",
  [
    'connect-src',
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://cdn.sanity.io',
    'https://*.api.sanity.io',
    'https://*.sanity.io',
    'wss://*.api.sanity.io',
  ].join(' '),
  [
    'frame-src',
    'https://www.google.com',
    'https://maps.google.com',
    'https://www.google.com/maps/',
  ].join(' '),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  {key: 'Content-Security-Policy', value: contentSecurityPolicy},
  {key: 'X-Frame-Options', value: 'DENY'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {}, // Satisfies Next.js 16 requirements when webpack config is present
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'realismthrift.com' }],
        destination: 'https://www.realismthrift.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      ...['/email-preferences/:path*', '/api/email-preferences/:path*', '/outreach/:path*', '/api/outreach/:path*', '/oauth/consent', '/api/mcp'].map(source => ({
        source,
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      })),
      ...['/outreach/:path*', '/oauth/consent'].map(source => ({
        source,
        headers: [
          // Native same-origin form POSTs need an Origin header for CSRF checks.
          { key: 'Referrer-Policy', value: 'same-origin' },
          // OAuth form redirects may visit only the configured identity providers.
          { key: 'Content-Security-Policy', value: contentSecurityPolicy.replace(
            "form-action 'self'",
            `form-action 'self' https://accounts.google.com ${new URL(process.env.SUPABASE_URL || 'https://tjbeeackrjpojejxhnzq.supabase.co').origin}`,
          ) },
        ],
      })),
      {
        source: '/oauth/consent',
        headers: [
          // Also supports the standard server-action fallback when JavaScript is unavailable.
          { key: 'Content-Security-Policy', value: contentSecurityPolicy.replace(
            "form-action 'self'",
            `form-action 'self' https://accounts.google.com ${new URL(process.env.SUPABASE_URL || 'https://tjbeeackrjpojejxhnzq.supabase.co').origin} https://chatgpt.com`,
          ) },
        ],
      },
    ];
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR can be disabled via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
