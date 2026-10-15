-- Existing draft IDs are unique per sender. Link atomically without creating mail.
CREATE FUNCTION outreach_import_existing_draft(p_contact uuid, p_draft text, p_fingerprint text, p_thread text) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts; m outreach_messages;
BEGIN
  IF p_draft !~ '^[A-Za-z0-9_-]{1,200}$' OR p_fingerprint !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'invalid_draft'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('outreach-draft:'||p_draft,0));
  SELECT * INTO c FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  IF NOT FOUND OR c.safety_block IS NOT NULL OR c.marketing_status NOT IN ('held','eligible') OR c.conversation_paused THEN RAISE EXCEPTION 'marketing_not_eligible'; END IF;
  SELECT * INTO m FROM outreach_messages WHERE sender='jason@realismthriftglobal.com' AND draft_id=p_draft;
  IF FOUND THEN
    IF m.contact_id<>c.id OR m.purpose<>'cold_marketing' THEN RAISE EXCEPTION 'draft_already_registered'; END IF;
    RETURN jsonb_build_object('outreach_id',m.id,'status',m.status);
  END IF;
  INSERT INTO outreach_messages(contact_id,purpose,sender,draft_id,gmail_thread_id,fingerprint)
    VALUES(c.id,'cold_marketing','jason@realismthriftglobal.com',p_draft,p_thread,p_fingerprint) RETURNING * INTO m;
  INSERT INTO outreach_events(contact_id,message_id,kind,source,details) VALUES(c.id,m.id,'existing_draft_imported','operator',jsonb_build_object('draft_id',p_draft,'fingerprint',p_fingerprint));
  RETURN jsonb_build_object('outreach_id',m.id,'status',m.status);
END $$;
--> statement-breakpoint
-- Snapshot actual Sent IDs and combine with reservations inside the quota lock.
-- Keep the old 3-argument function for compatibility during the rolling release.
CREATE FUNCTION outreach_claim_send(p_message uuid, p_fingerprint text, p_version integer, p_gmail_ids jsonb, p_day date) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE m outreach_messages; c outreach_contacts; today date := timezone('Asia/Shanghai',now())::date; used integer;
BEGIN
  IF p_day IS DISTINCT FROM today OR jsonb_typeof(p_gmail_ids) IS DISTINCT FROM 'array' THEN RETURN jsonb_build_object('status','quota_snapshot_stale'); END IF;
  SELECT * INTO m FROM outreach_messages WHERE id=p_message;
  IF NOT FOUND THEN RETURN jsonb_build_object('status','invalid'); END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('outreach-quota:'||m.sender||':'||today,0));
  SELECT * INTO c FROM outreach_contacts WHERE id=m.contact_id FOR UPDATE;
  SELECT * INTO m FROM outreach_messages WHERE id=p_message FOR UPDATE;
  IF m.status='sent' THEN RETURN jsonb_build_object('status','sent','message_id',m.gmail_message_id,'thread_id',m.gmail_thread_id); END IF;
  IF m.status<>'draft' OR m.draft_id IS NULL OR m.purpose='resubscribe_confirmation' THEN RETURN jsonb_build_object('status','not_sendable'); END IF;
  IF c.safety_block IS NOT NULL OR c.preference_version<>p_version THEN RETURN jsonb_build_object('status','blocked'); END IF;
  IF m.purpose='cold_marketing' THEN
    IF c.marketing_status NOT IN ('held','eligible') OR c.conversation_paused THEN RETURN jsonb_build_object('status','blocked'); END IF;
    SELECT count(DISTINCT value) INTO used FROM jsonb_array_elements_text(p_gmail_ids);
    SELECT used+count(*) INTO used FROM outreach_messages WHERE sender=m.sender AND send_day=today AND purpose='cold_marketing' AND status IN ('sending','sent','send_unknown')
      AND (gmail_message_id IS NULL OR NOT p_gmail_ids ? gmail_message_id);
    IF used >= 50 THEN RETURN jsonb_build_object('status','daily_limit'); END IF;
  ELSIF m.reply_to_message_id IS NULL THEN RETURN jsonb_build_object('status','blocked');
  END IF;
  UPDATE outreach_messages SET status='sending',send_day=today,fingerprint=p_fingerprint,updated_at=now() WHERE id=m.id;
  INSERT INTO outreach_events(contact_id,message_id,kind,source,details) VALUES(c.id,m.id,'send_approved','operator',jsonb_build_object('fingerprint',p_fingerprint,'mailbox_snapshot_day',p_day));
  RETURN jsonb_build_object('status','claimed');
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION outreach_import_existing_draft(uuid,text,text,text), outreach_claim_send(uuid,text,integer,jsonb,date) FROM PUBLIC;
