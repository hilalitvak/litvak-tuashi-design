import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal";
import { STUDIO_NAME_FULL, contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: `התנאים לשימוש באתר ובפורטל הלקוחות של ${STUDIO_NAME_FULL}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="תנאי שימוש" updated="30 באוגוסט 2026">
      <LegalSection heading="כללי">
        <p>
          התנאים האלה חלים על השימוש באתר של {STUDIO_NAME_FULL} ובפורטל הלקוחות
          שבו. שימוש באתר מהווה הסכמה להם. אם אינכם מסכימים — אנא הימנעו משימוש.
        </p>
      </LegalSection>

      <LegalSection heading="מה האתר הזה">
        <p>
          האתר מציג את עבודות הסטודיו ומאפשר ליצור אתנו קשר. הפורטל הוא כלי
          עבודה ללקוחות פעילים, שדרכו אנחנו משתפים חומרי פרויקט ומקבלים מכם
          קבצים.
        </p>
        <p>
          התוכן באתר הוא מידע כללי על שירותינו ואינו מהווה הצעה מחייבת. תנאי
          התקשרות נקבעים בהסכם נפרד בכתב לכל פרויקט.
        </p>
      </LegalSection>

      <LegalSection heading="חשבון בפורטל">
        <p>
          גישה לפורטל ניתנת ללקוחות שאנחנו משייכים לפרויקט. אתם אחראים לשמור על
          חשבון הגוגל שדרכו אתם מתחברים.
        </p>
        <p>
          אין להשתמש בפורטל כדי להעלות תוכן בלתי חוקי, פוגעני, או כזה שאינכם
          רשאים לשתף. אנחנו רשאים להסיר תוכן כזה ולהשעות גישה במקרה של שימוש
          לרעה.
        </p>
      </LegalSection>

      <LegalSection heading="קניין רוחני">
        <p>
          <strong>שלנו.</strong> הצילומים, ההדמיות, התוכניות, הטקסטים והעיצוב
          באתר הם קניינם של {STUDIO_NAME_FULL} או של מי מטעמה. אין להעתיק,
          לשכפל או לעשות בהם שימוש מסחרי ללא אישור בכתב.
        </p>
        <p>
          <strong>שלכם.</strong> קבצים שאתם מעלים לפורטל נשארים שלכם. אתם
          מאשרים לנו להשתמש בהם לצורך ביצוע הפרויקט בלבד. פרסום של תמונות
          הפרויקט שלכם באתר או ברשתות ייעשה רק בהסכמתכם.
        </p>
      </LegalSection>

      <LegalSection heading="זמינות ואחריות">
        <p>
          אנחנו משתדלים שהאתר יהיה זמין ותקין, אך איננו מתחייבים לפעילות רציפה
          וללא תקלות. איננו אחראים לנזק עקיף שייגרם משימוש באתר או מחוסר
          זמינותו.
        </p>
        <p>
          הפורטל אינו תחליף לגיבוי. מומלץ לשמור עותק משלכם של קבצים חשובים.
        </p>
      </LegalSection>

      <LegalSection heading="קישורים חיצוניים">
        <p>
          האתר עשוי להכיל קישורים לאתרים אחרים. אין לנו שליטה עליהם ואיננו
          אחראים לתוכנם או למדיניות הפרטיות שלהם.
        </p>
      </LegalSection>

      <LegalSection heading="שינויים">
        <p>
          אנחנו רשאים לעדכן את התנאים מעת לעת. הנוסח המעודכן יפורסם כאן עם תאריך
          העדכון.
        </p>
      </LegalSection>

      <LegalSection heading="דין וסמכות שיפוט">
        <p>
          על תנאים אלה חלים דיני מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי
          המשפט המוסמכים במחוז תל אביב.
        </p>
      </LegalSection>

      <LegalSection heading="יצירת קשר">
        <p>
          {STUDIO_NAME_FULL}, {contact.address.join(", ")}
          <br />
          <a href={`mailto:${contact.emails[0]}`}>{contact.emails[0]}</a>
        </p>
        <p>
          ראו גם את <Link href="/privacy">מדיניות הפרטיות</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
