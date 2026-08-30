-- Litvak-Tuashi Design — Supabase schema
-- מבוסס על מודל הנתונים שיוצא מ-Base44 (data/base44-export/)
-- שלוש רמות גישה: admin (סיגל, בן) · client (לקוח) · אורח (ציבורי)

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- profiles: משתמש אחד לכל מי שמתחבר, עם תפקיד
-- ─────────────────────────────────────────────────────────────
create type user_role as enum ('admin', 'client');

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null unique,
  full_name   text,
  role        user_role not null default 'client',
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- כתובות המנהלים. מי שנרשם עם אחת מהן מקבל תפקיד admin אוטומטית
-- בכניסה הראשונה — אין צורך בהקצאה ידנית.
create table admin_emails (
  email text primary key
);

insert into admin_emails (email) values
  ('sigal.litvak@gmail.com'),
  ('bentuashi@gmail.com');

-- כל משתמש חדש מקבל פרופיל אוטומטית. התפקיד נקבע לפי admin_emails.
-- להוספת מנהל בעתיד: insert into admin_emails values ('...');
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $fn$
declare
  assigned_role user_role := 'client';
begin
  if exists (select 1 from admin_emails where email = lower(new.email)) then
    assigned_role := 'admin';
  end if;

  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    new.raw_user_meta_data->>'full_name',
    assigned_role
  )
  on conflict (id) do nothing;
  return new;
end $fn$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- עוזר: האם המשתמש הנוכחי הוא אדמין.
-- security definer כדי לא ליצור רקורסיה במדיניות על profiles.
create function is_admin() returns boolean
language sql security definer stable set search_path = public as $fn$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin')
$fn$;

-- ─────────────────────────────────────────────────────────────
-- portfolio_projects: תיק העבודות הציבורי (עמוד "פרויקטים")
-- ─────────────────────────────────────────────────────────────
create table portfolio_projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  location      text,
  category      text,
  description   text,
  banner_image  text,
  gallery       jsonb not null default '[]'::jsonb,
  is_featured   boolean not null default false,
  sort_order    int not null default 0,
  status        text not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- projects: פרויקט לקוח פעיל (הפורטל)
