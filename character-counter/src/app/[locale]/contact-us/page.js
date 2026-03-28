"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export default function ContactUs() {
  const t = useTranslations();
  const [contactUsContent, setContactUsContent] = useState('');
  const [contactUsEmail, setContactUsEmail] = useState('iamdineshswami@gmail.com');
  const [pageClosingText, setPageClosingText] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [contentLoading, setContentLoading] = useState(true);

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
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/settings?scope=public-pages', { cache: 'no-store' });
        const data = await response.json();

        if (data?.success && data.settings?.contactUsContent?.trim()) {
          setContactUsContent(data.settings.contactUsContent);
        }

        setContactUsEmail(
          data?.settings?.contactUsEmail ||
          data?.settings?.socialLinks?.emailAddress ||
          'iamdineshswami@gmail.com'
        );
        setPageClosingText(data?.settings?.pageClosingTexts?.contactUs || '');

        setLastUpdated(
          formatDate(
            data?.settings?.staticPagesLastUpdated?.contactUs ||
            data?.settings?.updatedAt ||
            data?.settings?.createdAt
          )
        );
      } catch {
        setContactUsContent('');
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
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
            {contentLoading ? (
              <p className="text-lg">{t('contactUsIntro')}</p>
            ) : contactUsContent ? (
              <div className="prose prose-slate max-w-none mx-auto text-left">
                <div dangerouslySetInnerHTML={{ __html: contactUsContent }} />
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                  <p className="text-center text-gray-700 font-semibold">
                    {pageClosingText || 'Thank you for reaching out. We appreciate your time and feedback.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6 text-left">
                <p className="text-lg leading-relaxed">{t('contactUsIntro')}</p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How to Reach Us</h2>
                <p className="leading-relaxed">
                  You can contact us directly by email for support, suggestions, and collaboration related queries.
                  We check messages regularly and respond as quickly as possible.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">What We Can Help With</h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Feature requests and product improvements</li>
                  <li>Bug reports and technical issues</li>
                  <li>Policy and content clarification</li>
                  <li>General feedback and partnership discussions</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Direct Email</h2>
                <p className="leading-relaxed">
                  Email us at{' '}
                  <a href={`mailto:${contactUsEmail}`} className="text-indigo-600 hover:text-indigo-800 underline">
                    {contactUsEmail}
                  </a>
                  {' '}and our team will get back to you soon.
                </p>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                  <p className="text-center text-gray-700 font-semibold">
                    {pageClosingText || 'Thank you for reaching out. We appreciate your time and feedback.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
