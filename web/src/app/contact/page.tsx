import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { contact } from "@/lib/site";

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
        <div className="grid gap-14 lg:grid-cols-2">
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
                <ul className="mt-2 space-y-2">
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
                        className="block text-cream-dim transition-colors hover:text-cream"
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

          {/* במקום טופס — פנייה ישירה בוואטסאפ, שמגיעה מיד ולא לתיבת דואר. */}
          <div className="rounded-sm border border-ink-line bg-ink-soft p-7 sm:p-9">
            <h2 className="font-display text-2xl font-light text-cream">
              דברו איתנו בוואטסאפ
            </h2>
            <p className="mt-3 leading-relaxed text-cream-dim">
              הדרך המהירה ביותר להגיע אלינו. בחרו למי לפנות ונחזור אליכם בהקדם.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {contact.phones.map((phone) => (
                <WhatsAppButton
                  key={phone.href}
                  number={phone.whatsapp}
                  owner={phone.owner}
                  size="large"
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
