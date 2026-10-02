// `held` is a legacy unreviewed import, not a sending prohibition. Preserve
// unsubscribe, bounce/complaint and conversation state independently of review.
export function coldEmailAllowed(contact: {
  marketing_status: string; safety_block: string | null; conversation_paused: boolean;
}) {
  return ["held", "eligible"].includes(contact.marketing_status)
    && !contact.safety_block && !contact.conversation_paused;
}
