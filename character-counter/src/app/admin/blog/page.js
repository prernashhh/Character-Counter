'use client';

import { useEffect, useRef, useState } from 'react';

function makeSlug(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const editorContainerRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const syncingFromStateRef = useRef(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    publishDate: getTodayDate(),
    excerpt: '',
    content: '',
    published: true,
  });

  const uploadImage = async (file, type) => {
    const data = new FormData();
    data.append('file', file);
    data.append('type', type);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: data,
    });

    return response.json();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEditorImageInsert = async (editor) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const result = await uploadImage(file, 'blog-content');

      if (!result.success) {
        setMessage(result.error || 'Image upload failed');
        return;
      }

      const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
      editor.insertEmbed(range.index, 'image', result.url);
      editor.setSelection(range.index + 1, 0);
    };
  };

  useEffect(() => {
    let isDisposed = false;

    const initQuill = async () => {
      if (!editorContainerRef.current || quillInstanceRef.current) return;

      const { default: Quill } = await import('quill');

      if (isDisposed || !editorContainerRef.current) return;

      const quill = new Quill(editorContainerRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: () => handleEditorImageInsert(quill),
            },
          },
        },
      });

      quill.root.innerHTML = form.content || '';

      quill.on('text-change', () => {
        if (syncingFromStateRef.current) return;
        const html = quill.root.innerHTML;
        setForm((prev) => ({ ...prev, content: html }));
      });

      quillInstanceRef.current = quill;
    };

    initQuill();

    return () => {
      isDisposed = true;
      quillInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (!quill) return;

    if (quill.root.innerHTML !== form.content) {
      syncingFromStateRef.current = true;
      quill.root.innerHTML = form.content || '';
      syncingFromStateRef.current = false;
    }
  }, [form.content]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch {
      setMessage('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(data.error || 'Failed to create post');
        setSaving(false);
        return;
      }

      setForm({
        title: '',
        slug: '',
        publishDate: getTodayDate(),
        excerpt: '',
        content: '',
        published: true,
      });
      setSlugTouched(false);
      setMessage('Post created successfully');
      await fetchPosts();
    } catch {
      setMessage('Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (post) => {
    try {
      const response = await fetch(`/api/admin/posts/${post._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchPosts();
      }
    } catch {
      setMessage('Failed to update post status');
    }
  };

  const deletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await fetchPosts();
      }
    } catch {
      setMessage('Failed to delete post');
    }
  };

  const handleTitleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : makeSlug(value),
    }));
  };

  const handleSlugChange = (value) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: makeSlug(value) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
        <p className="mt-2 text-gray-600">Create and manage blog posts for your public blog page</p>
      </div>

      {message && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h3>
        <form className="grid grid-cols-1 lg:grid-cols-10 gap-6" onSubmit={handleCreate}>
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top Section</h4>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Blog Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Post title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, publishDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Next Section</h4>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Write a short description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 resize-none"
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-200 p-4 sm:p-5">
              <label className="block text-sm font-medium text-gray-700">Main Section (Content Editor)</label>
              <p className="text-xs text-slate-500">Toolbar includes headings, bold, italic, underline, ordered list, bullet list, links, and image upload.</p>
              <div className="rounded-lg border border-gray-200 bg-white">
                <div ref={editorContainerRef} className="min-h-80" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-3">
            <div className="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 sticky top-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Publish / Settings</h4>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Publish immediately
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Create Post'}
              </button>
            </div>
          </aside>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Posts</h3>

        {loading ? (
          <p className="text-gray-600">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-500">/{post.slug}</p>
                    {post.excerpt && <p className="text-sm text-gray-700 mt-2">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${post.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
