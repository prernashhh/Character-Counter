"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import NextLink from 'next/link';
import { getBlogUi } from '@/lib/blog-ui-text';

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

const countSpecialCharacters = (text) => {
  return (text.match(/[^\p{L}\p{N}\s]/gu) || []).length;
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

const HOME_SETTINGS_CACHE_KEY = 'homeSettingsCacheV1';

const getDefaultHeadingSettings = () => ({
  h1Text: 'Character Counter',
  h2Text: '',
  h3Text: 'Statistics',
  h4Text: 'About Character Counter Tool',
  tone: 'professional',
});

const getDefaultHomeSeo = () => ({
  h1: 'Character Counter',
  h2: '',
  h3: 'Statistics',
  h4: 'About Character Counter Tool',
  h5: '',
  h6: '',
});

const getDefaultSocialLinks = () => ({
  instagramUrl: 'https://instagram.com/',
  linkedinUrl: 'https://linkedin.com/in/',
  emailAddress: 'iamdineshswami@gmail.com',
});

const translateWithFallback = (translator, key, fallback) => {
  try {
    const translated = translator(key);
    if (typeof translated !== 'string') return fallback;

    const normalized = translated.trim();
    if (!normalized || normalized === key) {
      return fallback;
    }

    return translated;
  } catch {
    return fallback;
  }
};

const resolveLocalizedHeading = (value, localizedFallback, englishDefaults = []) => {
  const normalizedValue = (value || '').trim();
  if (!normalizedValue) return localizedFallback;

  const lowerValue = normalizedValue.toLowerCase();
  const matchesEnglishDefault = englishDefaults.some(
    (defaultValue) => defaultValue.toLowerCase() === lowerValue
  );

  return matchesEnglishDefault ? localizedFallback : normalizedValue;
};

const HOME_H1_ENGLISH_DEFAULTS = [
  'Character Counter',
  'Character Count Online Tool',
  'Free Online Character Counter Tool',
  'Free Online Character Count Tool',
];

const HOME_H2_ENGLISH_DEFAULTS = [
  'Analyze your text with confidence',
  'Analyze your text',
];

export default function HomePageClient() {
    const t = useTranslations();
    const locale = useLocale();
  const blogUi = useMemo(() => getBlogUi(locale), [locale]);
    const router = useRouter();
    const pathname = usePathname();
    const [text, setText] = useState("");
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [footerYear, setFooterYear] = useState(new Date().getFullYear());
    const [homeSeo, setHomeSeo] = useState(getDefaultHomeSeo);
    const [headingSettings, setHeadingSettings] = useState(getDefaultHeadingSettings);
    const [socialLinks, setSocialLinks] = useState(getDefaultSocialLinks);

  async function fetchAboutContent() {
    try {
      const response = await fetch(`/api/settings?scope=home&locale=${locale}`, { cache: 'force-cache' });
      const data = await response.json();
      if (data.success && data.settings) {
        const nextFooterYear = Number.isInteger(data.settings.footerCopyrightYear)
          ? data.settings.footerCopyrightYear
          : new Date().getFullYear();
        const nextHeadingSettings = {
          ...getDefaultHeadingSettings(),
          ...(data.settings.headingSettings || {}),
        };
        const nextHomeSeo = {
          ...getDefaultHomeSeo(),
          ...(data.settings.seoSettings?.home || {}),
        };
        const nextSocialLinks = {
          ...getDefaultSocialLinks(),
          ...(data.settings.socialLinks || {}),
        };

        setFooterYear(nextFooterYear);
        setHeadingSettings(nextHeadingSettings);
        setHomeSeo(nextHomeSeo);
        setSocialLinks(nextSocialLinks);

        localStorage.setItem(
          HOME_SETTINGS_CACHE_KEY,
          JSON.stringify({
            footerCopyrightYear: nextFooterYear,
            headingSettings: nextHeadingSettings,
            homeSeo: nextHomeSeo,
            socialLinks: nextSocialLinks,
          })
        );
      }
    } catch (error) {}
  }

    useEffect(() => {
    const savedText = localStorage.getItem("textAnalyzerContent");
    const savedLanguage = localStorage.getItem("preferredLanguage");
    
    if (savedText) {
        setText(savedText);
    }

    if (savedLanguage && savedLanguage !== locale) {
        router.replace(pathname, { locale: savedLanguage });
    }

    const cachedSettings = localStorage.getItem(HOME_SETTINGS_CACHE_KEY);
    if (cachedSettings) {
      try {
        const parsed = JSON.parse(cachedSettings);
        if (Number.isInteger(parsed.footerCopyrightYear)) {
          setFooterYear(parsed.footerCopyrightYear);
        }
        if (parsed.headingSettings) {
          setHeadingSettings({
            ...getDefaultHeadingSettings(),
            ...parsed.headingSettings,
          });
        }
        if (parsed.homeSeo) {
          setHomeSeo({
            ...getDefaultHomeSeo(),
            ...parsed.homeSeo,
          });
        }
        if (parsed.socialLinks) {
          setSocialLinks({
            ...getDefaultSocialLinks(),
            ...parsed.socialLinks,
          });
        }
      } catch {
      }
    }

    fetchAboutContent();
    }, []);

  useEffect(() => {
    const menuRoutes = ['/about-us', '/contact-us', '/blog', '/terms-conditions', '/privacy-policy', '/disclaimer'];

    // Warm route bundles in the background for snappier menu navigation.
    menuRoutes.forEach((route) => {
      router.prefetch(route, { locale });
    });
  }, [router, locale]);

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
    specialCharCount,
    sentenceCount,
    paragraphCount,
    topWords,
  } = useMemo(() => {
    const characterCount = text.length;
    const wordCount = countWords(text);
    const spaceCount = countSpaces(text);
    const specialCharCount = countSpecialCharacters(text);
    const sentenceCount = countSentences(text);
    const paragraphCount = countParagraphs(text);
    const topWords = getWordDensity(text);

    return {
      characterCount,
      wordCount,
      spaceCount,
      specialCharCount,
      sentenceCount,
      paragraphCount,
      topWords,
    };
  }, [text]);

  const isProfessionalTone = headingSettings.tone === 'professional';
  const connectWithUsLabel = translateWithFallback(
    t,
    'connectWithUs',
    translateWithFallback(t, 'socialMedia', 'Connect with us')
  );
  const specialCharactersLabel = translateWithFallback(
    t,
    'specialCharacters',
    `Special ${translateWithFallback(t, 'characters', 'Characters')}`
  );
  const aboutText = translateWithFallback(
    t,
    'aboutText',
    'This character counter tool helps you analyze your text in real time. Whether you are writing an essay, a blog post, or a social media caption, you can quickly check the number of characters, words, sentences, and paragraphs.'
  );
  const statisticsTitleText = translateWithFallback(t, 'statisticsTitle', 'Statistics');
  const statisticsText = translateWithFallback(
    t,
    'statisticsText',
    'Get detailed insights into your content including total words, characters, sentences, paragraphs, and spaces. This helps you understand the structure and readability of your text.'
  );
  const wordDensityTitleText = translateWithFallback(t, 'wordDensityTitle', 'Word Density');
  const wordDensityText = translateWithFallback(
    t,
    'wordDensityText',
    'Track how often specific words appear in your content. This is useful for improving keyword usage and optimizing your writing for SEO.'
  );
  const whyUseTitle = translateWithFallback(t, 'whyUseTitle', 'Why Use a Character Counter Tool');
  const whyUseText = translateWithFallback(
    t,
    'whyUseText',
    'Character limits are important for platforms like Twitter, Instagram, and SEO writing. This tool ensures your content fits within limits while staying clear and effective.'
  );
  const howItWorksTitle = translateWithFallback(t, 'howItWorksTitle', 'How It Works');
  const howItWorksText = translateWithFallback(
    t,
    'howItWorksText',
    'Simply paste or type your text into the editor. The tool automatically calculates and displays counts instantly without needing to refresh the page.'
  );
  const faqTitle = translateWithFallback(t, 'faqTitle', 'Frequently Asked Questions (FAQ)');
  const faqQuestion1 = translateWithFallback(t, 'faqQuestion1', "1. What's a Character Counter?");
  const faqAnswer1 = translateWithFallback(
    t,
    'faqAnswer1',
    'A character counter is a tool that counts the number of characters in a piece of text, including or excluding spaces.'
  );
  const faqQuestion2 = translateWithFallback(t, 'faqQuestion2', '2. How do I use it?');
  const faqAnswer2 = translateWithFallback(
    t,
    'faqAnswer2',
    'Type or paste your text into the input box and the tool will automatically calculate all counts.'
  );
  const faqQuestion3 = translateWithFallback(t, 'faqQuestion3', '3. Is it free?');
  const faqAnswer3 = translateWithFallback(
    t,
    'faqAnswer3',
    'Yes, this tool is completely free to use with no limits or subscriptions.'
  );
  const faqQuestion4 = translateWithFallback(t, 'faqQuestion4', '4. Do spaces count as characters?');
  const faqAnswer4 = translateWithFallback(
    t,
    'faqAnswer4',
    'Yes, you can view counts both with and without spaces.'
  );
  const faqQuestion5 = translateWithFallback(t, 'faqQuestion5', '5. Can I use it for essays or blog posts?');
  const faqAnswer5 = translateWithFallback(
    t,
    'faqAnswer5',
    'Yes. It works well for essays, blog posts, captions, and SEO writing.'
  );
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faqQuestion1,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswer1,
        },
      },
      {
        "@type": "Question",
        name: faqQuestion2,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswer2,
        },
      },
      {
        "@type": "Question",
        name: faqQuestion3,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswer3,
        },
      },
      {
        "@type": "Question",
        name: faqQuestion4,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswer4,
        },
      },
      {
        "@type": "Question",
        name: faqQuestion5,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswer5,
        },
      },
    ],
  };
  const socialHandlesBlock = (
    <>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 text-center">{connectWithUsLabel}</h2>
      <div className="flex items-center justify-center gap-3">
        <a
          href={socialLinks.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="group w-10 h-10 rounded-full bg-linear-to-br from-fuchsia-500 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 3h-8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5v-8a5 5 0 00-5-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.5 6.5h.01" />
          </svg>
        </a>
        <a
          href={socialLinks.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="group w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm hover:scale-105 hover:shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.94 8.5a1.56 1.56 0 110-3.12 1.56 1.56 0 010 3.12zM5.5 9.75h2.88V19H5.5V9.75zm4.6 0h2.76v1.27h.04c.38-.73 1.33-1.5 2.74-1.5 2.93 0 3.47 1.93 3.47 4.44V19h-2.88v-3.95c0-.94-.02-2.15-1.31-2.15-1.32 0-1.52 1.03-1.52 2.08V19H10.1V9.75z" />
          </svg>
        </a>
        <a
          href={`mailto:${socialLinks.emailAddress}`}
          aria-label="Email"
          className="group w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm hover:scale-105 hover:shadow-md hover:bg-emerald-600 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </>
  );
  const introBlock = (
    <div className="w-full flex flex-col items-center gap-1 shrink-0 py-1 xl:py-2">
      <a
        href="https://charactercountonlinetool.com/"
        className="order-1 block mx-auto focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"
        aria-label="Open Character Counter"
      >
        <img
          src="/Charater Count Favicon Logo.png"
          alt="Character Count Online Tool logo"
          className="block w-20 h-20 sm:w-24 sm:h-24 lg:w-20 lg:h-20"
          loading="eager"
          decoding="sync"
        />
      </a>
      <div className="order-2 relative text-center">
        <p
          role="heading"
          aria-level={1}
          className="text-center text-balance text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
        >
          {resolveLocalizedHeading(homeSeo.h1, t('characterCounter'), HOME_H1_ENGLISH_DEFAULTS)}
        </p>
      </div>
      <p className={`order-3 text-center text-base sm:text-lg lg:text-sm xl:text-base ${isProfessionalTone ? 'text-slate-600 font-medium' : 'text-indigo-700 font-semibold'}`}>
        {resolveLocalizedHeading(homeSeo.h2, t('analyzeYourText'), HOME_H2_ENGLISH_DEFAULTS)}
      </p>
      {homeSeo.h5 && <p className="order-5 text-center text-sm text-slate-500">{homeSeo.h5}</p>}
      {homeSeo.h6 && <p className="order-6 text-center text-xs text-slate-500">{homeSeo.h6}</p>}
    </div>
  );

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
                <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('menu')}
                </h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-lg transition-all duration-200 ease-out hover:bg-gray-100 hover:rotate-90 hover:shadow-sm active:rotate-0"
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
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('aboutUs')}
                </button>
                <button 
                  onClick={() => {
                    router.push('/contact-us', { locale });
                    setShowMenu(false);
                  }}
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('contactUs')}
                </button>
                <button
                  onClick={() => {
                    router.push('/blog', { locale });
                    setShowMenu(false);
                  }}
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  {blogUi.blogTitle}
                </button>
                <button 
                  onClick={() => {
                    router.push('/terms-conditions', { locale });
                    setShowMenu(false);
                  }}
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('termsConditions')}
                </button>
                <button
                  onClick={() => {
                    router.push('/privacy-policy', { locale });
                    setShowMenu(false);
                  }}
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 13h6m-9 8h14a2 2 0 002-2V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 3h-1.172a1 1 0 00-.707.293L9.293 4.707A1 1 0 018.586 5H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('privacyData')}
                </button>
                <button 
                  onClick={() => {
                    router.push('/disclaimer', { locale });
                    setShowMenu(false);
                  }}
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-indigo-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {t('disclaimer')}
                </button>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <NextLink
                  href="/admin/login"
                  className="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-out text-gray-700 font-medium flex items-center gap-3 border border-purple-200 hover:-translate-y-0.5 hover:bg-white hover:text-gray-900 hover:shadow-md active:translate-y-0"
                >
                  <svg className="w-5 h-5 text-purple-600 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Panel
                </NextLink>
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
                <h3 className="font-semibold text-gray-700">{t('menu')}</h3>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1"
                >
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <h3 className="font-semibold text-gray-700">{t('language')}</h3>
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

          <div className="lg:hidden bg-white/80 rounded-xl p-4 border border-indigo-100 shadow-sm">
            {introBlock}
          </div>

          {/* Mobile Text Input (shown above stats/cards) */}
          <div className="lg:hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-indigo-100 flex flex-col">
            <label
              htmlFor="text-input-mobile"
              className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide"
            >
              {t('enterText')}
            </label>
            <textarea
              id="text-input-mobile"
              value={text}
              onChange={handleTextChange}
              placeholder={t('placeholder')}
              className="w-full h-80 p-4 border-2 border-indigo-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 text-black text-base transition-all duration-200 bg-white/50 backdrop-blur-sm overflow-y-auto"
              aria-label="Text input for analysis"
            />
          </div>

          {/* Section 2: Statistics */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 shadow-sm">
            <h2 className={`text-lg mb-4 ${isProfessionalTone ? 'font-semibold text-slate-800' : 'font-bold text-gray-800'}`}>
              {homeSeo.h3 || t('statistics')}
            </h2>
            
            {/* Row 1: Words and Characters */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                <p className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {wordCount}
                </p>
                <h4 className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('words')}</h4>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {characterCount}
                </p>
                <h4 className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('characters')}</h4>
              </div>
            </div>

            {/* Row 2: Sentences and Paragraphs */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {sentenceCount}
                </p>
                <h4 className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('sentences')}</h4>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-rose-100">
                <p className="text-2xl font-bold bg-linear-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  {paragraphCount}
                </p>
                <h4 className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('paragraphs')}</h4>
              </div>
            </div>

            {/* Row 3: Spaces */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <p className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {spaceCount}
                </p>
                <h4 className="text-xs font-semibold text-gray-600 mt-1 uppercase">{t('spaces')}</h4>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
                <p className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {specialCharCount}
                </p>
                <h4 className="text-xs font-semibold text-gray-600 mt-1 uppercase">{specialCharactersLabel}</h4>
              </div>
            </div>
          </div>

          {/* Section 3: Word Density */}
          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 shadow-sm">
            <h2 className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {t('wordDensity')}
            </h2>

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

          <div className="hidden lg:block bg-white/80 rounded-xl p-4 border border-indigo-100 shadow-sm">
            {socialHandlesBlock}
          </div>
        </div>
      </aside>

      {/* Center Text Analyzer Section */}
      <section className="hidden lg:flex flex-1 flex-col min-h-0 px-4 sm:px-6 lg:px-6 xl:px-8 py-3 xl:py-4 overflow-y-auto">
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto h-full min-h-0 flex flex-col gap-2 xl:gap-3">
          <div className="w-full">
            {introBlock}
          </div>

          {/* Text Input Section */}
          <div className=" desktop-text-input-short-screen bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-3 xl:p-4 border border-indigo-100 flex-1 flex flex-col min-h-0 xl:min-h-104 pb-3 xl:pb-4">
            <label
              htmlFor="text-input"
              className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide shrink-0"
            >
              {t('enterText')}
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder={t('placeholder')}
              className="desktop-textarea-short-screen w-full flex-1 p-4 border-2 border-indigo-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 text-black text-base lg:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm overflow-y-auto"
              aria-label="Text input for analysis"
            />
          </div>

          {/* Footer Section - Desktop Only */}
          <div className="desktop-footer-short-screen hidden lg:block xl:sticky xl:bottom-0 z-10 bg-linear-to-r from-indigo-50/95 via-sky-50/95 to-violet-50/95 rounded-2xl p-2 xl:p-3 shrink-0 backdrop-blur-sm border border-indigo-100/60">
            <div className="text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-1.5">
              <p className="text-center sm:text-left">Copyright © {footerYear} Character Count Online Tool. All rights reserved.</p>
              <div className="desktop-footer-links flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                <Link href="/about-us" className="text-indigo-700 hover:text-indigo-900 transition-colors">
                  {t('aboutUs')}
                </Link>
                <span aria-hidden="true" className="text-slate-500">|</span>
                <Link href="/contact-us" className="text-indigo-700 hover:text-indigo-900 transition-colors">
                  {t('contactUs')}
                </Link>
                <span aria-hidden="true" className="text-slate-500">|</span>
                <Link href="/privacy-policy" className="text-indigo-700 hover:text-indigo-900 transition-colors">
                  {t('privacyData')}
                </Link>
                <span aria-hidden="true" className="text-slate-500">|</span>
                <Link href="/terms-conditions" className="text-indigo-700 hover:text-indigo-900 transition-colors">
                  {t('termsConditions')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <aside className="w-full lg:w-80 bg-white/80 backdrop-blur-sm shadow-2xl overflow-y-auto border-t lg:border-t-0 lg:border-l border-indigo-100">
        <div className="p-4 sm:p-6">
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200 shadow-sm mb-5">
            <h2 className={`text-xl mb-4 flex items-center gap-2 ${isProfessionalTone ? 'font-semibold text-slate-800' : 'font-bold text-gray-800'}`}>
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {homeSeo.h4 || t('aboutTitle')}
            </h2>
            <div className="text-gray-700 space-y-3 text-sm">
              <div className="leading-relaxed">
                <div className="prose prose-sm max-w-none text-slate-700 [&_p]:mb-4 [&_p]:leading-7 [&_p:last-child]:mb-0 [&_h2]:text-lg [&_h3]:text-base">
                  <p>{aboutText}</p>

                  <h2>{statisticsTitleText}</h2>
                  <p>{statisticsText}</p>

                  <h2>{wordDensityTitleText}</h2>
                  <p>{wordDensityText}</p>

                  <h2>{whyUseTitle}</h2>
                  <p>{whyUseText}</p>

                  <h2>{howItWorksTitle}</h2>
                  <p>{howItWorksText}</p>

                  <h2>{faqTitle}</h2>
                  <h3>{faqQuestion1}</h3>
                  <p>{faqAnswer1}</p>
                  <h3>{faqQuestion2}</h3>
                  <p>{faqAnswer2}</p>
                  <h3>{faqQuestion3}</h3>
                  <p>{faqAnswer3}</p>
                  <h3>{faqQuestion4}</h3>
                  <p>{faqAnswer4}</p>
                  <h3>{faqQuestion5}</h3>
                  <p>{faqAnswer5}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden bg-white/80 rounded-xl p-4 border border-indigo-100 shadow-sm">
            {socialHandlesBlock}
          </div>
        </div>
      </aside>
    </main>

    {/* Footer - Mobile/Tablet */}
    <footer className="lg:hidden bg-linear-to-r from-indigo-50/90 via-sky-50/90 to-violet-50/90">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-center sm:text-left">Copyright © {footerYear} Character Count Online Tool. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
            <Link href="/about-us" className="text-indigo-700 hover:text-indigo-900 transition-colors">
              {t('aboutUs')}
            </Link>
            <span aria-hidden="true" className="text-slate-500">|</span>
            <Link href="/contact-us" className="text-indigo-700 hover:text-indigo-900 transition-colors">
              {t('contactUs')}
            </Link>
            <span aria-hidden="true" className="text-slate-500">|</span>
            <Link href="/privacy-policy" className="text-indigo-700 hover:text-indigo-900 transition-colors">
              {t('privacyData')}
            </Link>
            <span aria-hidden="true" className="text-slate-500">|</span>
            <Link href="/terms-conditions" className="text-indigo-700 hover:text-indigo-900 transition-colors">
              {t('termsConditions')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
    </>
  );
}
