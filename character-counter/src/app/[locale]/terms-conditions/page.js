import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatLastUpdated,
  formatPlainTextAsHtml,
  getPublicPageSettings,
} from "@/lib/public-page-content";

const DEFAULT_TERMS_CONTENT = `These Terms and Conditions explain how you may use Character Count Online Tool.

1. Acceptance of Terms
By using this website, you agree to these terms. If you do not agree, please stop using the service.

2. Service Scope
Our website provides a character counter, word count tool, and related writing statistics for informational and productivity purposes.

3. Fair Use
You agree not to misuse the service, interfere with site performance, or attempt unauthorized access to systems or data.

4. Content Responsibility
You are responsible for any text you enter or publish. Please review your content before submission or distribution.

5. Intellectual Property
The platform design, branding, and original site materials are protected by applicable intellectual property laws.

6. Availability
We aim to keep the service available and accurate, but we do not guarantee uninterrupted operation at all times.

7. Changes to Terms
We may update these terms to reflect product, legal, or operational changes. Continued use means you accept the revised terms.

8. Contact
For questions about these terms, please use the Contact Us page.`;

export default async function TermsConditionsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getPublicPageSettings(locale);
  const tr = (key, fallback) => (t.has(key) ? t(key) : fallback);

  const termsContent = settings?.termsConditionsContent?.trim() || tr('termsDefaultContent', DEFAULT_TERMS_CONTENT);
  const formattedTermsContent = formatPlainTextAsHtml(termsContent);
  const pageClosingText =
    settings?.pageClosingTexts?.termsConditions ||
    tr('termsPageClosing', 'By continuing to use this service, you agree to these terms and conditions.');

  const lastUpdated = formatLastUpdated(
    settings?.staticPagesLastUpdated?.termsConditions || settings?.updatedAt || settings?.createdAt,
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
            {t('termsConditionsTitle')}
          </h1>

          {lastUpdated && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800">
                {t('lastUpdated')}: {lastUpdated}
              </p>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 [&_p]:mb-5 [&_p]:leading-8 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-4 [&_ol]:my-4 [&_li]:my-1">
            <div dangerouslySetInnerHTML={{ __html: formattedTermsContent }} />
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 font-semibold">{pageClosingText}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
