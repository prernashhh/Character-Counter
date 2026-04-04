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

const baseUrl = "https://charactercountonlinetool.com";

function resolvePublicOgImageUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return `${baseUrl}/og-image.png`;
  }

  if (/^https:\/\//i.test(raw)) {
    return raw;
  }

  if (/^http:\/\//i.test(raw)) {
    return raw.replace(/^http:\/\//i, "https://");
  }

  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(raw)) {
    return `${baseUrl}/og-image.png`;
  }

  return `${baseUrl}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const seo = await getSEO("home");
  const ogImageUrl = resolvePublicOgImageUrl(seo?.ogImage);

  return {
    title: seo?.title || "Free Character Counter Tool",
    description:
      seo?.description ||
      "Count characters, words, and text length instantly with this free online tool.",
    alternates: {
      canonical: baseUrl,
    },
    verification: {
      google: "8yMtIDYM7HBVAs7giq8QwDzdPNIj0ZiZ_V_P2AYaRfM",
    },
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
      url: baseUrl,
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Free Character Counter Tool",
      description:
        seo?.description ||
        "Count characters, words, and text length instantly with this free online tool.",
      images: [ogImageUrl],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
