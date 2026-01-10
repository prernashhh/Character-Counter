"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';

export default function ContactUs() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert(t('messageSent'));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-liinear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
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

          <h1 className="text-4xl font-extrabold text-center mb-8 bg-liinear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('contactUsTitle')}
          </h1>

          <div className="mb-8 text-center text-gray-700">
            <p className="text-lg">{t('contactUsIntro')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subjectLabel')}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                placeholder={t('subjectPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('messageLabel')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none"
                placeholder={t('messagePlaceholder')}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-liinear-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t('sendMessage')}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('otherWaysToReach')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-liinear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-700">{t('emailUs')}</p>
                    <p className="text-sm text-gray-600">support@charactercounter.com</p>
                  </div>
                </div>
              </div>
              <div className="bg-liinear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-700">{t('followUs')}</p>
                    <p className="text-sm text-gray-600">{t('socialMedia')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
