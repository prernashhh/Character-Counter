import connectDB from "@/lib/db";
import Post from "@/models/Post";

const BASE_URL = "https://charactercountonlinetool.com";

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
  "/terms-conditions",
  "/blog",
];

function toAbsoluteUrl(pathname) {
  const safePath = pathname === "/" ? "" : pathname;
  return `${BASE_URL}${safePath}`;
}

async function getDynamicBlogEntries() {
  try {
    await connectDB();

    const posts = await Post.find({ published: true })
      .select("slug updatedAt publishDate createdAt")
      .lean();

    return posts
      .filter((post) => typeof post?.slug === "string" && post.slug.trim().length > 0)
      .map((post) => ({
        url: toAbsoluteUrl(`/blog/${post.slug.trim()}`),
        lastModified: post.updatedAt || post.publishDate || post.createdAt || new Date(),
      }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified: now,
  }));

  const dynamicBlogEntries = await getDynamicBlogEntries();

  const dedupedByUrl = new Map();
  [...staticEntries, ...dynamicBlogEntries].forEach((entry) => {
    if (!dedupedByUrl.has(entry.url)) {
      dedupedByUrl.set(entry.url, entry);
    }
  });

  return Array.from(dedupedByUrl.values());
}
