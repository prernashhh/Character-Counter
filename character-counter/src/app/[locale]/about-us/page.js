"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function AboutUs() {
  const t = useTranslations();

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
            {t('aboutUsTitle')}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              {t('aboutUsContent1')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('ourMission')}</h2>
            <p className="leading-relaxed">
              {t('aboutUsContent2')}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('features')}</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>{t('feature1')}</li>
              <li>{t('feature2')}</li>
              <li>{t('feature3')}</li>
              <li>{t('feature4')}</li>
              <li>{t('feature5')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('whyChooseUs')}</h2>
            <p className="leading-relaxed">
              {t('aboutUsContent3')}
            </p>

            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <p className="text-center text-gray-700 italic">
                {t('aboutUsClosing')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