-- ─────────────────────────────────────────────────────────────
create table projects (
  id                 uuid primary key default uuid_generate_v4(),
  title              text not null,
  client_name        text,
  address            text,
  location           text,
  status             text not null default 'in_progress',
  designer           text,
  description        text,
  start_date         date,
  target_completion  date,
  budget             numeric(12,2) default 0,
  timeline_steps     jsonb not null default '[]'::jsonb,
  before_photos      jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- מי מהלקוחות רשאי לראות איזה פרויקט.
-- ב-Base44 זה היה מערך אימיילים על הפרויקט; כאן זו טבלת קשר אמיתית.
create table project_clients (
  project_id uuid not null references projects on delete cascade,
  user_id    uuid not null references profiles on delete cascade,
  primary key (project_id, user_id)
);

-- ─────────────────────────────────────────────────────────────
-- טבלאות משנה — כולן תלויות בפרויקט
-- ─────────────────────────────────────────────────────────────
create table design_plans (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references projects on delete cascade,
  title       text not null,
  type        text,
  file_url    text,
  version     text,
  notes       text,
  date_added  date default current_date,
  created_at  timestamptz not null default now()
);

create table inspiration_items (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null references projects on delete cascade,
  image_url    text not null,
  title        text,
  description  text,
  room         text,
  status       text default 'proposed',
  product_url  text,
  price        numeric(12,2),
  added_by     text,
  notes        text,
  created_at   timestamptz not null default now()
);

create table vendors (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid references projects on delete cascade,
  name            text not null,
  category        text,
  contact_person  text,
  email           text,
  phone           text,
  address         text,
  website         text,
  notes           text,
  documents       jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

create table orders (
  id                 uuid primary key default uuid_generate_v4(),
  project_id         uuid not null references projects on delete cascade,
  vendor_id          uuid references vendors on delete set null,
  order_number       text,
  date_ordered       date,
  expected_delivery  date,
  status             text default 'pending',
  items              jsonb not null default '[]'::jsonb,
  total_amount       numeric(12,2),
  notes              text,
  receipt_url        text,
  created_at         timestamptz not null default now()
);

-- פניות מטופס "צור קשר" באתר התדמית
create table contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  full_name   text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index on project_clients (user_id);
create index on design_plans (project_id);
create index on inspiration_items (project_id);
create index on vendors (project_id);
create index on orders (project_id);
create index on portfolio_projects (sort_order desc);

-- ─────────────────────────────────────────────────────────────
-- RLS — ההפרדה נאכפת בבסיס הנתונים, לא ב-frontend
-- ─────────────────────────────────────────────────────────────
alter table profiles           enable row level security;
alter table portfolio_projects enable row level security;
alter table projects           enable row level security;
alter table project_clients    enable row level security;
alter table design_plans       enable row level security;
alter table inspiration_items  enable row level security;
alter table vendors            enable row level security;
alter table orders             enable row level security;
alter table contact_messages   enable row level security;

-- profiles: כל אחד רואה ועורך את עצמו; אדמין רואה הכול
create policy "read own profile"   on profiles for select using (id = auth.uid() or is_admin());
create policy "update own profile" on profiles for update using (id = auth.uid() or is_admin());
create policy "admin writes profiles" on profiles for all using (is_admin()) with check (is_admin());

-- תיק עבודות: פתוח לקריאה לכולם (זה עמוד התדמית). כתיבה — אדמין בלבד.
create policy "portfolio public read" on portfolio_projects
  for select using (status = 'active' or is_admin());
create policy "portfolio admin write" on portfolio_projects
  for all using (is_admin()) with check (is_admin());

-- פרויקטים: אדמין רואה הכול; לקוח רואה רק פרויקטים שהוא משויך אליהם.
create policy "projects visible to owner or admin" on projects
  for select using (
    is_admin() or exists (
      select 1 from project_clients pc
      where pc.project_id = projects.id and pc.user_id = auth.uid()
    )
  );
create policy "projects admin write" on projects
  for all using (is_admin()) with check (is_admin());

create policy "project_clients read" on project_clients
  for select using (user_id = auth.uid() or is_admin());
create policy "project_clients admin write" on project_clients
  for all using (is_admin()) with check (is_admin());

-- טבלאות המשנה יורשות את אותו כלל דרך הפרויקט שלהן.
create function can_see_project(pid uuid) returns boolean
language sql security definer stable set search_path = public as $fn$
  select is_admin() or exists (
    select 1 from project_clients where project_id = pid and user_id = auth.uid()
  )
$fn$;

create policy "design_plans read"  on design_plans      for select using (can_see_project(project_id));
create policy "design_plans write" on design_plans      for all    using (is_admin()) with check (is_admin());

create policy "inspiration read"   on inspiration_items for select using (can_see_project(project_id));
-- הלקוח רשאי להוסיף השראה לפרויקט שלו — זו כל הנקודה של לוח ההשראה
create policy "inspiration client insert" on inspiration_items
  for insert with check (can_see_project(project_id));
create policy "inspiration admin write"  on inspiration_items
  for all using (is_admin()) with check (is_admin());

-- ספקים והזמנות: פנימי. אדמין בלבד — הלקוח לא רואה תמחור ספקים.
create policy "vendors admin only" on vendors for all using (is_admin()) with check (is_admin());
create policy "orders admin only"  on orders  for all using (is_admin()) with check (is_admin());

-- טופס יצירת קשר: כל אחד יכול לשלוח, רק אדמין קורא.
create policy "contact insert any"  on contact_messages for insert with check (true);
create policy "contact admin read"  on contact_messages for select using (is_admin());
create policy "contact admin write" on contact_messages for update using (is_admin()) with check (is_admin());


-- ═════════════════════════════════════════════════════════════
-- ספריות קבצים
--
-- לכל פרויקט נוצרות ספריות אוטומטית ברגע שהוא נוצר.
-- המנהל שולט בהן במלואו: הוספה, שינוי שם, מחיקה, והזזת קבצים ביניהן.
-- הלקוח רואה את כל הספריות, אך מעלה קבצים דרך אחת בלבד — "תיבת ההעלאות".
-- ═════════════════════════════════════════════════════════════

create table project_folders (
  id               uuid primary key default uuid_generate_v4(),
  project_id       uuid not null references projects on delete cascade,
  name             text not null,
  sort_order       int not null default 0,
  -- הספרייה היחידה שדרכה הלקוח רשאי להעלות. אחת לכל פרויקט (ראו האינדקס למטה).
  is_client_inbox  boolean not null default false,
  created_at       timestamptz not null default now()
);

create index on project_folders (project_id, sort_order);

-- אכיפה: לכל היותר תיבת העלאות אחת לפרויקט.
create unique index one_inbox_per_project
  on project_folders (project_id)
  where is_client_inbox;

create table project_files (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid not null references projects on delete cascade,
  folder_id     uuid not null references project_folders on delete cascade,
  name          text not null,
  storage_path  text not null unique,
  mime_type     text,
  size_bytes    bigint,
  uploaded_by   uuid references profiles on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index on project_files (project_id);
create index on project_files (folder_id);

-- הספריות שנוצרות אוטומטית עם כל פרויקט חדש.
-- לשינוי הרשימה — לערוך כאן; פרויקטים קיימים לא מושפעים.
create function seed_project_folders() returns trigger
language plpgsql security definer set search_path = public as $fn$
begin
  insert into project_folders (project_id, name, sort_order, is_client_inbox)
  values
    (new.id, 'תוכניות ועיצוב',    1, false),
    (new.id, 'הדמיות',            2, false),
    (new.id, 'חומרים וגימורים',   3, false),
    (new.id, 'הזמנות וקבלות',     4, false),
    (new.id, 'תמונות לפני',       5, false),
    (new.id, 'מסמכים',            6, false),
    (new.id, 'העלאות מהלקוח',     7, true);
  return new;
end $fn$;

create trigger on_project_created
  after insert on projects
  for each row execute function seed_project_folders();

-- ═════════════════════════════════════════════════════════════
-- התראות — המנהלים מקבלים עדכון על כל העלאה של לקוח
-- ═════════════════════════════════════════════════════════════

create table notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles on delete cascade,
  type        text not null,
  title       text not null,
  body        text,
  project_id  uuid references projects on delete cascade,
  file_id     uuid references project_files on delete cascade,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index on notifications (user_id, read_at, created_at desc);

create function notify_admins_on_client_upload() returns trigger
language plpgsql security definer set search_path = public as $fn$
declare
  uploader_role user_role;
  proj_title    text;
begin
  select role into uploader_role from profiles where id = new.uploaded_by;

  -- העלאות של המנהלים עצמם לא מייצרות התראה.
  if uploader_role is distinct from 'client' then
    return new;
  end if;

  select title into proj_title from projects where id = new.project_id;

  insert into notifications (user_id, type, title, body, project_id, file_id)
  select
    p.id,
    'file_uploaded',
    'קובץ חדש הועלה',
    coalesce(proj_title, 'פרויקט') || ' — ' || new.name,
    new.project_id,
    new.id
  from profiles p
  where p.role = 'admin';

  return new;
end $fn$;

create trigger on_client_file_uploaded
  after insert on project_files
  for each row execute function notify_admins_on_client_upload();

-- ═════════════════════════════════════════════════════════════
-- RLS לספריות, קבצים והתראות
-- ═════════════════════════════════════════════════════════════

alter table admin_emails    enable row level security;
alter table project_folders enable row level security;
alter table project_files   enable row level security;
alter table notifications   enable row level security;

-- admin_emails נקראת רק ע"י הטריגר (security definer). אין מדיניות =
-- אין גישה ישירה מהלקוח, וזה בכוונה.

create policy "folders read" on project_folders
  for select using (can_see_project(project_id));
create policy "folders admin write" on project_folders
  for all using (is_admin()) with check (is_admin());

create policy "files read" on project_files
  for select using (can_see_project(project_id));

-- הלקוח מעלה — אך ורק לתיבת ההעלאות של פרויקט שהוא משויך אליו,
-- ורק בשמו שלו. הכלל הזה הוא מה שמונע העלאה לספרייה אחרת.
create policy "files client upload to inbox" on project_files
  for insert with check (
    can_see_project(project_id)
    and uploaded_by = auth.uid()
    and exists (
      select 1 from project_folders f
      where f.id = folder_id
        and f.project_id = project_files.project_id
        and f.is_client_inbox
    )
  );

-- שינוי שם, הזזה בין ספריות ומחיקה — מנהל בלבד.
create policy "files admin update" on project_files
  for update using (is_admin()) with check (is_admin());
create policy "files admin delete" on project_files
  for delete using (is_admin());

create policy "notifications read own" on notifications
  for select using (user_id = auth.uid());
create policy "notifications mark read" on notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
