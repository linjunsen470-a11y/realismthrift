import {
  CustomerAcknowledgementEmail,
  customerAcknowledgementText,
} from "@/emails/CustomerAcknowledgementEmail";
import {
  SalesInquiryEmail,
  salesInquiryText,
} from "@/emails/SalesInquiryEmail";
import { getResend } from "./clients";
import {
  claimEmailJobs,
  markEmailJobAccepted,
  markEmailJobFailed,
} from "./repository";
import {
  classifyEmailError,
  getRetryDelayMinutes,
  MAX_EMAIL_ATTEMPTS,
} from "./retry-policy";
import type { ClaimedEmailJob, ProcessJobsSummary } from "./types";

function salesEmailProps(job: ClaimedEmailJob) {
  return {
    inquiryId: job.inquiry_id,
    submittedAt: job.inquiry_created_at,
    name: job.name,
    email: job.email,
    whatsapp: job.whatsapp,
    country: job.country,
    product: job.product,
    quantity: job.quantity,
    message: job.message,
    sourcePath: job.source_path,
  };
}

function customerEmailProps(job: ClaimedEmailJob) {
  return {
    name: job.name,
    country: job.country,
    product: job.product,
    quantity: job.quantity,
  };
}

async function sendEmailJob(job: ClaimedEmailJob) {
  const isSalesNotification = job.kind === "sales_notification";
  const salesProps = salesEmailProps(job);
  const customerProps = customerEmailProps(job);

  try {
    const result = await getResend().emails.send(
      {
        from: `${isSalesNotification ? "RealismThrift Website" : "RealismThrift Sales"} <${job.from_email}>`,
        to: [job.to_email],
        replyTo: job.reply_to_email,
        subject: job.subject,
        react: isSalesNotification ? (
          <SalesInquiryEmail {...salesProps} />
        ) : (
          <CustomerAcknowledgementEmail {...customerProps} />
        ),
        text: isSalesNotification
          ? salesInquiryText(salesProps)
          : customerAcknowledgementText(customerProps),
        tags: [
          { name: "category", value: job.kind },
          { name: "inquiry_id", value: job.inquiry_id },
        ],
      },
      { idempotencyKey: job.idempotency_key },
    );

    if (result.error || !result.data?.id) {
      throw result.error ?? new Error("Resend returned no email identifier.");
    }

    await markEmailJobAccepted(job.job_id, result.data.id);
    return "accepted" as const;
  } catch (error) {
    const failure = classifyEmailError(error);
    const canRetry = failure.transient && job.attempt_count < MAX_EMAIL_ATTEMPTS;
    const delayMinutes = getRetryDelayMinutes(job.attempt_count);
    const nextAttemptAt = new Date(Date.now() + delayMinutes * 60_000).toISOString();

    await markEmailJobFailed(job.job_id, {
      status: canRetry ? "failed" : "dead",
      nextAttemptAt,
      code: failure.code,
      message: failure.message,
    });

    console.error("Inquiry email job failed", {
      jobId: job.job_id,
      kind: job.kind,
      code: failure.code,
      retryScheduled: canRetry,
    });
    return canRetry ? ("deferred" as const) : ("dead" as const);
  }
}

export async function processPendingEmailJobs(
  options: { inquiryId?: string; limit?: number } = {},
): Promise<ProcessJobsSummary> {
  const jobs = await claimEmailJobs(options.inquiryId, options.limit ?? 20);
  const results = await Promise.all(jobs.map((job) => sendEmailJob(job)));

  return results.reduce<ProcessJobsSummary>(
    (summary, result) => {
      summary[result] += 1;
      return summary;
    },
    { claimed: jobs.length, accepted: 0, deferred: 0, dead: 0 },
  );
}
