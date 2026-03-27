"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatPolicyContent = (content) => {
  if (!content?.trim()) return '';

  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content);
  if (hasHtmlTags) {
    return content;
  }

  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const safeText = escapeHtml(paragraph)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>');
      return `<p>${safeText}</p>`;
    })
    .join('');
};

const defaultPrivacyPolicy = `At Character Count Online Tool, we respect your privacy and are committed to protecting your information.

1. Information We Process
We process the text you enter only to provide character counting and related analysis features.

2. Data Storage
By default, your text may be stored locally in your browser for convenience. We do not intentionally collect personal data unless you provide it voluntarily.

3. Cookies
We use essential cookies for admin authentication and secure session handling.

4. Third-Party Services
If integrated, third-party services may process limited technical data such as IP address or device information.

5. Security
We apply reasonable technical safeguards to protect your data.

6. Policy Updates
We may update this Privacy Policy from time to time. Continued use of the service means you accept the updated policy.

7. Contact
For privacy-related questions, please use the Contact Us page.`;

export default function PrivacyPolicyPage() {
  const t = useTranslations();
  const [policyContent, setPolicyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const formattedPolicyContent = formatPolicyContent(policyContent);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' });
        const data = await response.json();

        if (data?.success && data.settings?.privacyPolicyContent?.trim()) {
          setPolicyContent(data.settings.privacyPolicyContent);
        } else {
          setPolicyContent(defaultPrivacyPolicy);
        }
      } catch {
        setPolicyContent(defaultPrivacyPolicy);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
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
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 [&_p]:mb-5 [&_p]:leading-8 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-4 [&_ol]:my-4 [&_li]:my-1">
            {loading ? (
              <p>Loading privacy policy...</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formattedPolicyContent }} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
