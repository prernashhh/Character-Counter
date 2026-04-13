const BASE_URL = "https://charactercountonlinetool.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login"]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}