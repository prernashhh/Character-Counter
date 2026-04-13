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

export async function generateMetadata() {
  const title = "Character Counter & Word Counter Tool";
  const description =
    "Free character and word counter to instantly count words, characters, sentences, and paragraphs. Simple, fast, and accurate.";

  const url = "https://charactercountonlinetool.com";

  return {
    metadataBase: new URL(url),

    title,
    description,

    alternates: {
      canonical: "/",
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Character Counter Tool",
      images: [
        {
          url: "/Charater Count Favicon Logo.png",
          width: 512,
          height: 512,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Charater Count Favicon Logo.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const resolvedParams = typeof params?.then === "function" ? await params : (params || {});
  const locale = resolvedParams.locale || routing.defaultLocale;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
