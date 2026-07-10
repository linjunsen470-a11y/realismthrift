import { NextResponse } from "next/server";
import { processPendingEmailJobs } from "@/lib/inquiries/email-jobs";

export const preferredRegion = "sin1";

export async function POST(request: Request) {
  const secret = process.env.INQUIRY_RETRY_SECRET?.trim();
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const summary = await processPendingEmailJobs({ limit: 20 });
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    console.error("Inquiry email retry worker failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

