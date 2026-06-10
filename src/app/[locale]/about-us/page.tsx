import { getDictionary } from "@/lib/getDictionary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AboutUsPageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)).aboutUs;

  return (
    <div className="min-h-screen bg-cream-100 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
        
        <div>
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-charcoal-600 hover:text-terracotta-500 transition-colors font-medium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {locale === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
        </div>
        {/* SECCIÓN 1: NUESTRA MISIÓN */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-terracotta-500 font-semibold tracking-wider uppercase text-sm">{dict.title}</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 leading-tight">
              {dict.missionTitle}
            </h1>
          </div>
          <div className="space-y-6 text-charcoal-600 text-lg leading-relaxed">
            <p>{dict.missionP1}</p>
            <p>{dict.missionP2}</p>
          </div>
        </section>

        {/* SECCIÓN 2: LA RUTA DE DESARROLLO (Línea de tiempo) */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal-900 mb-4">{dict.routeTitle}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dict.route.map((step, index) => (
              <div key={index} className="bg-cream-50 p-8 rounded-2xl border border-cream-300 relative overflow-hidden group hover:border-terracotta-400 transition-colors">
                <div className="absolute -right-4 -top-8 text-9xl font-serif font-bold text-cream-200 opacity-50 select-none transition-transform group-hover:scale-110">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <span className="text-terracotta-500 font-bold text-xl mb-4 block">{step.step}.</span>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">{step.title}</h3>
                  <p className="text-charcoal-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 3: SERVICIOS Y SOLUCIONES */}
        <section className="bg-charcoal-900 text-cream-50 rounded-3xl p-8 md:p-16 lg:p-20 shadow-2xl">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-cream-50">{dict.servicesTitle}</h2>
            <p className="text-charcoal-300 text-lg leading-relaxed mb-8">{dict.servicesDesc}</p>
            <h3 className="text-2xl font-serif font-semibold text-terracotta-400">{dict.solutionsTitle}</h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {dict.solutions.map((sol, index) => (
              <div key={index} className="bg-charcoal-800 p-8 rounded-2xl border border-charcoal-700 hover:border-terracotta-500 transition-colors flex flex-col">
                <div className="w-12 h-12 bg-charcoal-900 rounded-xl flex items-center justify-center mb-6 text-terracotta-400 border border-charcoal-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <h4 className="text-xl font-bold text-cream-50 mb-4">{sol.name}</h4>
                <p className="text-charcoal-400 leading-relaxed flex-1">{sol.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href={`/${locale}#services`}>
              <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-10 py-6 text-lg font-medium rounded-full">
                {locale === 'es' ? "Explorar Catálogo" : "Explore Catalog"}
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}