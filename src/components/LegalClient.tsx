"use client";
import Link from "next/link";

interface LegalClientProps {
  title: string;
  company: string;
  intro: string;
  sections: { title: string; content: string[] }[];
  footer: string;
  lang: string;
}

export default function LegalClient({ title, company, intro, sections, footer, lang }: LegalClientProps) {
  return (
    <div className="min-h-screen bg-cream-100 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-charcoal-600 hover:text-terracotta-500 transition-colors font-medium mb-12">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Link>

        <div className="bg-cream-50 rounded-3xl p-8 md:p-12 border border-cream-300 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal-900 mb-4">{title}</h1>
          <h2 className="text-lg font-medium text-terracotta-600 mb-8">{company}</h2>

          {intro && <p className="text-charcoal-600 text-lg leading-relaxed mb-10">{intro}</p>}

          <div className="space-y-10">
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">{sec.title}</h3>
                <div className="space-y-4">
                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-charcoal-600 leading-relaxed whitespace-pre-line">{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-cream-200 text-charcoal-500 text-sm whitespace-pre-line">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}