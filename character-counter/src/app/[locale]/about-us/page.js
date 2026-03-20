"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const contactIcons = {
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  gmail: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6.5h18v11H3z" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7" />
      <circle cx="8" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <path d="M12 17v-4.2c0-1.7 1.2-2.8 2.7-2.8s2.3 1 2.3 2.8V17" />
    </svg>
  ),
};

function ContactRow({ icon, label, href, value, external = false }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white p-3 border border-slate-200">
      <span className="text-indigo-600 mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <p className="m-0">
        <span className="font-semibold text-gray-800">{label}: </span>
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="text-indigo-600 hover:text-indigo-800 underline break-all"
        >
          {value}
        </a>
      </p>
    </div>
  );
}

export default function AboutUs() {
  const t = useTranslations();
  const [aboutUsContent, setAboutUsContent] = useState(null);
  const [aboutUsContacts, setAboutUsContacts] = useState({
    instagramUrl: '',
    gmail: '',
    linkedinUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutUsContent();
  }, []);

  const fetchAboutUsContent = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success && data.settings.aboutUsContent) {
        const content = data.settings.aboutUsContent;
        // Check if we have structured content with sections
        if (content.sections && content.sections.length > 0) {
          setAboutUsContent(content);
        }
      }

      const contacts = data?.settings?.aboutUsContacts;
      if (contacts) {
        setAboutUsContacts({
          instagramUrl: contacts.instagramUrl || '',
          gmail: contacts.gmail || '',
          linkedinUrl: contacts.linkedinUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching about us content:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyContact = Boolean(
    aboutUsContacts.instagramUrl || aboutUsContacts.gmail || aboutUsContacts.linkedinUrl
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
            {t('aboutUsTitle')}
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : aboutUsContent ? (
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              {/* Render dynamic sections */}
              {aboutUsContent.sections.map((section, index) => (
                <div key={index}>
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.content && (
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}

              {/* Render closing text if available */}
              {aboutUsContent.closingText && (
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                  <p className="text-center text-gray-700 italic">
                    {aboutUsContent.closingText}
                  </p>
                </div>
              )}

              <div className="mt-8 rounded-xl p-6 border border-slate-200 bg-slate-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect With Us</h2>
                <div className="space-y-3 text-base">
                  {aboutUsContacts.instagramUrl && (
                    <ContactRow
                      icon={contactIcons.instagram}
                      label="Instagram"
                      href={aboutUsContacts.instagramUrl}
                      value={aboutUsContacts.instagramUrl}
                      external
                    />
                  )}
                  {aboutUsContacts.gmail && (
                    <ContactRow
                      icon={contactIcons.gmail}
                      label="Gmail"
                      href={`mailto:${aboutUsContacts.gmail}`}
                      value={aboutUsContacts.gmail}
                    />
                  )}
                  {aboutUsContacts.linkedinUrl && (
                    <ContactRow
                      icon={contactIcons.linkedin}
                      label="LinkedIn"
                      href={aboutUsContacts.linkedinUrl}
                      value={aboutUsContacts.linkedinUrl}
                      external
                    />
                  )}
                  {!hasAnyContact && (
                    <p className="text-gray-500 italic">
                      Contact links are not added yet.
                    </p>
                  )}
                </div>
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

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{t('whyChooseUs')}</h2>
              <p className="leading-relaxed">
                {t('aboutUsContent3')}
              </p>

              <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
                <p className="text-center text-gray-700 italic">
                  {t('aboutUsClosing')}
                </p>
              </div>

              <div className="mt-8 rounded-xl p-6 border border-slate-200 bg-slate-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect With Us</h2>
                <div className="space-y-3 text-base">
                  {aboutUsContacts.instagramUrl && (
                    <ContactRow
                      icon={contactIcons.instagram}
                      label="Instagram"
                      href={aboutUsContacts.instagramUrl}
                      value={aboutUsContacts.instagramUrl}
                      external
                    />
                  )}
                  {aboutUsContacts.gmail && (
                    <ContactRow
                      icon={contactIcons.gmail}
                      label="Gmail"
                      href={`mailto:${aboutUsContacts.gmail}`}
                      value={aboutUsContacts.gmail}
                    />
                  )}
                  {aboutUsContacts.linkedinUrl && (
                    <ContactRow
                      icon={contactIcons.linkedin}
                      label="LinkedIn"
                      href={aboutUsContacts.linkedinUrl}
                      value={aboutUsContacts.linkedinUrl}
                      external
                    />
                  )}
                  {!hasAnyContact && (
                    <p className="text-gray-500 italic">
                      Contact links are not added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
