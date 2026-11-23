import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createSupabaseAuthRetryFetch } from "./supabase-fetch";

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
    const url = requireEnvironmentVariable("SUPABASE_URL");
    const secretKey = requireEnvironmentVariable("SUPABASE_SECRET_KEY");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    supabaseAdmin = createClient(
      url,
      secretKey,
      {
        global: {
          fetch: createSupabaseAuthRetryFetch(
            fetch,
            undefined,
            serviceRoleKey ? { origin: new URL(url).origin, secretKey, serviceRoleKey } : undefined,
          ),
        },
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

