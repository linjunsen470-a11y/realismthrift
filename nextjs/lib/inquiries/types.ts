export type InquiryPayload = {
  submissionId: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  sourcePath: string;
  website: string;
};

export type InquiryEmailKind = "sales_notification" | "customer_ack";

export type ClaimedEmailJob = {
  job_id: string;
  inquiry_id: string;
  kind: InquiryEmailKind;
  attempt_count: number;
  from_email: string;
  to_email: string;
  reply_to_email: string;
  subject: string;
  template_version: string;
  idempotency_key: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  source_path: string;
  inquiry_created_at: string;
};

export type CreateInquiryResult = {
  id: string;
  created: boolean;
};

export type ProcessJobsSummary = {
  claimed: number;
  accepted: number;
  deferred: number;
  dead: number;
};

