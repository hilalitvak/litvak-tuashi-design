"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createProject, type ActionState } from "./actions";

const field =
  "w-full rounded-sm border border-rule bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brass";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-ink px-6 py-2.5 text-sm text-canvas transition-colors hover:bg-brass disabled:opacity-60"
    >
      {pending ? "יוצר…" : "צור פרויקט"}
    </button>
  );
}

export function NewProjectForm() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<ActionState, FormData>(
    createProject,
    {}
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm border border-rule px-5 py-2.5 text-sm text-ink transition-colors hover:border-brass hover:text-brass"
      >
        + פרויקט חדש
      </button>
    );
  }

  return (
    <form
      action={action}
      className="rounded-sm border border-rule bg-panel p-6"
    >
      <h2 className="font-display text-lg text-ink">פרויקט חדש</h2>
      <p className="mt-1 text-xs text-ink-soft">
        שבע ספריות ייווצרו לו אוטומטית, כולל תיבת העלאות ללקוח.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs text-ink-soft">
            שם הפרויקט <span className="text-brass">*</span>
          </label>
          <input id="title" name="title" required maxLength={200} className={field} />
        </div>
        <div>
          <label
            htmlFor="client_name"
            className="mb-1.5 block text-xs text-ink-soft"
          >
            שם הלקוח
          </label>
          <input id="client_name" name="client_name" maxLength={200} className={field} />
        </div>
        <div>
          <label
            htmlFor="location"
            className="mb-1.5 block text-xs text-ink-soft"
          >
            מיקום
          </label>
          <input id="location" name="location" maxLength={200} className={field} />
        </div>
      </div>

      {(state.error || state.ok) && (
        <p
          role="status"
          className={`mt-4 text-sm ${state.error ? "text-red-400" : "text-brass"}`}
        >
          {state.error ?? state.ok}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <Submit />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-ink-soft transition-colors hover:text-ink"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
