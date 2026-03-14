"use server";

import { headers } from "next/headers";

export type ContactState = {
  status: "idle" | "success" | "error";
  error?: "spam" | "missing" | "invalid" | "rate" | "send" | "fallback";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function normalize(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

async function getClientId() {
  const headerList = await headers();
  const header = headerList.get("x-forwarded-for") ?? "";
  const ip = header.split(",")[0]?.trim();
  return ip || "unknown";
}

function isRateLimited(clientId: string) {
  const now = Date.now();
  const entry = rateLimit.get(clientId);

  if (!entry || entry.resetAt < now) {
    rateLimit.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  rateLimit.set(clientId, entry);
  return false;
}

/**
 * Validates form data, enforces rate limits, and sends a contact email via Resend.
 */
export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = normalize(formData.get("name"));
  const email = normalize(formData.get("email"));
  const message = normalize(formData.get("message"));
  const honeypot = normalize(formData.get("company"));

  if (honeypot) {
    return { status: "error", error: "spam" };
  }

  if (isRateLimited(await getClientId())) {
    return { status: "error", error: "rate" };
  }

  if (!name || !email || !message) {
    return { status: "error", error: "missing" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", error: "invalid" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO;
  if (!apiKey || !contactTo) {
    return { status: "error", error: "fallback" };
  }

  const contactFrom =
    process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFrom,
        to: contactTo,
        subject: `Portfolio contact: ${name}`,
        reply_to: email,
        text: message,
      }),
    });
  } catch {
    return { status: "error", error: "send" };
  }

  if (!response.ok) {
    return { status: "error", error: "send" };
  }

  return { status: "success" };
}
