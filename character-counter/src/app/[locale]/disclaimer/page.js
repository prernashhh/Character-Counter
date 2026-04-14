import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatLastUpdated,
  formatPlainTextAsHtml,
  getPublicPageSettings,
} from "@/lib/public-page-content";

const DEFAULT_DISCLAIMER_CONTENT = `The information provided by Character Count Online Tool is for general informational and productivity purposes only.

1. General Information
The character counter and word count tool are offered "as is" without guarantees of uninterrupted availability.

2. Accuracy
We work to keep calculations accurate, but we do not guarantee that all outputs are error-free in every context.

3. Professional Use
This website does not provide legal, financial, academic, or professional advice. Please verify critical information independently.

4. External Links
If the site links to third-party resources, we are not responsible for their content, security, or policies.

5. Updates
We may update this disclaimer at any time as features or legal requirements change.`;

export default async function DisclaimerPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getPublicPageSettings(locale);
  const tr = (key, fallback) => (t.has(key) ? t(key) : fallback);

  const disclaimerContent = settings?.disclaimerContent?.trim() || tr('disclaimerDefaultContent', DEFAULT_DISCLAIMER_CONTENT);
  const formattedDisclaimerContent = formatPlainTextAsHtml(disclaimerContent);
  const pageClosingText =
    settings?.pageClosingTexts?.disclaimer ||
    tr('disclaimerPageClosing', 'Please review this disclaimer periodically to stay informed about updates.');

  const lastUpdated = formatLastUpdated(
    settings?.staticPagesLastUpdated?.disclaimer || settings?.updatedAt || settings?.createdAt,
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
            {t('disclaimerTitle')}
          </h1>

          {lastUpdated && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800">
                {t('lastUpdated')}: {lastUpdated}
              </p>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 [&_p]:mb-5 [&_p]:leading-8 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-4 [&_ol]:my-4 [&_li]:my-1">
            <div dangerouslySetInnerHTML={{ __html: formattedDisclaimerContent }} />
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 font-semibold">{pageClosingText}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
