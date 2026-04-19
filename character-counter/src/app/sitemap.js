import connectDB from "@/lib/db";
import { routing } from "@/i18n/routing";
import Post from "@/models/Post";

const BASE_URL = "https://charactercountonlinetool.com";
const SUPPORTED_LOCALES = routing.locales;
const DEFAULT_LOCALE = routing.defaultLocale;

export const revalidate = 60;

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
  "/terms-conditions",
  "/disclaimer",
  "/blog",
];

function toAbsoluteUrl(pathname) {
  const safePath = pathname === "/" ? "" : pathname;
  return `${BASE_URL}${safePath}`;
}

function toLocalizedPath(pathname, locale) {
  if (locale === DEFAULT_LOCALE) {
    return pathname;
  }

  if (pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathname}`;
}

function getLocalizedEntriesForPath(pathname, lastModified) {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: toAbsoluteUrl(toLocalizedPath(pathname, locale)),
    lastModified,
  }));
}

async function getDynamicBlogEntries() {
  try {
    await connectDB();

    const posts = await Post.find({ published: true })
      .select("slug updatedAt publishDate createdAt")
      .lean();

    return posts
      .filter((post) => typeof post?.slug === "string" && post.slug.trim().length > 0)
      .map((post) => {
        const slug = post.slug.trim();
        const path = `/blog/${slug}`;
        const lastModified = post.updatedAt || post.publishDate || post.createdAt || new Date();

        return {
          url: toAbsoluteUrl(path),
          lastModified,
        };
      });
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    getLocalizedEntriesForPath(path, now)
  );

  const dynamicBlogEntries = await getDynamicBlogEntries();

  const dedupedByUrl = new Map();
  [...staticEntries, ...dynamicBlogEntries].forEach((entry) => {
    if (!dedupedByUrl.has(entry.url)) {
      dedupedByUrl.set(entry.url, entry);
    }
  });

  return Array.from(dedupedByUrl.values());
}
