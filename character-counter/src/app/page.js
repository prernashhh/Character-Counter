"use client";

import { useEffect, useMemo, useState } from "react";

const countWords = (text) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

const countSpaces = (text) => {
  return (text.match(/ /g) || []).length;
};

const countSentences = (text) => {
  if (!text.trim()) return 0;
  const parts = text.split(/[.!?]+/).map((s) => s.trim());
  return parts.filter((s) => s.length > 0).length;
};

const countParagraphs = (text) => {
  if (!text.trim()) return 0;
  return text
    .split(/\n+/)
    .filter((para) => para.trim().length > 0).length;
};

const getWordDensity = (text) => {
  if (!text.trim()) return [];

  const normalized = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = normalized.split(/\s+/).filter((word) => word.length > 0);

  const frequency = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency).sort((a, b) => b[0].length - a[0].length);
};

export default function Home() {
  const [text, setText] = useState("");

  useEffect(() => {
    const savedText = localStorage.getItem("textAnalyzerContent");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    localStorage.setItem("textAnalyzerContent", newText);
  };

  const {
    characterCount,
    wordCount,
    spaceCount,
    sentenceCount,
    paragraphCount,
    topWords,
  } = useMemo(() => {
    const characterCount = text.length;
    const wordCount = countWords(text);
    const spaceCount = countSpaces(text);
    const sentenceCount = countSentences(text);
    const paragraphCount = countParagraphs(text);
    const topWords = getWordDensity(text);

    return {
      characterCount,
      wordCount,
      spaceCount,
      sentenceCount,
      paragraphCount,
      topWords,
    };
  }, [text]);

  return (
    <main className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Statistics Section */}
      <aside className="w-full lg:w-72 bg-white/80 backdrop-blur-sm shadow-2xl overflow-y-auto border-b lg:border-b-0 lg:border-r border-indigo-100">
        <div className="pt-4 px-4 sm:px-6 lg:px-8 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 lg:mb-8">
            Statistics
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:space-y-2">
            <div className="group hover:scale-105 transition-transform duration-200 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-3 lg:p-4 border border-blue-100">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {characterCount}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1 lg:mt-2 uppercase tracking-wider">
                Characters
              </p>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-3 lg:p-4 border border-purple-100">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {wordCount}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1 lg:mt-2 uppercase tracking-wider">
                Words
              </p>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl p-3 lg:p-4 border border-emerald-100">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {spaceCount}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1 lg:mt-2 uppercase tracking-wider">
                Spaces
              </p>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-3 lg:p-4 border border-amber-100">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {sentenceCount}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1 lg:mt-2 uppercase tracking-wider">
                Sentences
              </p>
            </div>

            <div className="group hover:scale-105 transition-transform duration-200 bg-linear-to-br from-rose-50 to-red-50 rounded-xl p-3 lg:p-4 border border-rose-100">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                {paragraphCount}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1 lg:mt-2 uppercase tracking-wider">
                Paragraphs
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Text Analyzer Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-4 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-4 lg:mb-6 pb-2 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
            Text Analyzer
          </h1>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-indigo-100">
            <label
              htmlFor="text-input"
              className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 lg:mb-3 uppercase tracking-wide"
            >
              Enter your text below
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing..."
              className="w-full h-64 sm:h-80 lg:h-96 p-4 lg:p-5 border-2 border-indigo-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 text-black text-base lg:text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm overflow-y-auto"
              aria-label="Text input for analysis"
            />
          </div>
        </div>
      </section>

      {/* Word Density Section */}
      <aside className="w-full lg:w-72 bg-white/80 backdrop-blur-sm shadow-2xl overflow-y-auto border-t lg:border-t-0 lg:border-l border-purple-100">
        <div className="pt-4 px-4 sm:px-6 lg:px-8 pb-4 lg:pb-8">
          <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 lg:mb-8">
            Word Density
          </h2>

          {topWords.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {topWords.slice(0, 10).map(([word, count], index) => (
                <div
                  key={word}
                  className="group hover:scale-105 transition-all duration-200 bg-linear-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl p-3 lg:p-4 border border-indigo-200 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold truncate max-w-25 sm:max-w-30 lg:max-w-35">
                      {word}
                    </span>
                    <span className="text-xl lg:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center mt-8 italic">
              Start typing to see word density
            </p>
          )}
        </div>
      </aside>
    </main>
  );
}
