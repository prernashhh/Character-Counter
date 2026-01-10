import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({

  locales: ['en', 'af', 'bs', 'id', 'de', 'es', 'fr', 'it', 'hu', 'nl', 'no', 'pt', 'fi', 'sv', 'tr', 'ar', 'zh', 'el', 'hi'],

  defaultLocale: 'en',
  
  localePrefix: 'always'
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
