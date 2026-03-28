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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState('');
  const [editingPostId, setEditingPostId] = useState('');
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
    coverImageUrl: '',
    coverImagePublicId: '',
    published: true,
  });

  const formatDateForInput = (value) => {
    if (!value) return getTodayDate();
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return getTodayDate();
    return date.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      publishDate: getTodayDate(),
      excerpt: '',
      content: '',
      coverImageUrl: '',
      coverImagePublicId: '',
      published: true,
    });
    setSlugTouched(false);
    setEditingPostId('');
  };

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

  const handleSavePost = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const isEditing = Boolean(editingPostId);
      const endpoint = isEditing ? `/api/admin/posts/${editingPostId}` : '/api/admin/posts';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(data.error || 'Failed to save post');
        setSaving(false);
        return;
      }

      resetForm();
      setMessage(isEditing ? 'Post updated successfully' : 'Post created successfully');
      await fetchPosts();
    } catch {
      setMessage('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setSlugTouched(true);
    setMessage('');
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      publishDate: formatDateForInput(post.publishDate || post.createdAt),
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImageUrl: post.coverImageUrl || '',
      coverImagePublicId: post.coverImagePublicId || '',
      published: Boolean(post.published),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadCoverImage = async (file) => {
    setUploadingCover(true);
    setMessage('');

    try {
      const result = await uploadImage(file, 'blog-cover');
      if (!result.success) {
        setMessage(result.error || 'Cover image upload failed');
        return;
      }

      setForm((prev) => ({
        ...prev,
        coverImageUrl: result.url || '',
        coverImagePublicId: result.public_id || '',
      }));
    } catch {
      setMessage('Cover image upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const clearCoverImage = () => {
    setForm((prev) => ({
      ...prev,
      coverImageUrl: '',
      coverImagePublicId: '',
    }));
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingPostId ? 'Edit Post' : 'Create New Post'}</h3>
        <form className="grid grid-cols-1 lg:grid-cols-10 gap-6" onSubmit={handleSavePost}>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadCoverImage(file);
                      e.target.value = '';
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-2 file:text-indigo-700 hover:file:bg-indigo-200"
                  />
                  {form.coverImageUrl && (
                    <button
                      type="button"
                      onClick={clearCoverImage}
                      className="px-3 py-2 text-sm rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                {uploadingCover && <p className="text-xs text-slate-500">Uploading cover image...</p>}
                {form.coverImageUrl && (
                  <img
                    src={form.coverImageUrl}
                    alt="Cover preview"
                    className="w-full max-w-sm h-44 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>

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
                {saving ? 'Saving...' : editingPostId ? 'Update Post' : 'Create Post'}
              </button>

              {editingPostId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
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
                    {post.coverImageUrl && (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="mt-2 w-28 h-16 object-cover rounded-md border border-slate-200"
                      />
                    )}
                    {post.excerpt && <p className="text-sm text-gray-700 mt-2">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(post)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                    >
                      Edit
                    </button>
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
