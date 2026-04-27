import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const PRODUCTION_SITE_ORIGIN = 'https://www.realismthrift.com';

type InquiryPayload = {
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  website: string;
};

type ApiErrorCode =
  | 'validation_error'
  | 'rate_limited'
  | 'delivery_failed'
  | 'config_error';

type RateLimitStore = Map<string, number[]>;

const rateLimitStore: RateLimitStore =
  (globalThis as typeof globalThis & { __inquiryRateLimitStore?: RateLimitStore })
    .__inquiryRateLimitStore ?? new Map<string, number[]>();

if (!(globalThis as typeof globalThis & { __inquiryRateLimitStore?: RateLimitStore }).__inquiryRateLimitStore) {
  (globalThis as typeof globalThis & { __inquiryRateLimitStore?: RateLimitStore }).__inquiryRateLimitStore = rateLimitStore;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value: unknown, maxLength: number) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function jsonError(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status });
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

function getConfiguredAppOrigin() {
  const appUrl = process.env.APP_URL;
  if (!appUrl || appUrl === 'MY_APP_URL') {
    return null;
  }

  try {
    return new URL(appUrl).origin;
  } catch {
    return null;
  }
}

function getRequestOrigin(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || request.headers.get('host')?.trim();
  if (!host) {
    return null;
  }

  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const protocol = forwardedProto || new URL(request.url).protocol.replace(':', '');
  return `${protocol}://${host}`;
}

function getSourceOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    return origin;
  }

  const referer = request.headers.get('referer');
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function isAllowedRequestOrigin(request: Request) {
  const sourceOrigin = getSourceOrigin(request);

  if (!sourceOrigin) {
    return process.env.NODE_ENV !== 'production';
  }

  const allowedOrigins = new Set<string>([
    PRODUCTION_SITE_ORIGIN,
    getRequestOrigin(request),
    getConfiguredAppOrigin(),
  ].filter((origin): origin is string => Boolean(origin)));

  return allowedOrigins.has(sourceOrigin);
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
    website: normalizeText(record.website, 80),
  };

  if (data.website) {
    return { error: 'Invalid request payload.' };
  }

  if (!data.name || !data.email || !data.whatsapp) {
    return { error: 'Missing required fields.' };
  }

  if (!emailPattern.test(data.email)) {
    return { error: 'Invalid email address.' };
  }

  return { data };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || 'sales@realismthrift.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL 
    ? normalizeText(process.env.CONTACT_FROM_EMAIL, 120).toLowerCase() 
    : process.env.NODE_ENV === 'production'
      ? ''
      : 'onboarding@resend.dev';

  if (!apiKey || !fromEmail || !emailPattern.test(fromEmail)) {
    return jsonError(
      'config_error',
      'Inquiry service is temporarily unavailable. Please contact us via WhatsApp or email directly.',
      500,
    );
  }

  const resend = new Resend(apiKey);

  try {
    if (!isAllowedRequestOrigin(request)) {
      return jsonError(
        'validation_error',
        'Invalid request origin.',
        403,
      );
    }

    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return jsonError(
        'rate_limited',
        'Too many inquiries were submitted from this connection. Please wait a few minutes and try again.',
        429,
      );
    }

    const parsed = validatePayload(await request.json());
    if (!parsed.data) {
      return jsonError(
        'validation_error',
        parsed.error ?? 'Invalid request payload.',
        400,
      );
    }

    const { name, email, whatsapp, country, product, quantity, message } = parsed.data;

    const result = await resend.emails.send({
      from: `RealismThrift <${fromEmail}>`,
      to: [contactEmail],
      subject: `New Lead: ${name} from ${country || 'Unknown Country'}`,
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

    if (result.error || !result.data?.id) {
      console.error('Failed to send inquiry', result.error);
      return jsonError(
        'delivery_failed',
        'We could not send your inquiry right now. Please try again or contact us via WhatsApp.',
        502,
      );
    }

    return NextResponse.json({
      ok: true,
      id: result.data.id,
      message: 'Inquiry received. Our sales team will contact you within 12 hours.',
    });
  } catch (error) {
    console.error('Failed to send inquiry', error);
    return jsonError(
      'delivery_failed',
      'We could not send your inquiry right now. Please try again or contact us via WhatsApp.',
      500,
    );
  }
}
