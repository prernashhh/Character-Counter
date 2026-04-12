import { notFound } from "next/navigation";
import { buildCanonicalUrl } from "@/lib/url";
import SeoBlogTemplate from "@/components/blog/SeoBlogTemplate";

const BASE_URL = "https://charactercountonlinetool.com";

const BLOG_POSTS = {
  "best-character-count-for-seo-content": {
    title: "Best Character Count for SEO Content",
    description:
      "Learn practical character count ranges for titles, meta descriptions, headings, and on-page copy with an editorial workflow that keeps content readable and SEO-friendly.",
    intro:
      "Character limits are not the goal of SEO writing, but they are an important quality control step. When titles, descriptions, and headings are sized well, users understand your page faster and click with more confidence.",
    sections: [
      {
        heading: "Use Character Ranges as Guardrails",
        paragraphs: [
          "Treat SEO length ranges as practical guardrails, not fixed rules. In most cases, title tags perform best when they stay concise and specific. Meta descriptions should summarize the page in plain language and reinforce the benefit to the reader.",
          "The key is front-loading value. Put your most useful phrase and clear intent near the beginning so readers can understand your page quickly in search results.",
        ],
        bullets: [
          "Title tags: prioritize clarity and relevance first",
          "Meta descriptions: summarize benefit in natural language",
          "Avoid repeating keywords unnaturally",
        ],
      },
      {
        heading: "Build Readable On-Page Structure",
        paragraphs: [
          "Good SEO pages are easy to scan. Start with one clear H1, then organize sections with H2s and occasional H3s for supporting detail. This helps both users and search engines understand your page hierarchy.",
        ],
        subsections: [
          {
            heading: "H2 for Core Questions",
            content:
              "Each H2 should answer a meaningful sub-question tied to search intent, such as limits, strategy, and common mistakes.",
          },
          {
            heading: "H3 for Tactical Depth",
            content:
              "Use H3 headings for practical walkthroughs, checklists, or examples that support the parent section without creating visual clutter.",
          },
        ],
      },
      {
        heading: "Editorial Workflow That Improves Quality",
        paragraphs: [
          "Draft first, optimize second. Start with useful content, then run a focused edit for readability, intent alignment, and character constraints.",
        ],
        bullets: [
          "Check title and description for truncation risk",
          "Trim filler words and repeated claims",
          "Add one practical example per major section",
          "Use internal links only where they add real value",
        ],
      },
    ],
    faq: [
      {
        question: "Is there one perfect SEO character count?",
        answer:
          "No. Use sensible ranges, then optimize for clarity and relevance. The best length is the one that communicates value quickly and accurately.",
      },
      {
        question: "Should I always use the full meta description length?",
        answer:
          "Not necessarily. A shorter, clearer description often performs better than a longer sentence filled with generic phrases.",
      },
      {
        question: "How often should I update SEO copy?",
        answer:
          "Review important pages regularly, especially when search intent changes or your product messaging evolves.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const canonicalUrl = buildCanonicalUrl(`/blog/${slug}`);

  return {
    metadataBase: new URL(BASE_URL),
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonicalUrl,
      images: [`${BASE_URL}/og-image.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = BLOG_POSTS[slug];

  if (!article) {
    notFound();
  }

  return <SeoBlogTemplate article={article} />;
}
