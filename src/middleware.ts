import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface MyTokenPayload extends JwtPayload {
  roles: string[];
}

// Helper: Securely extract payload from token
const getSafePayload = (token: string | undefined): MyTokenPayload | null => {
  if (!token) return null;
  try {
    return jwtDecode<MyTokenPayload>(token);
  } catch (error) {
    return null;
  }
};

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Extract locale
  const locale = pathname.split('/')[1];

  const isDashboardPath = pathname.includes('/dashboard');
  const token = request.cookies.get('access_token')?.value;
  const payload = getSafePayload(token);
  const isExpired = payload && payload.exp ? Date.now() >= payload.exp * 1000 : true;

  // 3. Protected Route Logic
  if (isDashboardPath) {
    if (!token || !payload || isExpired) {
      const loginUrl = new URL(`/${locale}`, request.url);
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      loginUrl.searchParams.set('callbackUrl', pathWithoutLocale);
      loginUrl.searchParams.set('login_modal', "open");
      return NextResponse.redirect(loginUrl);
    }

    const allowedRoles = ['admin', 'staff'];
    const userRoles = Array.isArray(payload.roles) ? payload.roles : [];
    const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

    if (!isAuthorized) {
      // Use rewrite instead of redirect for 403 to keep the URL consistent
      return NextResponse.rewrite(new URL(`/${locale}/unauthorized`, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ]
};