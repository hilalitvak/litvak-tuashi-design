-- אחסון קבצי הפרויקטים.
-- להריץ ב-SQL Editor אחרי schema.sql.
--
-- מבנה הנתיב בדלי:  <project_id>/<folder_id>/<uuid>-<שם הקובץ>
-- שני המקטעים הראשונים הם מה שמדיניות ההרשאות נשענת עליו.

insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 52428800)  -- 50MB לקובץ
on conflict (id) do nothing;

-- הדלי פרטי. כל הורדה עוברת דרך קישור חתום עם תפוגה, לא דרך URL קבוע.

-- קריאה: מי שרשאי לראות את הפרויקט רשאי לראות את כל קבציו.
create policy "project files read"
  on storage.objects for select
  using (
    bucket_id = 'project-files'
    and can_see_project(((storage.foldername(name))[1])::uuid)
  );

-- העלאה: מנהל לכל מקום; לקוח אך ורק לתיבת ההעלאות של הפרויקט שלו.
-- זהו אותו כלל שנאכף על טבלת project_files, כאן ברמת הקבצים עצמם —
-- כדי שלקוח לא יוכל לעקוף את הממשק ולכתוב ישירות לדלי.
create policy "project files upload"
  on storage.objects for insert
  with check (
    bucket_id = 'project-files'
    and (
      is_admin()
      or (
        can_see_project(((storage.foldername(name))[1])::uuid)
        and exists (
          select 1 from project_folders f
          where f.id = ((storage.foldername(name))[2])::uuid
            and f.project_id = ((storage.foldername(name))[1])::uuid
            and f.is_client_inbox
        )
      )
    )
  );

-- הזזה, שינוי שם ומחיקה — מנהל בלבד.
create policy "project files admin update"
  on storage.objects for update
  using (bucket_id = 'project-files' and is_admin())
  with check (bucket_id = 'project-files' and is_admin());

create policy "project files admin delete"
  on storage.objects for delete
  using (bucket_id = 'project-files' and is_admin());


-- ═════════════════════════════════════════════════════════════
-- דלי צילומי תיק העבודות — ציבורי בכוונה.
-- אלה תמונות שיווקיות שמוצגות לכל מבקר באתר, ולכן אין טעם
-- בקישורים חתומים כאן. כתיבה — מנהלים בלבד.
-- ═════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit)
values ('portfolio', 'portfolio', true, 10485760)  -- 10MB לקובץ
on conflict (id) do nothing;

create policy "portfolio public read"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "portfolio admin write"
  on storage.objects for all
  using (bucket_id = 'portfolio' and is_admin())
  with check (bucket_id = 'portfolio' and is_admin());
