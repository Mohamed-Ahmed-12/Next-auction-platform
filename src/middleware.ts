import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

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
  const locale = pathname.split('/')[1];

  // 1. Determine if we need to set a new Trace ID
  const existingTraceId = request.cookies.get('gui_id');
  let newTraceId: string | null = null;
  if (!existingTraceId) {
    newTraceId = uuidv4();
  }

  // 2. Auth & Protected Route Logic
  const isDashboardPath = pathname.includes('/dashboard');
  const token = request.cookies.get('access_token')?.value;
  const payload = getSafePayload(token);
  const isExpired = payload && payload.exp ? Date.now() >= payload.exp * 1000 : true;

  if (isDashboardPath) {
    if (!token || !payload || isExpired) {
      const loginUrl = new URL(`/${locale}`, request.url);
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      loginUrl.searchParams.set('callbackUrl', pathWithoutLocale);
      loginUrl.searchParams.set('login_modal', "open");

      const response = NextResponse.redirect(loginUrl);
      // Attach trace ID even on redirect
      if (newTraceId) {
        response.cookies.set('gui_id', newTraceId, { path: '/', maxAge: 86400, sameSite: 'lax' });
      }
      return response;
    }

    const allowedRoles = ['admin', 'staff'];
    const userRoles = Array.isArray(payload.roles) ? payload.roles : [];
    const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

    if (!isAuthorized) {
      const response = NextResponse.rewrite(new URL(`/${locale}/unauthorized`, request.url));
      if (newTraceId) {
        response.cookies.set('gui_id', newTraceId, { path: '/', maxAge: 86400, sameSite: 'lax' });
      }
      return response;
    }
  }

  // 3. Final Step: i18n Routing
  // We get the response from the i18n handler first...
  const response = handleI18nRouting(request);

  // ...then we attach the cookie to THAT response instance
  if (newTraceId) {
    response.cookies.set('gui_id', newTraceId, {
      secure: true,      // Keep this if using HTTPS
      httpOnly: false,   // CHANGE THIS: Allows js-cookie and WS to "see" the ID
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'none',   // 'lax' is better for 127.0.0.1 development
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ]
};