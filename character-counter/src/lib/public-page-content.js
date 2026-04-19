import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

function getLocaleBlock(localizedContent, locale) {
  if (!localizedContent || !locale || locale === 'en') {
    return null;
  }

  if (typeof localizedContent.get === 'function') {
    return localizedContent.get(locale) || null;
  }

  return localizedContent[locale] || null;
}

export async function getPublicPageSettings(locale = 'en') {
  try {
    await connectDB();
    const settings = await Settings.findOne()
      .select(
        [
          "aboutUsContent",
          "aboutContent",
          "contactUsContent",
          "contactUsEmail",
          "privacyPolicyContent",
          "termsConditionsContent",
          "disclaimerContent",
          "socialLinks",
          "pageClosingTexts",
          "localizedContent",
          "staticPagesLastUpdated",
          "updatedAt",
          "createdAt",
        ].join(" ")
      )
      .lean();

    if (!settings) {
      return null;
    }

    const normalizedLocale = String(locale || 'en').toLowerCase();
    const isDefaultLocale = normalizedLocale === 'en';
    const localeBlock = getLocaleBlock(settings.localizedContent, normalizedLocale) || {};

    const fallbackOrNull = (localizedValue, defaultValue) =>
      localizedValue ?? (isDefaultLocale ? defaultValue : null);

    return {
      ...settings,
      aboutContent: fallbackOrNull(localeBlock.aboutContent, settings.aboutContent),
      aboutUsContent: fallbackOrNull(localeBlock.aboutUsContent, settings.aboutUsContent),
      contactUsContent: fallbackOrNull(localeBlock.contactUsContent, settings.contactUsContent),
      contactUsEmail: localeBlock.contactUsEmail ?? settings.contactUsEmail,
      privacyPolicyContent: fallbackOrNull(localeBlock.privacyPolicyContent, settings.privacyPolicyContent),
      termsConditionsContent: fallbackOrNull(localeBlock.termsConditionsContent, settings.termsConditionsContent),
      disclaimerContent: fallbackOrNull(localeBlock.disclaimerContent, settings.disclaimerContent),
      pageClosingTexts: isDefaultLocale
        ? {
            ...(settings.pageClosingTexts || {}),
            ...(localeBlock.pageClosingTexts || {}),
          }
        : {
            ...(localeBlock.pageClosingTexts || {}),
          },
    };
  } catch {
    return null;
  }
}

export async function getHomePageSettings(locale = 'en') {
  try {
    await connectDB();
    const settings = await Settings.findOne()
      .select(
        [
          "aboutContent",
          "headingSettings",
          "socialLinks",
          "footerCopyrightYear",
          "localizedContent",
        ].join(" ")
      )
      .lean();

    if (!settings) {
      return {
        aboutContent: '',
        headingSettings: {
          h1Text: 'Character Counter',
          h2Text: '',
          h3Text: 'Statistics',
          h4Text: 'About Character Counter Tool',
          tone: 'professional',
        },
        socialLinks: {
          instagramUrl: 'https://instagram.com/',
          linkedinUrl: 'https://linkedin.com/in/',
          emailAddress: 'charactercountonlinetool@gmail.com',
        },
        footerCopyrightYear: new Date().getFullYear(),
      };
    }

    const normalizedLocale = String(locale || 'en').toLowerCase();
    const localeBlock = getLocaleBlock(settings.localizedContent, normalizedLocale) || {};

    return {
      aboutContent: localeBlock.aboutContent ?? settings.aboutContent ?? '',
      headingSettings: settings.headingSettings ?? {
        h1Text: 'Character Counter',
        h2Text: '',
        h3Text: 'Statistics',
        h4Text: 'About Character Counter Tool',
        tone: 'professional',
      },
      socialLinks: settings.socialLinks ?? {
        instagramUrl: 'https://instagram.com/',
        linkedinUrl: 'https://linkedin.com/in/',
        emailAddress: 'charactercountonlinetool@gmail.com',
      },
      footerCopyrightYear: settings.footerCopyrightYear ?? new Date().getFullYear(),
    };
  } catch {
    return {
      aboutContent: '',
      headingSettings: {
        h1Text: 'Character Counter',
        h2Text: '',
        h3Text: 'Statistics',
        h4Text: 'About Character Counter Tool',
        tone: 'professional',
      },
      socialLinks: {
        instagramUrl: 'https://instagram.com/',
        linkedinUrl: 'https://linkedin.com/in/',
        emailAddress: 'charactercountonlinetool@gmail.com',
      },
      footerCopyrightYear: new Date().getFullYear(),
    };
  }
}

export function formatLastUpdated(value, locale = "en") {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPlainTextAsHtml(content = "") {
  const trimmed = String(content || "").trim();
  if (!trimmed) return "";

  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (hasHtmlTags) {
    return trimmed;
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}
