export default function sitemap() {
  const baseUrl = "https://character-counter-gray.vercel.app";
  const blogSlugs = [
    "instagram-character-limit-explained-2026-guide",
    "twitter-character-limit-everything-you-need-to-know",
    "how-many-words-is-1000-characters",
    "best-character-count-for-seo-content",
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
