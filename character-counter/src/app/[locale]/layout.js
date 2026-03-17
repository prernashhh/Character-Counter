import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const currentYear = new Date().getFullYear();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>© {currentYear} Character Counter. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href={`/${locale}/about-us`} className="hover:text-slate-900 transition-colors">
                    About Us
                  </a>
                  <a href={`/${locale}/contact-us`} className="hover:text-slate-900 transition-colors">
                    Contact
                  </a>
                  <a href={`/${locale}/terms-conditions`} className="hover:text-slate-900 transition-colors">
                    Terms
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
