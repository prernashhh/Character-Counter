"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function TermsConditions() {
  const t = useTranslations();
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsContent = async () => {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' });
        const data = await response.json();

        if (data?.success && data.settings?.termsConditionsContent?.trim()) {
          setTermsContent(data.settings.termsConditionsContent);
        }
      } catch {
        setTermsContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchTermsContent();
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
            {t('termsConditionsTitle')}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            {!loading && termsContent ? (
              <div dangerouslySetInnerHTML={{ __html: termsContent }} />
            ) : (
              <>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800">
                {t('lastUpdated')}: December 27, 2025
              </p>
            </div>

            <p className="text-lg leading-relaxed">
              {t('termsIntro')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. {t('acceptanceTerms')}</h2>
            <p className="leading-relaxed">
              {t('termsContent1')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. {t('useOfService')}</h2>
            <p className="leading-relaxed">
              {t('termsContent2')}
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
              <li>{t('termsUse1')}</li>
              <li>{t('termsUse2')}</li>
              <li>{t('termsUse3')}</li>
              <li>{t('termsUse4')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. {t('privacyData')}</h2>
            <p className="leading-relaxed">
              {t('termsContent3')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. {t('intellectualProperty')}</h2>
            <p className="leading-relaxed">
              {t('termsContent4')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. {t('userContent')}</h2>
            <p className="leading-relaxed">
              {t('termsContent5')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">6. {t('prohibitedActivities')}</h2>
            <p className="leading-relaxed">{t('termsContent6')}</p>
            <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
              <li>{t('prohibited1')}</li>
              <li>{t('prohibited2')}</li>
              <li>{t('prohibited3')}</li>
              <li>{t('prohibited4')}</li>
              <li>{t('prohibited5')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">7. {t('termination')}</h2>
            <p className="leading-relaxed">
              {t('termsContent7')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">8. {t('modificationsToService')}</h2>
            <p className="leading-relaxed">
              {t('termsContent8')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">9. {t('governingLaw')}</h2>
            <p className="leading-relaxed">
              {t('termsContent9')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">10. {t('contactInfo')}</h2>
            <p className="leading-relaxed">
              {t('termsContent10')}
            </p>

            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 font-semibold">
                {t('termsClosing')}
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
