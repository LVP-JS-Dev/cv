"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { status: "idle" };

type ContactFormStrings = Readonly<{
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submit: string;
  sending: string;
  or: string;
  mailto: string;
  emailAddress: string;
  success: string;
  errorSpam: string;
  errorRate: string;
  errorInvalid: string;
  errorSend: string;
  errorFallback: string;
  errorMissing: string;
}>;

type ContactFormProps = Readonly<{
  strings: ContactFormStrings;
}>;

/**
 * Submit button that reflects pending form state.
 */
function SubmitButton({ strings }: ContactFormProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white/90 px-5 py-2 font-semibold text-slate-900 transition hover:bg-white disabled:opacity-60"
    >
      {pending ? strings.sending : strings.submit}
    </button>
  );
}

/**
 * Email contact form wired to the submitContact action.
 */
export default function ContactForm({ strings }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="mt-4 grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          {strings.nameLabel}
          <input
            name="name"
            required
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          {strings.emailLabel}
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-slate-300">
        {strings.messageLabel}
        <textarea
          name="message"
          rows={4}
          required
          className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
        />
      </label>
      <div aria-hidden="true" className="hidden">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton strings={strings} />
        <span className="text-sm text-slate-400">{strings.or}</span>
        <a
          href={`mailto:${strings.emailAddress}`}
          className="text-sm text-slate-200 underline underline-offset-4"
        >
          {strings.mailto}
        </a>
      </div>
      {state.status !== "idle" ? (
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={
            state.status === "success"
              ? "text-sm text-emerald-300"
              : "text-sm text-rose-300"
          }
        >
          {state.status === "success"
            ? strings.success
            : state.error === "spam"
              ? strings.errorSpam
              : state.error === "rate"
                ? strings.errorRate
              : state.error === "invalid"
                ? strings.errorInvalid
                : state.error === "send"
                  ? strings.errorSend
                  : state.error === "fallback"
                    ? strings.errorFallback
                    : strings.errorMissing}
        </p>
      ) : null}
    </form>
  );
}
