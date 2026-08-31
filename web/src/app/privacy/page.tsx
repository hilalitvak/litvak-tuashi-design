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
    <LegalPage title="מדיניות פרטיות" updated="30 באוגוסט 2026">
      <LegalSection heading="מי אנחנו">
        <p>
          {STUDIO_NAME_FULL} (להלן &quot;אנחנו&quot;) מפעילה את האתר הזה ואת
          פורטל הלקוחות שבו. המסמך מסביר איזה מידע אנחנו אוספים, למה, ומה
          הזכויות שלכם לגביו.
        </p>
        <p>
          לכל שאלה בנושא פרטיות אפשר לפנות אלינו במייל{" "}
          <a href={`mailto:${contact.emails[0].address}`}>{contact.emails[0].address}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="איזה מידע אנחנו אוספים">
        <p>
          <strong>מטופס יצירת הקשר.</strong> שם מלא, כתובת אימייל, ובאופן
          אופציונלי מספר טלפון, נושא ותוכן ההודעה — רק מה שאתם בוחרים למלא.
        </p>
        <p>
          <strong>מהתחברות לפורטל.</strong> כשאתם נכנסים באמצעות חשבון Google,
          אנחנו מקבלים מגוגל את השם, כתובת האימייל ותמונת הפרופיל. איננו מקבלים
          את הסיסמה שלכם ואין לנו גישה לתוכן חשבון הגוגל — לא למיילים, לא ליומן
          ולא לקבצים.
        </p>
        <p>
          <strong>בתוך הפורטל.</strong> פרטי הפרויקט שלכם, קבצים שאתם מעלים,
          ופריטי השראה שאתם מוסיפים.
        </p>
        <p>
          איננו משתמשים בכלי מעקב או פרסום, ואיננו יוצרים פרופיל התנהגותי של
          מבקרים באתר.
        </p>
      </LegalSection>

      <LegalSection heading="למה אנחנו משתמשים בו">
        <ul>
          <li>כדי לחזור אליכם בעקבות פנייה שיזמתם</li>
          <li>כדי לנהל את הפרויקט שלכם ולתקשר אתכם במהלכו</li>
          <li>כדי לזהות אתכם בכניסה לפורטל ולהציג לכם את הפרויקט הנכון</li>
        </ul>
        <p>
          איננו מוכרים מידע אישי, ואיננו מעבירים אותו לצדדים שלישיים למטרות
          שיווק.
        </p>
      </LegalSection>

      <LegalSection heading="עוגיות">
        <p>
          האתר משתמש בעוגייה אחת בלבד, והיא נוצרת רק אם אתם מתחברים לפורטל —
          מטרתה לזכור שאתם מחוברים בין עמוד לעמוד. אין באתר עוגיות פרסום, מעקב
          או אנליטיקה.
        </p>
      </LegalSection>

      <LegalSection heading="היכן המידע נשמר">
        <p>
          המידע מאוחסן אצל <a href="https://supabase.com">Supabase</a> בשרתים
          בתוך האיחוד האירופי, והאתר מתארח אצל{" "}
          <a href="https://vercel.com">Vercel</a>. שני הספקים פועלים עבורנו
          בלבד וכפופים להתחייבויות אבטחה ופרטיות.
        </p>
        <p>
          הגישה למידע מוגבלת: לקוח רואה אך ורק את הפרויקט שלו. ההפרדה נאכפת
          ברמת בסיס הנתונים עצמו, לא רק בממשק.
        </p>
      </LegalSection>

      <LegalSection heading="כמה זמן אנחנו שומרים">
        <p>
          פניות מטופס יצירת הקשר נשמרות כל עוד הן רלוונטיות למעקב אחר הפנייה.
          חומרי פרויקט נשמרים לאורך חיי הפרויקט ולתקופה סבירה אחריו, לצורכי
          תיעוד ואחריות מקצועית. אפשר לבקש מחיקה מוקדמת בכל עת.
        </p>
      </LegalSection>

      <LegalSection heading="הזכויות שלכם">
        <p>אתם רשאים לבקש מאיתנו בכל עת:</p>
        <ul>
          <li>לעיין במידע שיש לנו עליכם</li>
          <li>לתקן מידע שגוי או לא מעודכן</li>
          <li>למחוק את המידע ואת חשבון הפורטל שלכם</li>
          <li>לקבל עותק של הקבצים שהעליתם</li>
        </ul>
        <p>
          פנייה במייל אל{" "}
          <a href={`mailto:${contact.emails[0].address}`}>{contact.emails[0].address}</a> תיענה
          תוך זמן סביר.
        </p>
      </LegalSection>

      <LegalSection heading="קטינים">
        <p>
          האתר והפורטל מיועדים לבגירים. איננו אוספים ביודעין מידע על ילדים מתחת
          לגיל 18.
        </p>
      </LegalSection>

      <LegalSection heading="שינויים במדיניות">
        <p>
          אם נעדכן את המדיניות, נשנה את תאריך העדכון בראש העמוד. שינוי מהותי
          יובא לידיעת משתמשי הפורטל הרשומים.
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
