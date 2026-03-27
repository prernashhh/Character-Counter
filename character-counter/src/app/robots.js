export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: "https://character-counter-gray.vercel.app/sitemap.xml"
  };
}
