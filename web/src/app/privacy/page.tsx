import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal";
import { STUDIO_NAME_FULL, contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: `כיצד ${STUDIO_NAME_FULL} אוספת, משתמשת ושומרת על המידע שלכם.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="מדיניות פרטיות" updated="14 בנובמבר 2026">
      <LegalSection heading="מי אנחנו">
        <p>
          {STUDIO_NAME_FULL} (להלן &quot;אנחנו&quot;) מפעילה את האתר הזה. המסמך
          מסביר איזה מידע נאסף כשאתם גולשים בו או פונים אלינו, ומה הזכויות שלכם
          לגביו.
        </p>
        <p>
          לכל שאלה בנושא פרטיות אפשר לפנות אלינו במייל{" "}
          <a href={`mailto:${contact.emails[0].address}`}>{contact.emails[0].address}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="איזה מידע נאסף">
        <p>
          <strong>האתר עצמו לא אוסף מידע אישי.</strong> אין בו טפסים, אין
          הרשמה ואין התחברות.
        </p>
        <p>
          <strong>כשאתם פונים אלינו.</strong> פנייה בוואטסאפ, בטלפון או במייל
          מגיעה אלינו דרך השירות שבחרתם, יחד עם מה שבחרתם לשתף — למשל שם, מספר
          טלפון ותוכן ההודעה. השירותים האלה כפופים למדיניות הפרטיות שלהם.
        </p>
        <p>
          <strong>יומני שרת.</strong> ספק האירוח של האתר רושם, כמו כל אתר,
          נתונים טכניים על בקשות — כמו כתובת IP, סוג הדפדפן והעמוד שנצפה —
          לצורכי אבטחה ותפעול.
        </p>
        <p>
          איננו משתמשים בכלי מעקב, פרסום או אנליטיקה, ואיננו יוצרים פרופיל
          התנהגותי של מבקרים באתר.
        </p>
      </LegalSection>

      <LegalSection heading="למה אנחנו משתמשים בו">
        <ul>
          <li>כדי לחזור אליכם בעקבות פנייה שיזמתם</li>
          <li>כדי לנהל את הפרויקט שלכם ולתקשר אתכם במהלכו, אם תתקשרו אתנו</li>
        </ul>
        <p>
          איננו מוכרים מידע אישי, ואיננו מעבירים אותו לצדדים שלישיים למטרות
          שיווק.
        </p>
      </LegalSection>

      <LegalSection heading="עוגיות">
        <p>האתר אינו משתמש בעוגיות.</p>
      </LegalSection>

      <LegalSection heading="היכן המידע נשמר">
        <p>
          האתר מתארח אצל <a href="https://vercel.com">Vercel</a>, ותמונות
          ופרטי הפרויקטים שבתיק העבודות נשמרים אצל{" "}
          <a href="https://supabase.com">Supabase</a>. אצל Supabase לא נשמר
          מידע על מבקרי האתר.
        </p>
      </LegalSection>

      <LegalSection heading="כמה זמן אנחנו שומרים">
        <p>
          פניות נשמרות כל עוד הן רלוונטיות למעקב אחריהן. חומרי פרויקט נשמרים
          לאורך חיי הפרויקט ולתקופה סבירה אחריו, לצורכי תיעוד ואחריות מקצועית.
          אפשר לבקש מחיקה מוקדמת בכל עת.
        </p>
      </LegalSection>

      <LegalSection heading="הזכויות שלכם">
        <p>אתם רשאים לבקש מאיתנו בכל עת:</p>
        <ul>
          <li>לעיין במידע שיש לנו עליכם</li>
          <li>לתקן מידע שגוי או לא מעודכן</li>
          <li>למחוק את המידע שלכם</li>
        </ul>
        <p>
          פנייה במייל אל{" "}
          <a href={`mailto:${contact.emails[0].address}`}>{contact.emails[0].address}</a> תיענה
          תוך זמן סביר.
        </p>
      </LegalSection>

      <LegalSection heading="קטינים">
        <p>
          האתר מיועד לבגירים. איננו אוספים ביודעין מידע על ילדים מתחת לגיל 18.
        </p>
      </LegalSection>

      <LegalSection heading="שינויים במדיניות">
        <p>
          אם נעדכן את המדיניות, נשנה את תאריך העדכון בראש העמוד.
        </p>
      </LegalSection>

      <LegalSection heading="יצירת קשר">
        <p>
          {STUDIO_NAME_FULL}, {contact.address.join(", ")}
          <br />
          <a href={`mailto:${contact.emails[0].address}`}>{contact.emails[0].address}</a>
          <br />
          <span dir="ltr">{contact.phones[0].display}</span>
        </p>
        <p>
          ראו גם את <Link href="/terms">תנאי השימוש</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
