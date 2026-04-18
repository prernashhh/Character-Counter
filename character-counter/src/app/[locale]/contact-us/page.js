import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPageSeoServer } from "@/lib/seo-server";
import { buildCanonicalUrl } from "@/lib/url";
import {
  formatLastUpdated,
  formatPlainTextAsHtml,
  getPublicPageSettings,
} from "@/lib/public-page-content";

export async function generateMetadata({ params }) {
  const resolvedParams = typeof params?.then === "function" ? await params : (params || {});
  const locale = resolvedParams.locale || "en";
  const seo = await getPageSeoServer("contactUs");
  const canonicalUrl = buildCanonicalUrl("/contact-us", locale);

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ContactUsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getPublicPageSettings(locale);
  const tr = (key, fallback) => (t.has(key) ? t(key) : fallback);

  const contactUsEmail =
    settings?.contactUsEmail ||
    settings?.socialLinks?.emailAddress ||
    "charactercountonlinetool@gmail.com";

  const contactUsContent = formatPlainTextAsHtml(settings?.contactUsContent || "");
  const pageClosingText =
    settings?.pageClosingTexts?.contactUs ||
    tr('contactPageClosing', 'Thank you for contacting us. We appreciate your feedback and usually reply within one to two business days.');

  const lastUpdated = formatLastUpdated(
    settings?.staticPagesLastUpdated?.contactUs || settings?.updatedAt || settings?.createdAt,
    locale
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToHome')}
          </Link>

          <h1 className="text-4xl font-extrabold text-center mb-8 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('contactUsTitle')}
          </h1>

          {lastUpdated && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800">
                {t('lastUpdated')}: {lastUpdated}
              </p>
            </div>
          )}

          <div className="mb-8 text-center text-gray-700">
            {contactUsContent ? (
              <div className="prose prose-slate max-w-none mx-auto text-left">
                <div dangerouslySetInnerHTML={{ __html: contactUsContent }} />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6 text-left">
                <p className="text-lg leading-relaxed">
                  {tr('contactFallbackIntro', 'Contact the Character Count Online Tool team for support, feedback, and product questions. If you need help with our character counter, word count tool, or page policies, we are happy to assist.')}
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{tr('contactHowToReachTitle', 'How to Reach Us')}</h2>
                <p className="leading-relaxed">
                  {tr('contactHowToReachText', 'Send us an email with your request and include useful details such as your device, browser, and the issue you are seeing. Clear context helps us respond faster.')}
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{tr('contactHelpWithTitle', 'What We Can Help With')}</h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>{tr('contactHelpWithItem1', 'Questions about character count, word count, and writing statistics')}</li>
                  <li>{tr('contactHelpWithItem2', 'Bug reports and usability improvements')}</li>
                  <li>{tr('contactHelpWithItem3', 'Privacy policy or terms clarification')}</li>
                  <li>{tr('contactHelpWithItem4', 'Suggestions for new features and workflow improvements')}</li>
                </ul>
              </div>
            )}

            <div className="prose prose-lg max-w-none text-left mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{tr('contactDirectEmailTitle', 'Direct Email')}</h2>
              <p className="leading-relaxed text-gray-700">
                {tr('contactDirectEmailPrefix', 'Email us at')} {" "}
                <a href={`mailto:${contactUsEmail}`} className="text-indigo-600 hover:text-indigo-800 underline">
                  {contactUsEmail}
                </a>
                {" "}{tr('contactDirectEmailSuffix', 'and we will get back to you as soon as possible.')}
              </p>
            </div>

            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 font-semibold">{pageClosingText}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
