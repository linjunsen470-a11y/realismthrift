CREATE EXTENSION IF NOT EXISTS pgcrypto;
--> statement-breakpoint
CREATE FUNCTION outreach_import_contact(p_email text, p_source text, p_company text DEFAULT NULL, p_country text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE contact uuid;
BEGIN
  IF length(trim(p_email))>254 OR trim(p_email) !~ '^[^[:space:]@<>]+@[^[:space:]@<>]+\.[^[:space:]@<>]+$' OR nullif(trim(p_source),'') IS NULL THEN RAISE EXCEPTION 'invalid_contact'; END IF;
  INSERT INTO outreach_contacts(email,source,company,country,unsubscribe_token)
    VALUES(lower(trim(p_email)),p_source,p_company,p_country,rtrim(translate(encode(gen_random_bytes(32),'base64'),'+/','-_'),'='))
    ON CONFLICT(email) DO UPDATE SET company=coalesce(EXCLUDED.company,outreach_contacts.company),country=coalesce(EXCLUDED.country,outreach_contacts.country),updated_at=now()
    RETURNING id INTO contact;
  INSERT INTO outreach_events(contact_id,kind,source,details) VALUES(contact,'contact_imported','operator',jsonb_build_object('source',p_source));
  RETURN contact;
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_review_contact(p_contact uuid, p_note text) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  IF nullif(trim(p_note),'') IS NULL THEN RAISE EXCEPTION 'eligibility_note_required'; END IF;
  PERFORM 1 FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  UPDATE outreach_contacts SET marketing_status='eligible',eligibility_note=p_note,updated_at=now()
    WHERE id=p_contact AND marketing_status<>'unsubscribed' AND safety_block IS NULL;
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO outreach_events(contact_id,kind,source,details) VALUES(p_contact,'eligibility_reviewed','operator',jsonb_build_object('note',p_note));
  RETURN true;
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_prepare_message(p_contact uuid, p_purpose text DEFAULT 'cold_marketing', p_reply_id text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts; message uuid;
BEGIN
  SELECT * INTO c FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  IF NOT FOUND OR c.safety_block IS NOT NULL THEN RAISE EXCEPTION 'contact_blocked'; END IF;
  IF p_purpose='cold_marketing' THEN
    IF c.marketing_status<>'eligible' OR c.conversation_paused OR nullif(trim(c.eligibility_note),'') IS NULL THEN RAISE EXCEPTION 'marketing_not_eligible'; END IF;
  ELSIF p_purpose='requested_reply' THEN
    IF p_reply_id IS NULL OR NOT EXISTS(SELECT 1 FROM outreach_events WHERE contact_id=c.id AND kind='reply' AND provider_key='jason@realismthriftglobal.com:'||p_reply_id) THEN RAISE EXCEPTION 'reply_request_missing'; END IF;
  ELSE RAISE EXCEPTION 'invalid_purpose'; END IF;
  INSERT INTO outreach_messages(contact_id,purpose,sender,reply_to_message_id) VALUES(c.id,p_purpose,'jason@realismthriftglobal.com',p_reply_id) RETURNING id INTO message;
  RETURN jsonb_build_object('outreach_id',message,'email',c.email,'unsubscribe_token',c.unsubscribe_token);
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_attach_draft(p_message uuid, p_draft text) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  IF p_draft !~ '^[A-Za-z0-9_-]{1,200}$' THEN RAISE EXCEPTION 'invalid_draft'; END IF;
  UPDATE outreach_messages SET draft_id=p_draft,updated_at=now() WHERE id=p_message AND status='draft' AND draft_id IS NULL AND purpose IN ('cold_marketing','requested_reply');
  RETURN FOUND;
END $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION outreach_record_inbound(p_contact uuid, p_provider_key text, p_kind text, p_details jsonb DEFAULT '{}') RETURNS void LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts;
BEGIN
  IF p_kind NOT IN ('reply','auto_reply','unsubscribe','hard_bounce','complaint') THEN RAISE EXCEPTION 'invalid_inbound_kind'; END IF;
  SELECT * INTO c FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_contact'; END IF;
  INSERT INTO outreach_events(contact_id,kind,source,provider_key,details) VALUES(c.id,p_kind,'gmail',p_provider_key,p_details) ON CONFLICT(provider_key) DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;
  IF p_kind='unsubscribe' THEN PERFORM outreach_apply_unsubscribe(c.id,'gmail');
  ELSIF p_kind IN ('hard_bounce','complaint') THEN
    UPDATE outreach_contacts SET safety_block=p_kind,preference_version=preference_version+1,updated_at=now() WHERE id=c.id;
    UPDATE outreach_preference_tokens SET revoked_at=now() WHERE contact_id=c.id AND used_at IS NULL AND revoked_at IS NULL;
    UPDATE outreach_messages SET status='cancelled',updated_at=now() WHERE contact_id=c.id AND purpose='cold_marketing' AND status='draft';
  ELSIF p_kind='reply' THEN
    UPDATE outreach_contacts SET conversation_paused=true,updated_at=now() WHERE id=c.id;
  END IF;
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION outreach_import_contact(text,text,text,text), outreach_review_contact(uuid,text), outreach_prepare_message(uuid,text,text), outreach_attach_draft(uuid,text) FROM PUBLIC;
