-- Remove the manual eligibility gate; retain existing subscription and safety states.
CREATE OR REPLACE FUNCTION outreach_prepare_message(p_contact uuid, p_purpose text DEFAULT 'cold_marketing', p_reply_id text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts; message uuid;
BEGIN
  SELECT * INTO c FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  IF NOT FOUND OR c.safety_block IS NOT NULL THEN RAISE EXCEPTION 'contact_blocked'; END IF;
  IF p_purpose='cold_marketing' THEN
    IF c.marketing_status NOT IN ('held','eligible') OR c.conversation_paused THEN RAISE EXCEPTION 'marketing_not_eligible'; END IF;
  ELSIF p_purpose='requested_reply' THEN
    IF p_reply_id IS NULL OR NOT EXISTS(SELECT 1 FROM outreach_events WHERE contact_id=c.id AND kind='reply' AND provider_key='jason@realismthriftglobal.com:'||p_reply_id) THEN RAISE EXCEPTION 'reply_request_missing'; END IF;
  ELSE RAISE EXCEPTION 'invalid_purpose'; END IF;
  INSERT INTO outreach_messages(contact_id,purpose,sender,reply_to_message_id) VALUES(c.id,p_purpose,'jason@realismthriftglobal.com',p_reply_id) RETURNING id INTO message;
  RETURN jsonb_build_object('outreach_id',message,'email',c.email,'unsubscribe_token',c.unsubscribe_token);
END $$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION outreach_claim_send(p_message uuid, p_fingerprint text, p_version integer) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE m outreach_messages; c outreach_contacts; today date := timezone('Asia/Shanghai',now())::date;
BEGIN
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
    IF (SELECT count(*) FROM outreach_messages WHERE sender=m.sender AND send_day=today AND purpose='cold_marketing' AND status IN ('sending','sent','send_unknown')) >= 50 THEN
      RETURN jsonb_build_object('status','daily_limit');
    END IF;
  ELSIF m.reply_to_message_id IS NULL THEN RETURN jsonb_build_object('status','blocked');
  END IF;
  UPDATE outreach_messages SET status='sending',send_day=today,fingerprint=p_fingerprint,updated_at=now() WHERE id=m.id;
  INSERT INTO outreach_events(contact_id,message_id,kind,source,details) VALUES(c.id,m.id,'send_approved','operator',jsonb_build_object('fingerprint',p_fingerprint));
  RETURN jsonb_build_object('status','claimed');
END $$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION outreach_prepare_message(uuid,text,text), outreach_claim_send(uuid,text,integer) FROM PUBLIC;
