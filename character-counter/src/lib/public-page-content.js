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
