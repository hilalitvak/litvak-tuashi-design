import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { contact } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "פנו אלינו לדיון בפרויקט שלכם או לקביעת פגישת ייעוץ — ליטבק-טואשי עיצוב פנים.",
};

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-ink-line pt-20">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
          <h1 className="font-display text-4xl font-light text-cream sm:text-5xl">
            צרו קשר
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream-dim">
            נשמח לשמוע מכם. פנו אלינו לדיון בפרויקט שלכם או לקביעת פגישת ייעוץ.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display text-2xl font-light text-cream">
              הישארו בקשר
            </h2>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-xs tracking-widest text-sand">
                  הסטודיו שלנו
                </h3>
                <address className="mt-2 not-italic leading-relaxed text-cream-dim">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <div>
                <h3 className="text-xs tracking-widest text-sand">טלפון</h3>
                <ul className="mt-2 space-y-3">
                  {contact.phones.map((phone) => (
                    <li key={phone.href}>
                      <span className="block text-xs text-cream-dim/70">
                        {phone.owner}
                      </span>
                      <a
                        href={`tel:${phone.href}`}
                        className="block text-cream-dim transition-colors hover:text-cream"
                        dir="ltr"
                      >
                        <span className="block text-right">
                          {phone.display}
                        </span>
                      </a>
                      <a
                        href={`https://wa.me/${phone.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-sm border border-ink-line px-4 py-2 text-sm text-cream-dim transition-colors hover:border-sand hover:text-cream"
                      >
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5c0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
                          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9z" />
                        </svg>
                        וואטסאפ עם {phone.owner}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs tracking-widest text-sand">אימייל</h3>
                <ul className="mt-2 space-y-2">
                  {contact.emails.map((email) => (
                    <li key={email.address}>
                      <span className="block text-xs text-cream-dim/70">
                        {email.owner}
                      </span>
                      <a
                        href={`mailto:${email.address}`}
                        className="text-cream-dim transition-colors hover:text-cream"
                        dir="ltr"
                      >
                        <span className="block text-right">
                          {email.address}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs tracking-widest text-sand">
                  שעות פעילות
                </h3>
                <dl className="mt-2 space-y-1 text-cream-dim">
                  {contact.hours.map((row) => (
                    <div key={row.days} className="flex gap-2">
                      <dt>{row.days}:</dt>
                      <dd>{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-ink-line bg-ink-soft p-7 sm:p-9">
            <h2 className="font-display text-2xl font-light text-cream">
              שלחו לנו הודעה
            </h2>
            <p className="mt-2 text-sm text-cream-dim">
              מלאו את הטופס ונחזור אליכם בהקדם האפשרי.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
