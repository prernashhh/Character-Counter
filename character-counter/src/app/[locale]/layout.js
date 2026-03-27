import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { getSEO } from "@/lib/seo";
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
  const seo = await getSEO("home");

  return {
    title: seo?.title || "Free Character Counter Tool",
    description:
      seo?.description ||
      "Count characters, words, and text length instantly with this free online tool.",
    icons: {
      icon: {
        url: "/Charater Count Favicon Logo.png",
        sizes: "192x192 256x256 512x512",
        type: "image/png",
      },
      shortcut: "/Charater Count Favicon Logo.png",
      apple: {
        url: "/Charater Count Favicon Logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    },
    openGraph: {
      title: seo?.title || "Free Character Counter Tool",
      description:
        seo?.description ||
        "Count characters, words, and text length instantly with this free online tool.",
      images: [seo?.ogImage || "/og-image.svg"],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Free Character Counter Tool",
      description:
        seo?.description ||
        "Count characters, words, and text length instantly with this free online tool.",
      images: [seo?.ogImage || "/og-image.svg"],
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
