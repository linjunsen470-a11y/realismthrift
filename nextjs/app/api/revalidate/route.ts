import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      console.warn("[Revalidate Webhook] Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      console.warn("[Revalidate Webhook] Bad request: missing body or _type");
      return new Response("Bad Request: Missing _type", { status: 400 });
    }

    const documentType = body._type;
    console.log(`[Revalidate Webhook] Received update for document type: ${documentType}`);

    if (documentType === "post") {
      revalidateTag("post", { expire: 0 });
      console.log("[Revalidate Webhook] Revalidated tag: post");
    } else if (documentType === "category") {
      revalidateTag("category", { expire: 0 });
      revalidateTag("post", { expire: 0 });
      console.log("[Revalidate Webhook] Revalidated tags: category, post");
    } else if (documentType === "author") {
      revalidateTag("post", { expire: 0 });
      console.log("[Revalidate Webhook] Revalidated tag: post (due to author update)");
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      type: documentType,
      now: Date.now(),
    });
  } catch (err: any) {
    console.error("[Revalidate Webhook Error]:", err);
    return new Response(err.message || "Internal Server Error", { status: 500 });
  }
}
