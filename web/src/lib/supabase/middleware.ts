import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * מרענן את ה-session בכל בקשה ושומר על הגנת /portal.
 *
 * חשוב: הבדיקה כאן היא שכבה ראשונה בלבד — היא מונעת ממי שלא מחובר
 * להגיע לעמודי הפורטל. ההפרדה בין לקוח ללקוח נאכפת ב-RLS בבסיס הנתונים,
 * ולא כאן.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // בלי הגדרות Supabase האתר הציבורי עדיין אמור לעבוד.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && path.startsWith("/portal")) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", path);
    return NextResponse.redirect(redirect);
  }

  if (user && path === "/login") {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/portal";
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return response;
}
