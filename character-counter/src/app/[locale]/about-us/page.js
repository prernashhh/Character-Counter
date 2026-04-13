import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatLastUpdated, getPublicPageSettings } from "@/lib/public-page-content";

const DEFAULT_ABOUT_SECTIONS = [
  {
    heading: "Who We Are",
    content:
      "Character Count Online Tool is a simple writing utility built for people who need accurate text metrics quickly. We help students, marketers, writers, and teams check character count, word count, sentence count, and readability in one place.",
  },
  {
    heading: "What We Do",
    content:
      "Our character counter and word count tool is designed for real publishing workflows. You can validate social post limits, trim metadata for SEO, prepare assignments, and clean up long drafts without switching between multiple apps.",
  },
  {
    heading: "Why It Matters",
    content:
      "Clear writing performs better. Whether you are publishing a blog post, ad copy, caption, or email, clean structure and accurate length checks save time and reduce revision loops. Our goal is to make that process faster and more reliable.",
  },
  {
    heading: "Our Commitment",
    content:
      "We focus on speed, clarity, and maintainability. We continuously improve the product based on real feedback so you can rely on it as part of your daily writing process.",
  },
];

export default async function AboutUsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getPublicPageSettings();

  const configuredSections = settings?.aboutUsContent?.sections;
  const aboutSections = Array.isArray(configuredSections) && configuredSections.length > 0
    ? configuredSections
    : DEFAULT_ABOUT_SECTIONS;

  const pageClosingText =
    settings?.pageClosingTexts?.aboutUs ||
    "We value your trust and keep improving this character counter so writing stays easier for everyone.";

  const lastUpdated = formatLastUpdated(
    settings?.staticPagesLastUpdated?.aboutUs || settings?.updatedAt || settings?.createdAt,
    locale
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToHome')}
          </Link>

          <h1 className="text-4xl font-extrabold text-center mb-8 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('aboutUsTitle')}
          </h1>

          {lastUpdated && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800">
                {t('lastUpdated')}: {lastUpdated}
              </p>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            {aboutSections.map((section, index) => (
              <section key={`${section.heading || "section"}-${index}`}>
                {section.heading ? (
                  <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{section.heading}</h2>
                ) : null}
                {section.content ? (
                  <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                ) : null}
              </section>
            ))}

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Why People Use Our Tool</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Fast character count and word count analysis</li>
              <li>Useful for SEO snippets, social posts, and assignments</li>
              <li>Clear layout with practical writing stats</li>
              <li>Works smoothly on desktop and mobile</li>
            </ul>

            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 italic">{pageClosingText}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
