import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { getPageSeoServer } from "@/lib/seo-server";
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

export async function generateMetadata() {
  const seo = await getPageSeoServer('home');
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    icons: {
      icon: {
        url: '/Charater Count Favicon Logo.png',
        sizes: '192x192 256x256 512x512',
        type: 'image/png',
      },
      shortcut: '/Charater Count Favicon Logo.png',
      apple: {
        url: '/Charater Count Favicon Logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: ['/Charater Count Favicon Logo.png'],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
