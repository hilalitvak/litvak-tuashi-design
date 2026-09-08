import { redirect } from "next/navigation";

// תיק העבודות עבר לעמוד הבית. העמוד הזה נשאר כדי שקישורים ישנים
// שכבר נשלחו ללקוחות — ומה שגוגל כבר סרק — ימשיכו להגיע למקום הנכון.
export default function ProjectsPage() {
  redirect("/#projects");
}
