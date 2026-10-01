"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Utility pages require full navigation across the analytics boundary. */

import { useEffect, useState, type FormEvent } from "react";
import { CONSENT_TEXT } from "@/lib/outreach/config";

type Mode = "unsubscribe" | "request_resubscribe" | "confirm_resubscribe";
type Result = { status: string; email?: string; code?: string };
const buttonClass = "mt-6 w-full rounded-lg bg-[#1a1a1a] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#333] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red disabled:cursor-wait disabled:opacity-60";
const headingClass = "mb-4 font-montserrat text-2xl font-bold tracking-tight text-brand-dark";

async function preferencesRequest(body: Record<string, unknown>): Promise<Result> {
  const response = await fetch("/api/email-preferences", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), cache: "no-store",
  });
  const result = await response.json();
  if (result.code === "invalid_link") return { status: "invalid_unsubscribe" };
  if (!response.ok) throw new Error(result.code === "rate_limited" ? "Please wait a few minutes before trying again." : "We couldn't update your preferences right now. Please try again shortly.");
  return result;
}

export function PreferencesForm({ mode, token: suppliedToken = "" }: { mode: Mode; token?: string }) {
  const [token, setToken] = useState(suppliedToken);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [preview, setPreview] = useState<Result | null>(null);
  const [previewAttempt, setPreviewAttempt] = useState(0);

  useEffect(() => {
    if (mode !== "confirm_resubscribe") return;
    let cancelled = false;
    const fragmentToken = new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    preferencesRequest({ action: "preview_confirmation", token: fragmentToken })
      .then(value => { if (!cancelled) { setPreview(value); setToken(fragmentToken); } })
      .catch(failure => { if (!cancelled) setError(failure.message); });
    return () => { cancelled = true; };
  }, [mode, previewAttempt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const value = await preferencesRequest({ action: mode, token, email, consent });
      setResult(value);
      if (mode === "confirm_resubscribe" && value.status === "confirmed") {
        window.history.replaceState(null, "", window.location.pathname);
        setToken("");
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Please try again shortly.");
    } finally { setBusy(false); }
  }

  const current = result || preview;
  if (current?.status === "unsubscribed") return (
    <div role="status">
      <h1 className={headingClass}>You&apos;re unsubscribed</h1>
      <p className="leading-7 text-[#575750]">You won&apos;t receive further marketing emails from RealismThrift. We can still reply when you contact us with a question.</p>
      <p className="mt-7"><a className="text-sm underline underline-offset-4" href="/">Back to our website</a></p>
      <p className="mt-3"><a className="text-sm text-[#686862] underline underline-offset-4" href="/email-preferences/resubscribe">Update email preferences</a></p>
    </div>
  );
  if (current?.status === "confirmed" || current?.status === "already_confirmed") return (
    <div role="status">
      <h1 className={headingClass}>Preference confirmed</h1>
      <p className="leading-7 text-[#575750]">You&apos;ve confirmed that you&apos;d like to receive wholesale updates from RealismThrift. You can unsubscribe at any time.</p>
      <p className="mt-7"><a className="text-sm underline underline-offset-4" href="/">Back to our website</a></p>
    </div>
  );
  if (current?.status === "accepted") return (
    <div role="status">
      <h1 className={headingClass}>Check your inbox</h1>
      <p className="leading-7 text-[#575750]">If we can update preferences for this address, you&apos;ll receive a confirmation email. Please check your inbox and spam folder.</p>
      <p className="mt-4 text-sm leading-6 text-[#686862]">The link is valid for 24 hours. If it doesn&apos;t arrive, you can request another after an hour.</p>
      <a className="mt-6 inline-block text-sm underline underline-offset-4" href="/email-preferences/resubscribe">Request another link</a>
    </div>
  );
  if (current && ["expired", "invalid", "changed", "unavailable", "invalid_unsubscribe"].includes(current.status)) return (
    <div role="status">
      <h1 className={headingClass}>{current.status === "unavailable" ? "Unable to update preferences" : "This link is no longer available"}</h1>
      <p className="leading-7 text-[#575750]">{current.status === "unavailable" ? "Please contact us if you need help with your email preferences." : current.status === "invalid_unsubscribe" ? "Open the original unsubscribe link from your email, or contact us to stop marketing emails." : "Your preferences haven't changed. Open the original link from your email, or request a new confirmation link."}</p>
      {["unavailable", "invalid_unsubscribe"].includes(current.status) ? <a className="mt-6 inline-block text-sm underline" href="mailto:sales@realismthrift.com?subject=Email%20preferences">Contact us</a> : <a className="mt-6 inline-block text-sm underline" href="/email-preferences/resubscribe">Request a new link</a>}
    </div>
  );
  return (
    <form onSubmit={submit}>
      <h1 className={headingClass}>{mode === "unsubscribe" ? "Email preferences" : mode === "request_resubscribe" ? "Receive wholesale updates" : "Confirm your email preference"}</h1>
      <p className="mb-6 leading-7 text-[#575750]">{mode === "unsubscribe" ? "Use the button below to stop marketing emails from RealismThrift." : mode === "request_resubscribe" ? "We'll email you a link to confirm your choice." : preview?.status === "ready" ? `Confirm that you'd like to receive wholesale updates at ${preview.email}.` : "Checking your confirmation link…"}</p>
      {mode === "request_resubscribe" ? (
        <>
          <label className="mb-2 block text-sm font-bold" htmlFor="preference-email">Email address</label>
          <input className="w-full rounded-lg border border-[#d6d6cf] px-3 py-3 text-base focus:outline-2 focus:outline-brand-dark" id="preference-email" type="email" name="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} required />
          <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-[#575750]">
            <input className="mt-1 h-4 w-4 shrink-0 accent-[#1a1a1a]" type="checkbox" name="consent" checked={consent} onChange={event => setConsent(event.target.checked)} required />
            <span>{CONSENT_TEXT}</span>
          </label>
        </>
      ) : null}
      {error ? <p role="alert" className="mt-5 text-sm leading-6 text-brand-red">{error}</p> : null}
      {mode === "confirm_resubscribe" && !preview ? (
        error ? <button type="button" className={buttonClass} onClick={() => { setError(""); setPreviewAttempt(value => value + 1); }}>Try again</button> : <p className="text-sm text-[#686862]" role="status">Please wait a moment.</p>
      ) : <button className={buttonClass} type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "unsubscribe" ? "Unsubscribe" : mode === "request_resubscribe" ? "Send confirmation email" : "Confirm subscription"}</button>}
      {mode === "request_resubscribe" ? <p className="mt-5 text-sm text-[#686862]">You can unsubscribe at any time. <a className="underline" href="/privacy-policy">Privacy policy</a></p> : null}
    </form>
  );
}
