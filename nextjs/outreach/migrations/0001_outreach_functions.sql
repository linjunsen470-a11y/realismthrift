ALTER TABLE outreach_contacts ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE outreach_events ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE outreach_preference_tokens ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE FUNCTION outreach_apply_unsubscribe(p_contact uuid, p_source text) RETURNS void
LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts; pending boolean;
BEGIN
  SELECT * INTO c FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  SELECT EXISTS(SELECT 1 FROM outreach_preference_tokens WHERE contact_id=c.id AND used_at IS NULL AND revoked_at IS NULL) INTO pending;
  IF c.marketing_status <> 'unsubscribed' OR pending THEN
    UPDATE outreach_contacts SET marketing_status='unsubscribed', preference_version=preference_version+1, updated_at=now() WHERE id=c.id;
    UPDATE outreach_preference_tokens SET revoked_at=now() WHERE contact_id=c.id AND used_at IS NULL AND revoked_at IS NULL;
    UPDATE outreach_messages SET status='cancelled', updated_at=now() WHERE contact_id=c.id AND purpose='cold_marketing' AND status='draft';
    INSERT INTO outreach_events(contact_id,kind,source) VALUES(c.id,'unsubscribe',p_source);
  END IF;
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_unsubscribe(p_token text, p_source text) RETURNS boolean
LANGUAGE plpgsql AS $$
DECLARE contact uuid;
BEGIN
  SELECT id INTO contact FROM outreach_contacts WHERE unsubscribe_token=p_token;
  IF NOT FOUND THEN RETURN false; END IF;
  PERFORM outreach_apply_unsubscribe(contact,p_source);
  RETURN true;
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_request_resubscribe(p_email text, p_email_key text, p_ip_key text, p_hash text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts; message uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('outreach-ip:'||p_ip_key,0));
  PERFORM pg_advisory_xact_lock(hashtextextended('outreach-email:'||p_email_key,0));
  IF (SELECT count(*) FROM outreach_events WHERE kind='request_ip' AND rate_key=p_ip_key AND created_at>now()-interval '10 minutes') >= 5 THEN
    RETURN jsonb_build_object('status','rate_limited');
  END IF;
  INSERT INTO outreach_events(kind,source,rate_key) VALUES('request_ip','website',p_ip_key);
  IF EXISTS(SELECT 1 FROM outreach_events WHERE kind='request_email' AND rate_key=p_email_key AND created_at>now()-interval '1 hour') THEN
    RETURN jsonb_build_object('status','accepted');
  END IF;
  INSERT INTO outreach_events(kind,source,rate_key) VALUES('request_email','website',p_email_key);
  SELECT * INTO c FROM outreach_contacts WHERE email=p_email FOR UPDATE;
  IF NOT FOUND OR c.safety_block IS NOT NULL THEN RETURN jsonb_build_object('status','accepted'); END IF;
  UPDATE outreach_preference_tokens SET revoked_at=now() WHERE contact_id=c.id AND used_at IS NULL AND revoked_at IS NULL;
  INSERT INTO outreach_preference_tokens(contact_id,token_hash,preference_version,expires_at)
    VALUES(c.id,p_hash,c.preference_version,now()+interval '24 hours');
  INSERT INTO outreach_messages(contact_id,purpose,sender,status)
    VALUES(c.id,'resubscribe_confirmation','sales@realismthrift.com','sending') RETURNING id INTO message;
  INSERT INTO outreach_events(contact_id,message_id,kind,source,details)
    VALUES(c.id,message,'request_resubscribe','website',jsonb_build_object('consent_text', 'I''d like to receive wholesale product updates from RealismThrift. I can unsubscribe at any time.'));
  RETURN jsonb_build_object('status','accepted','email',c.email,'message_id',message);
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_preview_confirmation(p_hash text) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE t outreach_preference_tokens; c outreach_contacts;
BEGIN
  SELECT * INTO t FROM outreach_preference_tokens WHERE token_hash=p_hash;
  IF NOT FOUND THEN RETURN jsonb_build_object('status','invalid'); END IF;
  SELECT * INTO c FROM outreach_contacts WHERE id=t.contact_id;
  IF c.safety_block IS NOT NULL THEN RETURN jsonb_build_object('status','unavailable'); END IF;
  IF t.used_at IS NOT NULL AND t.confirmed_version=c.preference_version AND c.marketing_status='eligible' THEN
    RETURN jsonb_build_object('status','already_confirmed');
  END IF;
  IF t.revoked_at IS NOT NULL OR t.used_at IS NOT NULL OR t.preference_version<>c.preference_version THEN
    RETURN jsonb_build_object('status','changed');
  END IF;
  IF t.expires_at<=now() THEN RETURN jsonb_build_object('status','expired'); END IF;
  RETURN jsonb_build_object('status','ready','email',c.email);
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_confirm_resubscribe(p_hash text) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE t outreach_preference_tokens; c outreach_contacts; state jsonb;
BEGIN
  SELECT * INTO t FROM outreach_preference_tokens WHERE token_hash=p_hash;
  IF NOT FOUND THEN RETURN jsonb_build_object('status','invalid'); END IF;
  -- All preference operations lock the contact before modifying its tokens.
  SELECT * INTO c FROM outreach_contacts WHERE id=t.contact_id FOR UPDATE;
  SELECT * INTO t FROM outreach_preference_tokens WHERE id=t.id FOR UPDATE;
  state := outreach_preview_confirmation(p_hash);
  IF state->>'status'<>'ready' THEN RETURN state-'email'; END IF;
  UPDATE outreach_contacts SET marketing_status='eligible',preference_version=preference_version+1,updated_at=now() WHERE id=c.id;
  UPDATE outreach_preference_tokens SET used_at=now(),confirmed_version=c.preference_version+1 WHERE id=t.id;
  UPDATE outreach_preference_tokens SET revoked_at=now() WHERE contact_id=c.id AND id<>t.id AND used_at IS NULL AND revoked_at IS NULL;
  INSERT INTO outreach_events(contact_id,kind,source,details) VALUES(c.id,'confirm_resubscribe','website',jsonb_build_object('token_id',t.id,'consent_text','I''d like to receive wholesale product updates from RealismThrift. I can unsubscribe at any time.'));
  RETURN jsonb_build_object('status','confirmed');
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_record_inbound(p_contact uuid, p_provider_key text, p_kind text, p_details jsonb DEFAULT '{}') RETURNS void
LANGUAGE plpgsql AS $$
DECLARE c outreach_contacts;
BEGIN
  IF p_kind NOT IN ('reply','auto_reply','unsubscribe','hard_bounce','complaint') THEN RAISE EXCEPTION 'invalid_inbound_kind'; END IF;
  SELECT * INTO c FROM outreach_contacts WHERE id=p_contact FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown_contact'; END IF;
  INSERT INTO outreach_events(contact_id,kind,source,provider_key,details) VALUES(c.id,p_kind,'gmail',p_provider_key,p_details) ON CONFLICT(provider_key) DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;
  IF p_kind='unsubscribe' THEN PERFORM outreach_apply_unsubscribe(c.id,'gmail');
  ELSIF p_kind IN ('hard_bounce','complaint') THEN
    UPDATE outreach_contacts SET safety_block=p_kind,updated_at=now() WHERE id=c.id;
    UPDATE outreach_messages SET status='cancelled',updated_at=now() WHERE contact_id=c.id AND purpose='cold_marketing' AND status='draft';
  ELSIF p_kind='reply' THEN
    UPDATE outreach_contacts SET conversation_paused=true,updated_at=now() WHERE id=c.id;
  END IF;
END $$;
--> statement-breakpoint
CREATE FUNCTION outreach_claim_send(p_message uuid, p_fingerprint text, p_version integer) RETURNS jsonb LANGUAGE plpgsql AS $$
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
    IF c.marketing_status<>'eligible' OR c.conversation_paused OR nullif(trim(c.eligibility_note),'') IS NULL THEN RETURN jsonb_build_object('status','blocked'); END IF;
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
REVOKE ALL ON FUNCTION outreach_apply_unsubscribe(uuid,text), outreach_unsubscribe(text,text), outreach_request_resubscribe(text,text,text,text), outreach_preview_confirmation(text), outreach_confirm_resubscribe(text), outreach_record_inbound(uuid,text,text,jsonb), outreach_claim_send(uuid,text,integer) FROM PUBLIC;
