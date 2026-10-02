import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { neon } from "@neondatabase/serverless";
for (const path of [".env.local", ".env.outreach.local"]) {
  try { process.loadEnvFile(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
}
const connection = process.env.OUTREACH_DATABASE_URL_UNPOOLED;
if (!connection) throw new Error("Configure a dedicated Neon test branch first.");
if (process.env.OUTREACH_DATABASE_TEST_ALLOWED !== "true") throw new Error("Set OUTREACH_DATABASE_TEST_ALLOWED=true only for an isolated test branch.");
const database = neon(connection);
const tag = randomUUID();
const assertions = `DO $$
DECLARE c uuid; d uuid; token text; v integer; state jsonb; hash1 text:=repeat('a',64); hash2 text:=repeat('b',64); hash3 text:=repeat('c',64); cnt integer;
BEGIN
  c:=outreach_import_contact('verify-${tag}@example.invalid','database_test');
  IF (SELECT marketing_status FROM outreach_contacts WHERE id=c)<>'held' THEN RAISE EXCEPTION 'import_must_be_held'; END IF;
  IF (SELECT eligibility_note FROM outreach_contacts WHERE id=c) IS NOT NULL THEN RAISE EXCEPTION 'review_should_not_be_required'; END IF;
  state:=outreach_prepare_message(c); d:=(state->>'outreach_id')::uuid;
  PERFORM outreach_attach_draft(d,'fixture_draft');
  SELECT unsubscribe_token INTO token FROM outreach_contacts WHERE id=c;
  IF NOT outreach_unsubscribe(token,'test') THEN RAISE EXCEPTION 'unsubscribe_failed'; END IF;
  IF (SELECT status FROM outreach_messages WHERE id=d)<>'cancelled' THEN RAISE EXCEPTION 'old_draft_not_cancelled'; END IF;
  SELECT preference_version INTO v FROM outreach_contacts WHERE id=c;
  PERFORM outreach_unsubscribe(token,'test');
  IF (SELECT preference_version FROM outreach_contacts WHERE id=c)<>v THEN RAISE EXCEPTION 'unsubscribe_not_idempotent'; END IF;
  PERFORM outreach_import_contact('verify-${tag}@example.invalid','second_import');
  IF outreach_review_contact(c,'Cannot override unsubscribe') THEN RAISE EXCEPTION 'import_or_review_overrode_unsubscribe'; END IF;
  state:=outreach_request_resubscribe('verify-${tag}@example.invalid','${tag}-email','${tag}-ip',hash1);
  IF state->>'email' IS NULL THEN RAISE EXCEPTION 'confirmation_not_requested'; END IF;
  IF outreach_preview_confirmation(hash1)->>'status'<>'ready' THEN RAISE EXCEPTION 'preview_failed'; END IF;
  IF (SELECT marketing_status FROM outreach_contacts WHERE id=c)<>'unsubscribed' THEN RAISE EXCEPTION 'preview_resubscribed'; END IF;
  IF outreach_confirm_resubscribe(hash1)->>'status'<>'confirmed' THEN RAISE EXCEPTION 'confirm_failed'; END IF;
  IF outreach_confirm_resubscribe(hash1)->>'status'<>'already_confirmed' THEN RAISE EXCEPTION 'confirm_not_idempotent'; END IF;
  IF (SELECT status FROM outreach_messages WHERE id=d)<>'cancelled' THEN RAISE EXCEPTION 'confirmation_revived_draft'; END IF;
  state:=outreach_request_resubscribe('verify-${tag}@example.invalid','${tag}-email','${tag}-ip',hash2);
  IF state ? 'email' THEN RAISE EXCEPTION 'email_cooldown_failed'; END IF;
  UPDATE outreach_events SET created_at=now()-interval '2 hours' WHERE kind='request_email' AND rate_key='${tag}-email';
  PERFORM outreach_request_resubscribe('verify-${tag}@example.invalid','${tag}-email','${tag}-ip',hash2);
  PERFORM outreach_unsubscribe(token,'test');
  IF outreach_confirm_resubscribe(hash2)->>'status'<>'changed' THEN RAISE EXCEPTION 'new_unsubscribe_was_overridden'; END IF;
  UPDATE outreach_events SET created_at=now()-interval '2 hours' WHERE kind='request_email' AND rate_key='${tag}-email';
  PERFORM outreach_request_resubscribe('verify-${tag}@example.invalid','${tag}-email','${tag}-ip',hash3);
  PERFORM outreach_record_inbound(c,'test-${tag}-complaint','complaint');
  IF outreach_confirm_resubscribe(hash3)->>'status'<>'unavailable' THEN RAISE EXCEPTION 'confirmation_cleared_block'; END IF;
  SELECT count(*) INTO cnt FROM outreach_preference_tokens WHERE contact_id=c;
  PERFORM outreach_request_resubscribe('verify-${tag}@example.invalid','${tag}-fresh','${tag}-fresh-ip',repeat('d',64));
  IF (SELECT count(*) FROM outreach_preference_tokens WHERE contact_id=c)<>cnt THEN RAISE EXCEPTION 'blocked_contact_issued_token'; END IF;
  state:=outreach_request_resubscribe('unknown-${tag}@example.invalid','${tag}-unknown','${tag}-unknown-ip',repeat('e',64));
  IF state->>'status'<>'accepted' OR state ? 'email' THEN RAISE EXCEPTION 'unknown_contact_not_generic'; END IF;
  FOR cnt IN 1..5 LOOP
    state:=outreach_request_resubscribe('unknown-${tag}@example.invalid','${tag}-limit-'||cnt,'${tag}-limit-ip',repeat('e',64));
    IF state->>'status'<>'accepted' THEN RAISE EXCEPTION 'early_ip_limit'; END IF;
  END LOOP;
  state:=outreach_request_resubscribe('unknown-${tag}@example.invalid','${tag}-limit-6','${tag}-limit-ip',repeat('e',64));
  IF state->>'status'<>'rate_limited' THEN RAISE EXCEPTION 'ip_limit_failed'; END IF;
END $$`;
try {
  // The explicit final ROLLBACK discards every fixture in these preference assertions.
  await database.transaction([database.query(assertions), database.query("ROLLBACK")]);
  const remaining = await database`select count(*)::integer as count from outreach_contacts where email=${`verify-${tag}@example.invalid`}`;
  assert.equal(remaining[0].count, 0);
  console.log("Database preference assertions passed; fixtures rolled back.");

  // Concurrent calls need committed shared fixtures; use an unreachable address and a separate sender.
  const recipient = `quota-${tag}@example.invalid`;
  const sender = `quota-${tag}@example.invalid`;
  const imported = await database`select outreach_import_contact(${recipient},'database_concurrency_test') as id`;
  const contact = imported[0].id;
  // Unreviewed imports can occupy quota; no review note is required.
  const prepared = await database`insert into outreach_messages(contact_id,purpose,sender,draft_id) select ${contact}::uuid,'cold_marketing',${sender},'fixture_'||n from generate_series(1,55) n returning id`;
  const version = (await database`select preference_version from outreach_contacts where id=${contact}::uuid`)[0].preference_version;
  const claims = await Promise.all(prepared.map(message => database`select outreach_claim_send(${message.id}::uuid,${"f".repeat(64)},${version}) as result`));
  assert.equal(claims.filter(rows => rows[0].result.status === "claimed").length, 50);
  assert.equal(claims.filter(rows => rows[0].result.status === "daily_limit").length, 5);
  const duplicate = await database`select outreach_claim_send(${prepared[0].id}::uuid,${"f".repeat(64)},${version}) as result`;
  assert.notEqual(duplicate[0].result.status, "claimed");
  console.log("55 concurrent claims: exactly 50 reserved; duplicate claim refused. Concurrency fixtures remain only in the test branch under example.invalid.");
} catch (error) {
  console.error("Database verification failed", { name: error.name, code: error.code, message: String(error.message).replace(/postgres(?:ql)?:\/\/[^\s]+/g, "[redacted]") });
  process.exitCode = 1;
}
