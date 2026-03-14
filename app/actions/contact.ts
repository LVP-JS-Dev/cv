"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  error?: "spam" | "missing" | "invalid";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

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

  if (!name || !email || !message) {
    return { status: "error", error: "missing" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", error: "invalid" };
  }

  return { status: "success" };
}
