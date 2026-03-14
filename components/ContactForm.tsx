"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { useI18n } from "@/locales/client";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useI18n();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white/90 px-5 py-2 font-semibold text-slate-900 transition hover:bg-white disabled:opacity-60"
    >
      {pending ? t("contactForm.sending") : t("contactForm.submit")}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const t = useI18n();

  return (
    <form action={formAction} className="mt-4 grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          {t("contactForm.nameLabel")}
          <input
            name="name"
            required
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          {t("contactForm.emailLabel")}
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-slate-300">
        {t("contactForm.messageLabel")}
        <textarea
          name="message"
          rows={4}
          required
          className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
        />
      </label>
      <label className="sr-only">
        {t("contactForm.companyLabel")}
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <span className="text-sm text-slate-400">{t("contactForm.or")}</span>
        <a
          href={`mailto:${t("cta.email")}`}
          className="text-sm text-slate-200 underline underline-offset-4"
        >
          {t("contactForm.mailto")}
        </a>
      </div>
      {state.status !== "idle" ? (
        <p
          className={
            state.status === "success"
              ? "text-sm text-emerald-300"
              : "text-sm text-rose-300"
          }
        >
          {state.status === "success"
            ? t("contactForm.success")
            : state.error === "spam"
              ? t("contactForm.errorSpam")
              : state.error === "rate"
                ? t("contactForm.errorRate")
              : state.error === "invalid"
                ? t("contactForm.errorInvalid")
                : state.error === "send"
                  ? t("contactForm.errorSend")
                  : state.error === "fallback"
                    ? t("contactForm.errorFallback")
                  : t("contactForm.errorMissing")}
        </p>
      ) : null}
    </form>
  );
}
