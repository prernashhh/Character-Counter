const BASE_URL = "https://charactercountonlinetool.com";

export default function sitemap() {
  return [
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/en/blog`,
      lastModified: new Date(),
    },
  ];
}
