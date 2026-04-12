import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export async function getPublicPageSettings() {
  try {
    await connectDB();
    return await Settings.findOne()
      .select(
        [
          "aboutUsContent",
          "contactUsContent",
          "contactUsEmail",
          "privacyPolicyContent",
          "termsConditionsContent",
          "disclaimerContent",
          "socialLinks",
          "pageClosingTexts",
          "staticPagesLastUpdated",
          "updatedAt",
          "createdAt",
        ].join(" ")
      )
      .lean();
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
