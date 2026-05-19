import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// 1. Определяем правила роутинга
export const routing = defineRouting({
    locales: ['en', 'ru'],    // Поддерживаемые языки
    defaultLocale: 'ru',      // Язык по умолчанию
    localePrefix: 'always'    // Всегда добавлять /ru или /en в адресную строку
});

// 2. Генерируем современные и чистые хуки навигации
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);