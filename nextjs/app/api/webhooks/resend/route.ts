import { NextResponse } from "next/server";
import { getResend, InquiryConfigurationError } from "@/lib/inquiries/clients";
import { recordWebhookEvent } from "@/lib/inquiries/repository";
import { isWebhookVerificationError } from "@/lib/inquiries/webhook-errors";

export const preferredRegion = "sin1";

const trackedEvents = new Set([
  "email.sent",
  "email.delivered",
  "email.delivery_delayed",
  "email.bounced",
  "email.complained",
  "email.suppressed",
]);

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error("Resend webhook secret is not configured");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const payload = await request.text();

  try {
    const event = getResend().webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret,
    });

    if (!trackedEvents.has(event.type)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const eventData = event.data as { email_id?: string };
    if (!eventData.email_id) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const inserted = await recordWebhookEvent({
      svixId,
      emailId: eventData.email_id,
      eventType: event.type,
      eventCreatedAt: event.created_at,
    });

    return NextResponse.json({ ok: true, duplicate: !inserted });
  } catch (error) {
    if (error instanceof InquiryConfigurationError) {
      console.error("Resend webhook configuration error", { errorName: error.name });
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const errorName = error instanceof Error ? error.name : "UnknownError";
    if (isWebhookVerificationError(error)) {
      console.warn("Rejected invalid Resend webhook signature", { errorName });
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    console.error("Resend webhook processing failed", { errorName });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
