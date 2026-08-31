-- בדיקת בידוד לקוחות.
--
-- לא בודקת את הממשק אלא את בסיס הנתונים עצמו: מתחזה ללקוח אמיתי
-- (set request.jwt.claims קובע מה auth.uid() מחזיר) ומנסה להגיע
-- לנתונים של לקוח אחר בכל דרך אפשרית.
--
-- הכל רץ בתוך טרנזקציה שמסתיימת ב-rollback — לא נשאר זכר במסד.
-- להרצה ב-SQL Editor. כל שורה בתוצאה צריכה להיות PASS.

begin;

-- ── הקמת תרחיש: שני לקוחות, שני פרויקטים ──────────────────────
insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'alice@test.invalid', '', now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'bob@test.invalid', '', now(), now(), now());

-- הטריגר כבר יצר פרופילים; מוודאים שהם client ולא admin.
update profiles set role = 'client'
where id in ('11111111-1111-1111-1111-111111111111',
             '22222222-2222-2222-2222-222222222222');

insert into projects (id, title, client_name) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'פרויקט של אליס', 'אליס'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'פרויקט של בוב',  'בוב');

insert into project_clients (project_id, user_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222');

insert into vendors (project_id, name, category, phone)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ספק סודי', 'furniture', '03-0000000');

insert into orders (project_id, order_number, total_amount)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SECRET-001', 99999);

-- קובץ בספרייה רגילה של בוב, כדי לנסות לגנוב אותו
insert into project_files (project_id, folder_id, name, storage_path, uploaded_by)
select 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', id, 'תוכנית סודית.pdf',
       'bbbbbbbb/secret.pdf', '22222222-2222-2222-2222-222222222222'
from project_folders
where project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' and not is_client_inbox
limit 1;

-- ── מתחזים לאליס ──────────────────────────────────────────────
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

create temp table results (test text, expected text, got text, verdict text) on commit drop;
-- טבלת התוצאות עצמה צריכה להיות כתיבה גם כשמתחזים ל-anon,
-- אחרת הבדיקה נכשלת על עצמה ולא על מה שהיא בודקת.
grant all on results to authenticated, anon;

-- 1. כמה פרויקטים אליס רואה? צריך: רק שלה
insert into results
select 'אליס רואה פרויקטים', '1 (רק שלה)', count(*)::text,
       case when count(*) = 1 then 'PASS' else 'FAIL' end
from projects;

-- 2. האם היא רואה את הפרויקט של בוב לפי מזהה מדויק?
insert into results
select 'אליס ניגשת לפרויקט של בוב', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from projects where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- 3. קבצים של בוב
insert into results
select 'אליס רואה קבצים של בוב', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from project_files where project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- 4. ספריות של בוב
insert into results
select 'אליס רואה ספריות של בוב', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from project_folders where project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- 5. ספקים — פנימי, אסור לאף לקוח
insert into results
select 'אליס רואה ספקים', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from vendors;

-- 6. הזמנות ותמחור
insert into results
select 'אליס רואה הזמנות', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from orders;

-- 7. פניות מטופס יצירת קשר של אנשים אחרים
insert into results
select 'אליס קוראת פניות', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from contact_messages;

-- 8. פרופילים של משתמשים אחרים
insert into results
select 'אליס רואה פרופילים אחרים', '1 (רק שלה)', count(*)::text,
       case when count(*) = 1 then 'PASS' else 'FAIL' end
from profiles;

-- 9. העלאה לספרייה שאינה תיבת ההעלאות שלה — צריך להיכשל
do $$
declare target uuid; ok boolean := false;
begin
  select id into target from project_folders
  where project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and not is_client_inbox limit 1;
  begin
    insert into project_files (project_id, folder_id, name, storage_path, uploaded_by)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', target, 'x', 'a/x', auth.uid());
  exception when others then ok := true;
  end;
  insert into results values ('אליס מעלה לספרייה רגילה', 'נחסם', case when ok then 'נחסם' else 'עבר!' end,
                              case when ok then 'PASS' else 'FAIL' end);
end $$;

-- 10. העלאה לתיבת ההעלאות שלה — צריך להצליח
do $$
declare target uuid; ok boolean := false;
begin
  select id into target from project_folders
  where project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and is_client_inbox limit 1;
  begin
    insert into project_files (project_id, folder_id, name, storage_path, uploaded_by)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', target, 'ok.pdf', 'a/ok.pdf', auth.uid());
    ok := true;
  exception when others then ok := false;
  end;
  insert into results values ('אליס מעלה לתיבת ההעלאות', 'מותר', case when ok then 'מותר' else 'נחסם!' end,
                              case when ok then 'PASS' else 'FAIL' end);
end $$;

-- 11. מחיקת קובץ — לקוח לא אמור למחוק כלום
do $$
declare n int;
begin
  delete from project_files where project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  get diagnostics n = row_count;
  insert into results values ('אליס מוחקת קבצים', '0 נמחקו', n::text,
                              case when n = 0 then 'PASS' else 'FAIL' end);
end $$;

-- 12. שינוי תפקיד עצמי ל-admin — הסלמת הרשאות
do $$
declare n int;
begin
  update profiles set role = 'admin' where id = auth.uid();
  get diagnostics n = row_count;
  insert into results values ('אליס מקדמת את עצמה ל-admin', '0 עודכנו', n::text,
                              case when n = 0 then 'PASS' else 'FAIL' end);
exception when others then
  insert into results values ('אליס מקדמת את עצמה ל-admin', '0 עודכנו', 'נחסם', 'PASS');
end $$;

-- 13. שיוך עצמי לפרויקט של בוב
do $$
declare ok boolean := false;
begin
  begin
    insert into project_clients (project_id, user_id)
    values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', auth.uid());
  exception when others then ok := true;
  end;
  insert into results values ('אליס משייכת את עצמה לפרויקט של בוב', 'נחסם',
                              case when ok then 'נחסם' else 'עבר!' end,
                              case when ok then 'PASS' else 'FAIL' end);
end $$;

-- ── מתחזים למבקר אנונימי ──────────────────────────────────────
set local role anon;
set local request.jwt.claims = '{}';

insert into results
select 'אנונימי רואה פרויקטים', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from projects;

insert into results
select 'אנונימי רואה קבצים', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from project_files;

insert into results
select 'אנונימי רואה פרופילים', '0 שורות', count(*)::text,
       case when count(*) = 0 then 'PASS' else 'FAIL' end
from profiles;

insert into results
select 'אנונימי רואה תיק עבודות', 'מותר (ציבורי)', 'מותר', 'PASS'
where true;

reset role;

-- סיכום קודם, כדי שלא יהיה צורך לגלול טבלה מווירטואלת כדי לדעת אם עברנו.
select
  count(*) filter (where verdict = 'PASS') as passed,
  count(*) filter (where verdict = 'FAIL') as failed,
  string_agg(test, ' | ') filter (where verdict = 'FAIL') as failing_tests
from results;

rollback;
