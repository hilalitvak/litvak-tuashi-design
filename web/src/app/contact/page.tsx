import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { contact } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "פנו אלינו לדיון בפרויקט שלכם או לקביעת פגישת ייעוץ — ליטבק-תואשי עיצוב פנים.",
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
                <ul className="mt-2 space-y-1" dir="ltr">
                  {contact.phones.map((phone) => (
                    <li key={phone.href} className="text-right">
                      <a
                        href={`tel:${phone.href}`}
                        className="text-cream-dim transition-colors hover:text-cream"
                      >
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs tracking-widest text-sand">אימייל</h3>
                <ul className="mt-2 space-y-1">
                  {contact.emails.map((email) => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        className="text-cream-dim transition-colors hover:text-cream"
                      >
                        {email}
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
