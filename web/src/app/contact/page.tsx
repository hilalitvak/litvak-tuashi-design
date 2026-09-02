import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { img } from "@/lib/images";
import { banners, contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "פנו אלינו לדיון בפרויקט שלכם או לקביעת פגישת ייעוץ — ליטבק-טואשי עיצוב פנים.",
};

export default function ContactPage() {
  return (
    // עמוד אחד, מסך אחד. הוואטסאפ במרכז כי זו הפנייה שבאמת קורית;
    // הטלפון והמייל מתחתיו למי שמעדיף, והמיקום בשוליים.
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      <Image
        src={img(banners.contact)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* שכבה כהה וכבדה — הרקע הוא אווירה, לא נושא. */}
      <div className="absolute inset-0 bg-ink/85" />

      <div className="relative mx-auto w-full max-w-xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-4xl font-light text-cream sm:text-5xl">
          דברו איתנו
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-cream-dim">
          הדרך המהירה ביותר להגיע אלינו. בחרו למי לפנות ונחזור אליכם בהקדם.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {contact.phones.map((phone) => (
            <WhatsAppButton
              key={phone.href}
              number={phone.whatsapp}
              owner={phone.owner}
              size="large"
            />
          ))}
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {contact.phones.map((phone) => {
            const email = contact.emails.find((e) => e.owner === phone.owner);
            return (
              <div key={phone.href}>
                <p className="text-xs tracking-widest text-sand">
                  {phone.owner}
                </p>
                <a
                  href={`tel:${phone.href}`}
                  className="mt-2 block text-sm text-cream-dim transition-colors hover:text-cream"
                  dir="ltr"
                >
                  {phone.display}
                </a>
                {email && (
                  <a
                    href={`mailto:${email.address}`}
                    className="mt-1 block text-sm text-cream-dim transition-colors hover:text-cream"
                    dir="ltr"
                  >
                    {email.address}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-14 text-sm text-cream-dim/70">
          {contact.address.join(", ")}
        </p>
      </div>
    </section>
  );
}
