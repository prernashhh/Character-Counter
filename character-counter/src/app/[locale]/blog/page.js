import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Settings from '@/models/Settings';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getBlogUi } from '@/lib/blog-ui-text';

export const dynamic = 'force-dynamic';

async function getPublishedPosts() {
  try {
    await connectDB();
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug excerpt content coverImageUrl publishDate createdAt')
      .lean();

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      image: post.coverImageUrl || '',
      createdAt: post.publishDate
        ? new Date(post.publishDate).toISOString()
        : post.createdAt
          ? new Date(post.createdAt).toISOString()
          : null,
    }));
  } catch {
    return [];
  }
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function getBlogClosingText() {
  try {
    await connectDB();
    const settings = await Settings.findOne().select('pageClosingTexts').lean();
    return settings?.pageClosingTexts?.blog || 'Thanks for reading. Check back soon for more helpful updates.';
  } catch {
    return 'Thanks for reading. Check back soon for more helpful updates.';
  }
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const posts = await getPublishedPosts();
  const blogClosingText = await getBlogClosingText();
  const t = await getTranslations({ locale });
  const blogUi = getBlogUi(locale);
  const blogLastUpdated = posts[0]?.createdAt
    ? new Date(posts[0].createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100">
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToHome')}
          </a>

          <h1 className="text-4xl font-extrabold text-center mb-8 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {blogUi.blogTitle}
          </h1>

          {blogLastUpdated && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800">
                {t('lastUpdated')}: {blogLastUpdated}
              </p>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600">{blogUi.noPosts}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="block group"
                  aria-label={post.title}
                >
                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-70 md:shrink-0">
                        <img
                          src={post.image || '/og-image.svg'}
                          alt={post.title}
                          className="w-full h-50 md:h-44 lg:h-48 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                            <span className="group-hover:text-indigo-700 transition-colors">{post.title}</span>
                          </h2>
                          <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                            {post.excerpt || stripHtml(post.content).slice(0, 220) || 'Read this post to explore more details.'}
                            {stripHtml(post.content).length > 220 ? '...' : ''}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
                          <span>
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString(locale, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : ''}
                          </span>
                          <span className="font-medium text-indigo-600 group-hover:text-indigo-800">
                            {blogUi.readMore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mt-8">
            <p className="text-center text-gray-700 font-semibold">
              {blogClosingText}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
