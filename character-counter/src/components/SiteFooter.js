'use client';

export default function SiteFooter({ locale, footerYear }) {

  return (
    <footer className="mt-3 bg-linear-to-r from-indigo-50/80 via-sky-50/80 to-violet-50/80">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-center sm:text-left">Copyright © {footerYear} Character Count Online Tool. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a href={`/${locale}/about-us`} className="text-indigo-700 hover:text-indigo-900 transition-colors">
              About Us
            </a>
            <a href={`/${locale}/contact-us`} className="text-indigo-700 hover:text-indigo-900 transition-colors">
              Contact
            </a>
            <a href={`/${locale}/privacy-policy`} className="text-indigo-700 hover:text-indigo-900 transition-colors">
              Privacy Policy
            </a>
            <a href={`/${locale}/terms-conditions`} className="text-indigo-700 hover:text-indigo-900 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
