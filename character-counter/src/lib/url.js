const BASE_URL = "https://charactercountonlinetool.com";
const DEFAULT_LOCALE = "en";

const LOCALES = new Set([
  "en",
  "af",
  "bs",
  "id",
  "de",
  "es",
  "fr",
  "it",
  "hu",
  "nl",
  "no",
  "pt",
  "fi",
  "sv",
  "tr",
  "ar",
  "zh",
  "el",
  "hi",
]);

export function buildCanonicalUrl(pathname = "", locale = DEFAULT_LOCALE) {
  const normalizedPath = String(pathname || "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const pathSegments = normalizedPath ? normalizedPath.split("/") : [];

  // Canonical URLs should be locale-neutral for localized routes.
  if (pathSegments.length > 0 && LOCALES.has(pathSegments[0])) {
    pathSegments.shift();
  }

  const localeCandidate = String(locale || "").trim().toLowerCase();
  if (localeCandidate && pathSegments.length > 0 && pathSegments[0] === localeCandidate) {
    pathSegments.shift();
  }

  const pathSuffix = pathSegments.length ? `/${pathSegments.join("/")}` : "";

  return `${BASE_URL}${pathSuffix}`;
}

export { BASE_URL, DEFAULT_LOCALE };