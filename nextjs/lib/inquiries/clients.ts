import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export class InquiryConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InquiryConfigurationError";
  }
}

let supabaseAdmin: SupabaseClient | null = null;
let resendClient: Resend | null = null;

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new InquiryConfigurationError(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      requireEnvironmentVariable("SUPABASE_URL"),
      requireEnvironmentVariable("SUPABASE_SECRET_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  return supabaseAdmin;
}

export function getResend() {
  if (!resendClient) {
    resendClient = new Resend(requireEnvironmentVariable("RESEND_API_KEY"));
  }
  return resendClient;
}

