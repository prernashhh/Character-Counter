import Link from "next/link";

export default function SeoBlogTemplate({ article }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{article.title}</h1>
        <p className="text-lg text-slate-700 leading-8">{article.intro}</p>
      </header>

      {article.sections.map((section) => (
        <section key={section.heading} className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{section.heading}</h2>
          {section.paragraphs?.map((paragraph, index) => (
            <p key={`${section.heading}-${index}`} className="text-slate-700 leading-8 mb-4">
              {paragraph}
            </p>
          ))}

          {section.bullets?.length ? (
            <ul className="list-disc list-inside text-slate-700 space-y-2 pl-4">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}

          {section.subsections?.length ? (
            <div className="space-y-5 mt-5">
              {section.subsections.map((subsection) => (
                <div key={subsection.heading}>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{subsection.heading}</h3>
                  <p className="text-slate-700 leading-8">{subsection.content}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}

      {article.faq?.length ? (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
          <div className="space-y-4">
            {article.faq.map((item) => (
              <div key={item.question} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.question}</h3>
                <p className="text-slate-700 leading-7">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
        <p className="text-slate-700">
          Use the <Link href="/" className="text-indigo-700 underline">character counter and word count tool</Link> to check your draft before publishing.
        </p>
      </footer>
    </article>
  );
}
