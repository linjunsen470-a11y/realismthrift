import { sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, date } from "drizzle-orm/pg-core";

export const outreachContacts = pgTable("outreach_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  company: text("company"),
  country: text("country"),
  source: text("source").notNull(),
  eligibilityNote: text("eligibility_note"),
  marketingStatus: text("marketing_status").notNull().default("held"),
  safetyBlock: text("safety_block"),
  conversationPaused: boolean("conversation_paused").notNull().default(false),
  preferenceVersion: integer("preference_version").notNull().default(0),
  unsubscribeToken: text("unsubscribe_token").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("outreach_contacts_email_key").on(t.email),
  uniqueIndex("outreach_contacts_unsubscribe_key").on(t.unsubscribeToken),
  check("outreach_contact_status", sql`${t.marketingStatus} in ('held','eligible','unsubscribed')`),
  check("outreach_contact_email_normalized", sql`${t.email} = lower(trim(${t.email}))`),
  check("outreach_contact_token_shape", sql`${t.unsubscribeToken} ~ '^[A-Za-z0-9_-]{43}$'`),
]);

export const outreachMessages = pgTable("outreach_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").notNull().references(() => outreachContacts.id),
  purpose: text("purpose").notNull(),
  sender: text("sender").notNull(),
  draftId: text("draft_id"),
  gmailMessageId: text("gmail_message_id"),
  gmailThreadId: text("gmail_thread_id"),
  replyToMessageId: text("reply_to_message_id"),
  fingerprint: text("fingerprint"),
  status: text("status").notNull().default("draft"),
  sendDay: date("send_day"),
  providerMessageId: text("provider_message_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("outreach_draft_key").on(t.sender, t.draftId),
  uniqueIndex("outreach_sent_key").on(t.sender, t.gmailMessageId),
  index("outreach_message_contact_index").on(t.contactId),
  index("outreach_message_quota_index").on(t.sender, t.sendDay, t.status),
  check("outreach_message_purpose", sql`${t.purpose} in ('cold_marketing','requested_reply','resubscribe_confirmation')`),
  check("outreach_message_status", sql`${t.status} in ('draft','sending','sent','send_unknown','failed','cancelled')`),
]);

export const outreachEvents = pgTable("outreach_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").references(() => outreachContacts.id),
  messageId: uuid("message_id").references(() => outreachMessages.id),
  kind: text("kind").notNull(),
  source: text("source").notNull(),
  providerKey: text("provider_key"),
  rateKey: text("rate_key"),
  details: jsonb("details").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("outreach_event_provider_key").on(t.providerKey),
  index("outreach_event_contact_index").on(t.contactId, t.createdAt),
  index("outreach_event_rate_index").on(t.kind, t.rateKey, t.createdAt),
]);

export const outreachPreferenceTokens = pgTable("outreach_preference_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").notNull().references(() => outreachContacts.id),
  tokenHash: text("token_hash").notNull(),
  preferenceVersion: integer("preference_version").notNull(),
  confirmedVersion: integer("confirmed_version"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("outreach_preference_token_key").on(t.tokenHash),
  index("outreach_preference_contact_index").on(t.contactId),
]);
