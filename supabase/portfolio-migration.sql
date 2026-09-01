-- העברת תיק העבודות לבסיס הנתונים.
-- עד היום שמונת הפרויקטים היו מקודדים בקובץ, וכל שינוי דרש מפתח.
-- מכאן סיגל ובן מנהלים אותם דרך הפורטל.
--
-- להריץ ב-SQL Editor. ניתן להרצה חוזרת — משתמש ב-slug כמפתח ייחודי.

-- slug הוא מה שמופיע בכתובת (/projects/villa-tel-aviv), ולכן חייב להיות ייחודי.
alter table portfolio_projects add column if not exists slug text;
create unique index if not exists portfolio_projects_slug_key on portfolio_projects (slug);

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('classic-apartment', 'דירה קלאסית', 'תל אביב', 'Residential', null, '41c1cc127_14.jpg', '["a62ece8d5_7.jpg","6855466ee_8.jpg","f0a500922_10.jpg","681d7e793_13.jpg","41c1cc127_14.jpg"]'::jsonb, false, 14, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('modality-offices', 'משרדים מודליטי', 'תל אביב', 'Commercial', 'בשיתוף המעצבת  עדי עוז', '1d5faa503_1-Copy.jpg', '["1d5faa503_1-Copy.jpg","fbcb236ea_5.jpg","6def0e379_6-Copy.jpg","87631adf5_11-Copy.jpg","4718f96ac_12.jpg","bc6f21289_13-Copy.jpg","508e045c2_32.jpg"]'::jsonb, true, 13, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('modern-house-shfela', 'בית מודרני בשפלה', 'שפלה', 'Residential', null, 'fd724a73a_Ben2_View3_09-11-23.jpg', '["30aa163fe_Ben2_View2_09-11-23.jpg","fd724a73a_Ben2_View3_09-11-23.jpg","cd698a9bb_Ben2_View4_09-11-23.jpg","b95391c2a_Ben2_View5_09-11-23.jpg"]'::jsonb, true, 12, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('mini-penthouse', 'מיני פנטהאוז', 'גבעתיים', 'Residential', null, '118efee82_ERZ_2224-Edit.jpg', '["08d3fa340_ERZ_2057-Edit.jpg","c9f1d4954_ERZ_2061-Edit.jpg","a9a27e623_ERZ_2073-Edit.jpg","f107b14b7_ERZ_2106-Edit-2.jpg","f553e667f_ERZ_2197-Edit.jpg","18328d415_ERZ_2213-Edit.jpg","118efee82_ERZ_2224-Edit.jpg","6613f6d99_ERZ_2233-Edit.jpg","0b36f7f41_ERZ_2240-Edit.jpg"]'::jsonb, true, 11, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('urban-penthouse', 'פנטהאוז אורבני', 'יבנה', 'Residential', null, 'ecacf0b2a_1-.jpg', '["ecacf0b2a_1-.jpg","a70aded10_3-.jpg","e4f9438e7_4-Copy.jpg","6c0a195e1_5.jpg","be0bfba2f_6-.jpg","238d34527_10.jpg","48da8a6a2_19.jpg","6e9be96e7_20.jpg"]'::jsonb, true, 10, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('garden-apartment', 'דירת גן', 'תל אביב', 'Residential', null, '917a18576_4.jpg', '["816910ec6_1.jpg","cb128b0cc_2-.jpg","77ac390ed_3-.jpg","917a18576_4.jpg","eb1e18dd8_8.jpg","49e29a269_9.jpg","1288fc5b3_13.jpg"]'::jsonb, false, 3, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('natural-apartment', 'דירה טבעית', 'תל אביב', 'Residential', null, '212d9b_pr4_view2_06-23-23.jpg', '["212d9b_pr4_view2_06-23-23.jpg","f07937aed_pr4_view1_06-23-23.jpg","8cd4cae73_pr4_view3_06-23-23.jpg","61989e300_pr4_view4_06-23-23.jpg"]'::jsonb, true, 2, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

insert into portfolio_projects (slug, title, location, category, description, banner_image, gallery, is_featured, sort_order, status)
values ('villa-tel-aviv', 'וילה תל אביב', 'תל אביב', null, null, '651024158_5.jpg', '["de4ab9aac_3-.jpg","42750b1b4_6-.jpg","651024158_5.jpg","76b437fba_9.jpg","422ee3910_11.jpg","161437af0_19--.jpg","361c20796_20-.jpg"]'::jsonb, true, 1, 'active')
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, category = excluded.category,
  description = excluded.description, banner_image = excluded.banner_image,
  gallery = excluded.gallery, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, updated_at = now();

select count(*) as projects, count(*) filter (where is_featured) as featured, sum(jsonb_array_length(gallery)) as gallery_images from portfolio_projects;
