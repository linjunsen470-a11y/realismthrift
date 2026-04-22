import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type InquiryPayload = {
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  company: string;
};

type RateLimitStore = Map<string, number[]>;

const rateLimitStore: RateLimitStore =
  (globalThis as typeof globalThis & { __inquiryRateLimitStore?: RateLimitStore })
    .__inquiryRateLimitStore ?? new Map<string, number[]>();

if (!(globalThis as typeof globalThis & { __inquiryRateLimitStore?: RateLimitStore }).__inquiryRateLimitStore) {
  (globalThis as typeof globalThis & { __inquiryRateLimitStore?: RateLimitStore }).__inquiryRateLimitStore = rateLimitStore;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^[+\d\s\-()]{7,20}$/;
const allowedProducts = new Set([
  '',
  'Used Brand Clothes',
  'Used Brand Shoes',
  'Used Brand Bags',
  'Mixed Products',
]);
const allowedQuantities = new Set(['', '100bales', '20ft', '40ft', '2x40ft']);

function normalizeText(value: unknown, maxLength: number) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(clientIp: string) {
  const now = Date.now();
  const attempts = rateLimitStore.get(clientIp) ?? [];
  const recentAttempts = attempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentAttempts.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(clientIp, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  rateLimitStore.set(clientIp, recentAttempts);
  return false;
}

function validatePayload(body: unknown): { data?: InquiryPayload; error?: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request payload.' };
  }

  const record = body as Record<string, unknown>;
  const data: InquiryPayload = {
    name: normalizeText(record.name, 80),
    email: normalizeText(record.email, 120).toLowerCase(),
    whatsapp: normalizeText(record.whatsapp, 32),
    country: normalizeText(record.country, 80),
    product: normalizeText(record.product, 40),
    quantity: normalizeText(record.quantity, 20),
    message: normalizeText(record.message, 2000),
    company: normalizeText(record.company, 80),
  };

  if (data.company) {
    return { error: 'Invalid request payload.' };
  }

  if (!data.name || !data.email || !data.whatsapp) {
    return { error: 'Missing required fields.' };
  }

  if (!emailPattern.test(data.email)) {
    return { error: 'Invalid email address.' };
  }

  if (!whatsappPattern.test(data.whatsapp)) {
    return { error: 'Invalid WhatsApp number.' };
  }

  if (!allowedProducts.has(data.product) || !allowedQuantities.has(data.quantity)) {
    return { error: 'Invalid form selection.' };
  }

  return { data };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || 'sales@realismthrift.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'sales@realismthrift.com';
  if (!apiKey) {
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const parsed = validatePayload(await request.json());
    if (!parsed.data) {
      return NextResponse.json({ error: parsed.error ?? 'Invalid request payload.' }, { status: 400 });
    }

    const { name, email, whatsapp, country, product, quantity, message } = parsed.data;

    const data = await resend.emails.send({
      from: `RealismThrift <${fromEmail}>`,
      to: [contactEmail],
      subject: `New Lead: ${escapeHtml(name)} from ${escapeHtml(country || 'Unknown Country')}`,
      html: `
        <h2>New Inquiry from Website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
        <p><strong>Country:</strong> ${escapeHtml(country || 'Not provided')}</p>
        <p><strong>Product Interest:</strong> ${escapeHtml(product || 'Not provided')}</p>
        <p><strong>Quantity:</strong> ${escapeHtml(quantity || 'Not provided')}</p>
        <p><strong>Message:</strong> ${escapeHtml(message || 'Not provided')}</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to send inquiry', error);
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }
}
