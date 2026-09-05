import { getSupabaseAdmin } from "./clients";
import type {
  ClaimedEmailJob,
  CreateInquiryResult,
  InquiryPayload,
} from "./types";
import type { InquiryEmailSettings } from "./config";

export class InquiryStorageError extends Error {
  readonly operation: string;
  readonly providerCode?: string;

  constructor(message: string, operation: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "InquiryStorageError";
    this.operation = operation;
    const cause = options?.cause;
    if (cause && typeof cause === "object" && "code" in cause && typeof cause.code === "string") {
      this.providerCode = cause.code;
    }
  }
}

export async function createInquiry(
  inquiry: InquiryPayload,
  settings: InquiryEmailSettings,
) {
  const { data, error } = await getSupabaseAdmin().rpc(
    "create_inquiry_with_email_jobs",
    {
      p_submission_key: inquiry.submissionId,
      p_name: inquiry.name,
      p_email: inquiry.email,
      p_whatsapp: inquiry.whatsapp,
      p_country: inquiry.country,
      p_product: inquiry.product,
      p_quantity: inquiry.quantity,
      p_message: inquiry.message,
      p_source_path: inquiry.sourcePath,
      p_sales_to: settings.salesTo,
      p_sales_from: settings.salesFrom,
      p_customer_from: settings.customerFrom,
    },
  );

  if (error || !data) {
    throw new InquiryStorageError("Failed to persist inquiry.", "create_inquiry", { cause: error });
  }

  const result = data as unknown as CreateInquiryResult;
  if (!result.id) {
    throw new InquiryStorageError("Inquiry persistence returned no identifier.", "create_inquiry_result");
  }

  return result;
}

export async function claimEmailJobs(inquiryId?: string, limit = 20) {
  const supabase = getSupabaseAdmin();
  const now = new Date();
  const staleCutoff = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString();
  const deadLetterUpdate = {
    status: "dead",
    locked_until: null,
    last_error_code: "retry_window_expired",
    last_error_message: "The email could not be safely retried within the idempotency window.",
  };

  const [pendingExpiry, processingExpiry] = await Promise.all([
    supabase
      .from("inquiry_email_jobs")
      .update(deadLetterUpdate)
      .in("status", ["queued", "failed"])
      .lt("created_at", staleCutoff)
      .is("resend_email_id", null),
    supabase
      .from("inquiry_email_jobs")
      .update(deadLetterUpdate)
      .eq("status", "processing")
      .lt("created_at", staleCutoff)
      .lt("locked_until", now.toISOString())
      .is("resend_email_id", null),
  ]);

  if (pendingExpiry.error || processingExpiry.error) {
    throw new InquiryStorageError("Failed to expire stale inquiry email jobs.", "expire_email_jobs", {
      cause: pendingExpiry.error ?? processingExpiry.error,
    });
  }

  const { data, error } = await supabase.rpc(
    "claim_inquiry_email_jobs",
    {
      p_limit: limit,
      p_inquiry_id: inquiryId ?? null,
    },
  );

  if (error) {
    throw new InquiryStorageError("Failed to claim inquiry email jobs.", "claim_email_jobs", { cause: error });
  }

  return (data ?? []) as unknown as ClaimedEmailJob[];
}

export async function markEmailJobAccepted(jobId: string, resendEmailId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("inquiry_email_jobs")
    .update({
      status: "accepted",
      resend_email_id: resendEmailId,
      locked_until: null,
      last_error_code: null,
      last_error_message: null,
    })
    .eq("id", jobId)
    .eq("status", "processing")
    .select("id")
    .maybeSingle();

  if (error) {
    throw new InquiryStorageError("Failed to record accepted inquiry email.", "accept_email_job", { cause: error });
  }

  if (!data) {
    console.warn("Inquiry email acceptance update matched no processing job", { jobId });
  }

  const { error: reconcileError } = await supabase.rpc("apply_resend_email_state", {
    p_email_id: resendEmailId,
  });

  if (reconcileError) {
    throw new InquiryStorageError("Failed to reconcile inquiry email state.", "reconcile_email_state", {
      cause: reconcileError,
    });
  }
}

type FailureUpdate = {
  status: "failed" | "dead";
  nextAttemptAt: string;
  code: string;
  message: string;
};

export async function markEmailJobFailed(jobId: string, update: FailureUpdate) {
  const { error } = await getSupabaseAdmin()
    .from("inquiry_email_jobs")
    .update({
      status: update.status,
      next_attempt_at: update.nextAttemptAt,
      locked_until: null,
      last_error_code: update.code,
      last_error_message: update.message,
    })
    .eq("id", jobId)
    .eq("status", "processing");

  if (error) {
    throw new InquiryStorageError("Failed to record inquiry email failure.", "fail_email_job", { cause: error });
  }
}

export async function recordWebhookEvent(input: {
  svixId: string;
  emailId: string;
  eventType: string;
  eventCreatedAt: string;
}) {
  const { data, error } = await getSupabaseAdmin().rpc(
    "record_resend_webhook_event",
    {
      p_svix_id: input.svixId,
      p_email_id: input.emailId,
      p_event_type: input.eventType,
      p_event_created_at: input.eventCreatedAt,
    },
  );

  if (error) {
    throw new InquiryStorageError("Failed to record Resend webhook event.", "record_resend_webhook", { cause: error });
  }

  return Boolean(data);
}
