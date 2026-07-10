export function isWebhookVerificationError(error: unknown) {
  return error instanceof Error && error.name === "WebhookVerificationError";
}

