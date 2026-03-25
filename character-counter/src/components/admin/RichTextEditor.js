'use client';

import { useEffect, useRef } from 'react';

export default function RichTextEditor({ value = '', onChange, minHeightClass = 'min-h-56', placeholder = '' }) {
  const editorContainerRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const syncingFromStateRef = useRef(false);

  useEffect(() => {
    let isDisposed = false;

    const initEditor = async () => {
      if (!editorContainerRef.current || quillInstanceRef.current) return;

      const { default: Quill } = await import('quill');

      if (isDisposed || !editorContainerRef.current) return;

      const quill = new Quill(editorContainerRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      });

      quill.root.innerHTML = value || '';

      quill.on('text-change', () => {
        if (syncingFromStateRef.current) return;
        onChange?.(quill.root.innerHTML);
      });

      quillInstanceRef.current = quill;
    };

    initEditor();

    return () => {
      isDisposed = true;
      quillInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (!quill) return;

    if (quill.root.innerHTML !== (value || '')) {
      syncingFromStateRef.current = true;
      quill.root.innerHTML = value || '';
      syncingFromStateRef.current = false;
    }
  }, [value]);

  return (
    <div className="rounded-lg border border-gray-300 bg-white">
      <div ref={editorContainerRef} className={minHeightClass} />
    </div>
  );
}
