'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function SiteFooter() {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const [footerYear, setFooterYear] = useState(currentYear);

  useEffect(() => {
    const fetchFooterYear = async () => {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' });
        const data = await response.json();

        if (data?.success && Number.isInteger(data.settings?.footerCopyrightYear)) {
          setFooterYear(data.settings.footerCopyrightYear);
        }
      } catch {
        setFooterYear(currentYear);
      }
    };

    fetchFooterYear();
  }, [currentYear]);

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>Copyright © {footerYear} Character Count Online Tool. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href={`/${locale}/about-us`} className="hover:text-slate-900 transition-colors">
            About Us
          </a>
          <a href={`/${locale}/contact-us`} className="hover:text-slate-900 transition-colors">
            Contact
          </a>
          <a href={`/${locale}/privacy-policy`} className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </a>
          <a href={`/${locale}/terms-conditions`} className="hover:text-slate-900 transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
