"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Disclaimer() {
  const t = useTranslations();
  const [disclaimerContent, setDisclaimerContent] = useState('');
  const [pageClosingText, setPageClosingText] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchDisclaimerContent = async () => {
      try {
        const response = await fetch('/api/settings?scope=public-pages', { cache: 'no-store' });
        const data = await response.json();

        if (data?.success && data.settings?.disclaimerContent?.trim()) {
          setDisclaimerContent(data.settings.disclaimerContent);
        }
        setPageClosingText(data?.settings?.pageClosingTexts?.disclaimer || '');

        setLastUpdated(
          formatDate(
            data?.settings?.staticPagesLastUpdated?.disclaimer ||
            data?.settings?.updatedAt ||
            data?.settings?.createdAt
          )
        );
      } catch {
        setDisclaimerContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchDisclaimerContent();
  }, []);

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

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            {!loading && disclaimerContent ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: disclaimerContent }} />
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                  <p className="text-center text-gray-700 font-semibold">
                    {pageClosingText || t('disclaimerClosing')}
                  </p>
                </div>
              </>
            ) : (
              <>
            <p className="text-lg leading-relaxed">
              {t('disclaimerIntro')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('noWarranty')}</h2>
            <p className="leading-relaxed">
              {t('disclaimerContent1')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('accuracyOfInfo')}</h2>
            <p className="leading-relaxed">
              {t('disclaimerContent2')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('limitationLiability')}</h2>
            <p className="leading-relaxed">
              {t('disclaimerContent3')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('userResponsibility')}</h2>
            <p className="leading-relaxed">
              {t('disclaimerContent4')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('thirdPartyLinks')}</h2>
            <p className="leading-relaxed">
              {t('disclaimerContent5')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('changesToDisclaimer')}</h2>
            <p className="leading-relaxed">
              {t('disclaimerContent6')}
            </p>

            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 font-semibold">
                {pageClosingText || t('disclaimerClosing')}
              </p>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
