CREATE TABLE "outreach_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"country" text,
	"source" text NOT NULL,
	"eligibility_note" text,
	"marketing_status" text DEFAULT 'held' NOT NULL,
	"safety_block" text,
	"conversation_paused" boolean DEFAULT false NOT NULL,
	"preference_version" integer DEFAULT 0 NOT NULL,
	"unsubscribe_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outreach_contact_status" CHECK ("outreach_contacts"."marketing_status" in ('held','eligible','unsubscribed')),
	CONSTRAINT "outreach_contact_email_normalized" CHECK ("outreach_contacts"."email" = lower(trim("outreach_contacts"."email"))),
	CONSTRAINT "outreach_contact_token_shape" CHECK ("outreach_contacts"."unsubscribe_token" ~ '^[A-Za-z0-9_-]{43}$')
);
--> statement-breakpoint
CREATE TABLE "outreach_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid,
	"message_id" uuid,
	"kind" text NOT NULL,
	"source" text NOT NULL,
	"provider_key" text,
	"rate_key" text,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outreach_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"purpose" text NOT NULL,
	"sender" text NOT NULL,
	"draft_id" text,
	"gmail_message_id" text,
	"gmail_thread_id" text,
	"reply_to_message_id" text,
	"fingerprint" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"send_day" date,
	"provider_message_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outreach_message_purpose" CHECK ("outreach_messages"."purpose" in ('cold_marketing','requested_reply','resubscribe_confirmation')),
	CONSTRAINT "outreach_message_status" CHECK ("outreach_messages"."status" in ('draft','sending','sent','send_unknown','failed','cancelled'))
);
--> statement-breakpoint
CREATE TABLE "outreach_preference_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"preference_version" integer NOT NULL,
	"confirmed_version" integer,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "outreach_events" ADD CONSTRAINT "outreach_events_contact_id_outreach_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."outreach_contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_events" ADD CONSTRAINT "outreach_events_message_id_outreach_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."outreach_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_messages" ADD CONSTRAINT "outreach_messages_contact_id_outreach_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."outreach_contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_preference_tokens" ADD CONSTRAINT "outreach_preference_tokens_contact_id_outreach_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."outreach_contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "outreach_contacts_email_key" ON "outreach_contacts" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "outreach_contacts_unsubscribe_key" ON "outreach_contacts" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE UNIQUE INDEX "outreach_event_provider_key" ON "outreach_events" USING btree ("provider_key");--> statement-breakpoint
CREATE INDEX "outreach_event_contact_index" ON "outreach_events" USING btree ("contact_id","created_at");--> statement-breakpoint
CREATE INDEX "outreach_event_rate_index" ON "outreach_events" USING btree ("kind","rate_key","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "outreach_draft_key" ON "outreach_messages" USING btree ("sender","draft_id");--> statement-breakpoint
CREATE UNIQUE INDEX "outreach_sent_key" ON "outreach_messages" USING btree ("sender","gmail_message_id");--> statement-breakpoint
CREATE INDEX "outreach_message_contact_index" ON "outreach_messages" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "outreach_message_quota_index" ON "outreach_messages" USING btree ("sender","send_day","status");--> statement-breakpoint
CREATE UNIQUE INDEX "outreach_preference_token_key" ON "outreach_preference_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "outreach_preference_contact_index" ON "outreach_preference_tokens" USING btree ("contact_id");