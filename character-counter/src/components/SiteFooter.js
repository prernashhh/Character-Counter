'use client';

export default function SiteFooter({ locale, footerYear }) {

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-sm">
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
