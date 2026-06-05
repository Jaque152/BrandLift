import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['en', 'es'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Evitar procesar rutas estáticas o de la API
  if (
    pathname.startsWith(`/_next/`) ||
    pathname.startsWith(`/api/`) ||
    pathname.includes('.')
  ) {
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Si no tiene idioma, redirigir al idioma por defecto (puedes añadir lógica de headers aquí)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};