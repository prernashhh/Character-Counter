"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import SiteFooter from '@/components/SiteFooter';

// Language configurations
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "bs", name: "Bosanski", flag: "🇧🇦" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "fi", name: "Suomalainen", flag: "🇫🇮" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "el", name: "ελληνικά", flag: "🇬🇷" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" }
];

const countWords = (text) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

const countSpaces = (text) => {
  return (text.match(/ /g) || []).length;
};

const countSentences = (text) => {
  if (!text.trim()) return 0;
  const parts = text.split(/[.!?]+/).map((s) => s.trim());
  return parts.filter((s) => s.length > 0).length;
};

const countParagraphs = (text) => {
  if (!text.trim()) return 0;
  return text
    .split(/\n+/)
    .filter((para) => para.trim().length > 0).length;
};

const getWordDensity = (text) => {
  if (!text.trim()) return [];

  const normalized = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = normalized.split(/\s+/).filter((word) => word.length > 0);

  const frequency = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency).sort((a, b) => b[1] - a[1]);
};

export default function Home() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [text, setText] = useState("");
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [aboutContent, setAboutContent] = useState("");
    const [footerYear, setFooterYear] = useState(new Date().getFullYear());
    const [headingSettings, setHeadingSettings] = useState({
      h1Text: 'Character Counter',
      h2Text: 'Analyze your text with confidence',
      h3Text: 'Statistics',
      h4Text: 'About This Tool',
      tone: 'professional',
    });

    useEffect(() => {
    const savedText = localStorage.getItem("textAnalyzerContent");
    const savedLanguage = localStorage.getItem("preferredLanguage");
    
    if (savedText) {
        setText(savedText);
    }

    if (savedLanguage && savedLanguage !== locale) {
        router.replace(pathname, { locale: savedLanguage });
    }

    fetchAboutContent();
    }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success && data.settings) {
        setAboutContent(data.settings.aboutContent || t('aboutContent'));
        if (Number.isInteger(data.settings.footerCopyrightYear)) {
          setFooterYear(data.settings.footerCopyrightYear);
        }
        if (data.settings.headingSettings) {
          setHeadingSettings({
            h1Text: data.settings.headingSettings.h1Text || 'Character Counter',
            h2Text: data.settings.headingSettings.h2Text || 'Analyze your text with confidence',
            h3Text: data.settings.headingSettings.h3Text || 'Statistics',
            h4Text: data.settings.headingSettings.h4Text || 'About This Tool',
            tone: data.settings.headingSettings.tone || 'professional',
          });
        }
      } else {
        setAboutContent(t('aboutContent'));
      }
    } catch (error) {
      setAboutContent(t('aboutContent'));
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    localStorage.setItem("textAnalyzerContent", newText);
  };

  const handleLanguageChange = (langCode) => {
    localStorage.setItem("preferredLanguage", langCode);
    setShowLanguageMenu(false);
    router.replace(pathname, { locale: langCode });
  };

  const {
    characterCount,
    wordCount,
    spaceCount,
    sentenceCount,
    paragraphCount,
    topWords,
  } = useMemo(() => {
    const characterCount = text.length;
    const wordCount = countWords(text);
    const spaceCount = countSpaces(text);
    const sentenceCount = countSentences(text);
    const paragraphCount = countParagraphs(text);
    const topWords = getWordDensity(text);

    return {
      characterCount,
      wordCount,
      spaceCount,
      sentenceCount,
      paragraphCount,
      topWords,
    };
  }, [text]);

  const isProfessionalTone = headingSettings.tone === 'professional';

  return (
    <>
    <main className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Side Menu Drawer */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('menu')}
                </h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => {
                    router.push('/about-us', { locale });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('aboutUs')}
                </button>
                <button 
                  onClick={() => {
                    router.push('/contact-us', { locale });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('contactUs')}
                </button>
                <button
                  onClick={() => {
                    router.push('/blog', { locale });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Blog
                </button>
                <button 
                  onClick={() => {
                    router.push('/terms-conditions', { locale });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('termsConditions')}
                </button>
                <button
                  onClick={() => {
                    router.push('/privacy-policy', { locale });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 13h6m-9 8h14a2 2 0 002-2V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 3h-1.172a1 1 0 00-.707.293L9.293 4.707A1 1 0 018.586 5H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Privacy Policy
                </button>
                <button 
                  onClick={() => {
                    router.push('/disclaimer', { locale });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {t('disclaimer')}
                </button>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <a
                  href="/admin/login"
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors text-gray-700 font-medium flex items-center gap-3 border border-purple-200"
                >
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Panel
                </a>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Left Sidebar */}
      <aside className="w-full lg:w-80 bg-white/80 backdrop-blur-sm shadow-2xl overflow-y-auto border-b lg:border-b-0 lg:border-r border-indigo-100">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Section 1: Menu and Language */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setShowMenu(true)}
                className="flex items-center gap-2 rounded-lg px-2 py-1"
              >
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="font-semibold text-gray-700">{t('menu')}</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1"
                >
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="font-semibold text-gray-700">{t('language')}</span>
                </button>
                
                {showLanguageMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-indigo-200 py-2 z-50 min-w-45">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors flex items-center gap-2 ${
                            locale === lang.code ? "bg-indigo-100 font-semibold" : ""
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-sm text-gray-900">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Statistics */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 shadow-sm">
            <h3 className={`text-lg mb-4 ${isProfessionalTone ? 'font-semibold text-slate-800' : 'font-bold text-gray-800'}`}>
              {headingSettings.h3Text || t('statistics')}
            </h3>
            
            {/* Row 1: Words and Characters */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                <p className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {wordCount}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('words')}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {characterCount}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('characters')}</p>
              </div>
            </div>

            {/* Row 2: Sentences and Paragraphs */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {sentenceCount}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('sentences')}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                <p className="text-2xl font-bold bg-linear-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  {paragraphCount}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('paragraphs')}</p>
              </div>
            </div>

            {/* Row 3: Spaces */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <p className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {spaceCount}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('spaces')}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Word Density */}
          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 shadow-sm">
            <h3 className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {t('wordDensity')}
            </h3>

            {topWords.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {topWords.slice(0, 10).map(([word, count]) => {
                  const percentage = Math.round((count / wordCount) * 100);
                  return (
                    <div
                      key={word}
                      className="bg-white/70 rounded-lg p-2 border border-purple-100 hover:bg-white/90 transition-all duration-200"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800 truncate max-w-25">
                          {word}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {count}
                          </span>
                          <span className="text-xs font-semibold text-gray-600">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4 italic">
                {t('startTyping')}
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Center Text Analyzer Section */}
      <section className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 shrink-0 py-2">
            <img src="/app-logo.svg" alt="Character Count Online Tool logo" className="w-14 h-14" />
            <h1 className={`text-center ${isProfessionalTone ? 'text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900' : 'text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm'}`}>
              {headingSettings.h1Text || t('characterCounter')}
            </h1>
            <h2 className={`text-center text-base sm:text-lg ${isProfessionalTone ? 'text-slate-600 font-medium' : 'text-indigo-700 font-semibold'}`}>
              {headingSettings.h2Text || 'Analyze your text with confidence'}
            </h2>
          </div>

          {/* Text Input Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-indigo-100 flex-1 flex flex-col min-h-0">
            <label
              htmlFor="text-input"
              className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide shrink-0"
            >
              {t('enterText')}
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder={t('placeholder')}
              className="w-full flex-1 p-5 border-2 border-indigo-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 text-black text-base lg:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm overflow-y-auto"
              aria-label="Text input for analysis"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <aside className="w-full lg:w-80 bg-white/80 backdrop-blur-sm shadow-2xl overflow-y-auto border-t lg:border-t-0 lg:border-l border-indigo-100">
        <div className="p-4 sm:p-6">
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200 shadow-sm">
            <h4 className={`text-xl mb-4 flex items-center gap-2 ${isProfessionalTone ? 'font-semibold text-slate-800' : 'font-bold text-gray-800'}`}>
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {headingSettings.h4Text || t('aboutTitle')}
            </h4>
            <div className="text-gray-700 space-y-3 text-sm">
              <div className="leading-relaxed">
                {aboutContent && aboutContent.split('\n').map((line, index) => {
                  if (line.match(/^\*\*.*\*\*$/)) {
                    return <p key={index} className="font-bold mt-3">{line.replace(/\*\*/g, '')}</p>;
                  }
                  return line ? <p key={index} className="mb-2">{line}</p> : <div key={index} className="h-2" />;
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
    <SiteFooter locale={locale} footerYear={footerYear} />
    </>
  );
}
