import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Этот матчер обрабатывает только чистые страницы и исключает системные файлы, картинки и API
    matcher: ['/', '/(ru|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};