"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function AboutUs() {
  const t = useTranslations();
  const [aboutUsContent, setAboutUsContent] = useState(null);
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
    fetchAboutUsContent();
  }, []);

  const fetchAboutUsContent = async () => {
    try {
      const response = await fetch('/api/settings?scope=public-pages', { cache: 'no-store' });
      const data = await response.json();
      if (data.success && data.settings.aboutUsContent) {
        const content = data.settings.aboutUsContent;
        if (content.sections && content.sections.length > 0) {
          setAboutUsContent(content);
        }
      }

      setPageClosingText(data?.settings?.pageClosingTexts?.aboutUs || '');

      setLastUpdated(
        formatDate(
          data?.settings?.staticPagesLastUpdated?.aboutUs ||
          data?.settings?.updatedAt ||
          data?.settings?.createdAt
        )
      );
    } catch (error) {
      console.error('Error fetching about us content:', error);
    } finally {
      setLoading(false);
    }
  };

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

          {lastUpdated && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800">
                {t('lastUpdated')}: {lastUpdated}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : aboutUsContent ? (
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              {aboutUsContent.sections.map((section, index) => (
                <div key={index}>
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.content && (
                    <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                  )}
                </div>
              ))}

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('whyChooseUs')}</h2>
              <p className="leading-relaxed">
                {t('aboutUsContent3')}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Vision</h2>
              <p className="leading-relaxed">
                Our vision is to make everyday writing tools simple, trustworthy, and available to everyone,
                whether you are a student, creator, marketer, or professional.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How We Improve</h2>
              <p className="leading-relaxed">
                We continuously review user feedback, improve usability, and refine performance so the tool
                stays fast, accurate, and easy to use on every device.
              </p>

              <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                <p className="text-center text-gray-700 italic">{pageClosingText || t('aboutUsClosing')}</p>
              </div>
            </div>
          ) : (
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

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Commitment</h2>
              <p className="leading-relaxed">
                We continuously improve this tool based on user feedback so you can write faster,
                stay within limits, and create cleaner content across every platform.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Vision</h2>
              <p className="leading-relaxed">
                We believe writing tools should be accessible, accurate, and helpful for everyone.
                Our goal is to support better communication for users across all languages and use cases.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How We Improve</h2>
              <p className="leading-relaxed">
                We regularly refine performance, readability, and user experience based on real feedback,
                so the platform continues to evolve with your needs.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('whyChooseUs')}</h2>
              <p className="leading-relaxed">
                {t('aboutUsContent3')}
              </p>

              <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                <p className="text-center text-gray-700 italic">{pageClosingText || t('aboutUsClosing')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
