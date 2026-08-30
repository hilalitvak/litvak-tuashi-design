"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

const field =
  "w-full rounded-sm border border-ink-line bg-ink px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream-dim/60 focus:border-sand";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-cream px-8 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "שולח…" : "שלחו הודעה"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm text-cream">
            שם מלא <span className="text-sand">*</span>
          </label>
          <input id="full_name" name="full_name" required maxLength={120} className={field} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-cream">
            כתובת אימייל <span className="text-sand">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            dir="ltr"
            className={`${field} text-right`}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm text-cream">
            מספר טלפון
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            dir="ltr"
            className={`${field} text-right`}
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm text-cream">
            נושא
          </label>
          <input id="subject" name="subject" maxLength={200} className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-cream">
          הודעה <span className="text-sand">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          className={`${field} resize-y`}
        />
      </div>

      {state.status !== "idle" && state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-sm border px-4 py-3 text-sm ${
            state.status === "success"
              ? "border-sand/50 text-sand"
              : "border-red-500/50 text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
