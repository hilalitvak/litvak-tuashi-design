-- תיקון אבטחה — הסלמת הרשאות דרך טבלת profiles.
--
-- מה התגלה בבדיקה (supabase/security-test.sql):
--   לקוח מחובר הצליח להריץ  update profiles set role='admin' where id=auth.uid()
--   ולהפוך את עצמו למנהל. משם הוא ראה את כל הפרויקטים, כל הלקוחות,
--   כל הספקים וכל הקבצים.
--
-- הסיבה: המדיניות "update own profile" הוגדרה עם USING בלבד.
-- USING קובע אילו שורות מותר לעדכן — אבל בלי WITH CHECK, פוסטגרס
-- לא בודק כלל מה הערך החדש. השורה שייכת ללקוח, ולכן העדכון עבר,
-- כולל שינוי העמודה role.
--
-- להריץ ב-SQL Editor. אחרי כן להריץ שוב את security-test.sql.

-- 1. גם השורה החדשה חייבת להיות שלו — לא רק הישנה.
drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles
  for update
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

-- 2. WITH CHECK לבדו לא מספיק: הוא עדיין מתיר ללקוח לשנות את role
--    בשורה של עצמו. חוסמים את העמודה הזו במפורש.
create function protect_profile_role() returns trigger
language plpgsql security definer set search_path = public as $fn$
begin
  if new.role is distinct from old.role and not is_admin() then
    raise exception 'שינוי תפקיד מותר למנהלים בלבד';
  end if;
  return new;
end $fn$;

create trigger profiles_protect_role
  before update on profiles
  for each row execute function protect_profile_role();
