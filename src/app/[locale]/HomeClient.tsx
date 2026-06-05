"use client";
import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { CartSidebar } from "@/components/CartSidebar";
import { QuoteForm } from "@/components/QuoteForm";
// 1. ELIMINADO: import { whyChooseUs } ...
import { useCart, type ServiceItem } from "@/context/CartContext"; // 2. Añadido type ServiceItem
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/getDictionary";

// --- HERO SECTION ---
interface HeroSectionProps {
  onRequestQuote: () => void;
  dict: Dictionary['hero'];
}

function HeroSection({ onRequestQuote, dict }: HeroSectionProps) {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-terracotta-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage-200/40 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <div className="space-y-8 animate-slide-up">
          <Badge className="bg-sage-100 text-sage-700 hover:bg-sage-200 px-4 py-2 text-sm font-medium">
            {dict.badge}
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-charcoal-900 leading-[1.1] tracking-tight">
            {dict.title1}<br /><span className="text-terracotta-500">{dict.title2}</span>
          </h1>
          <p className="text-lg text-charcoal-600 max-w-lg leading-relaxed">
            {dict.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button onClick={onRequestQuote} className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-8 py-6 text-base font-medium rounded-full">
              {dict.btnQuote}
            </Button>
            <Button variant="outline" className="border-charcoal-400 text-charcoal-700 hover:bg-cream-200 px-8 py-6 text-base rounded-full group" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              {dict.btnServices}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2 group-hover:translate-x-1 transition-transform"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
            </Button>
          </div>
        </div>

        <div className="relative animate-slide-up">
          <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"
              alt="Creative team collaboration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-cream-50 rounded-2xl p-4 shadow-xl border border-cream-200 animate-float">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 bg-cream-50 rounded-2xl p-4 shadow-xl border border-cream-200 animate-float" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terracotta-600"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- ABOUT SECTION ---
interface AboutSectionProps {
  dict: Dictionary['about'];
}

function AboutSection({ dict }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-charcoal-900 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
              alt="Our creative team"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 border-2 border-terracotta-500/30 rounded-3xl" />
        </div>

        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-cream-100 leading-tight">
            {dict.title1}<span className="text-terracotta-400">{dict.titleHighlight}</span>{dict.title2}
          </h2>
          <p className="text-cream-300 text-lg leading-relaxed">
            {dict.description}
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div><h3 className="text-4xl font-serif font-semibold text-terracotta-400">150+</h3><p className="text-cream-400 mt-1">{dict.stats.projects}</p></div>
            <div><h3 className="text-4xl font-serif font-semibold text-terracotta-400">98%</h3><p className="text-cream-400 mt-1">{dict.stats.satisfaction}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- SERVICES SECTION ---
interface ServiceCardProps {
  service: Dictionary['servicesList'][0];
  texts: Dictionary['servicesSection'];
}

function ServiceCard({ service, texts }: ServiceCardProps) {
  const { addItem } = useCart();
  
  // 3. FIX: Le decimos a TS que trate las características como un arreglo de strings
  const features = service.features as string[];

  return (
    <div className="group bg-cream-50 rounded-3xl p-6 border border-cream-200 hover:border-terracotta-300 hover:shadow-xl hover:shadow-terracotta-100/50 transition-all duration-500 flex flex-col h-full">
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6">
        <Image 
          src={service.image} 
          alt={service.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <Badge className="bg-sage-100 text-sage-700 mb-4 w-fit">{service.category}</Badge>
      <h3 className="text-xl font-serif font-semibold text-charcoal-900 mb-3 group-hover:text-terracotta-600 transition-colors line-clamp-2">
        {service.name}
      </h3>
      <p className="text-charcoal-600 mb-6 leading-relaxed flex-grow text-sm">
        {service.description}
      </p>

      {/* Usamos nuestra variable tipada `features` */}
      {features && features.length > 0 && (
        <ul className="space-y-2 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-charcoal-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-500"><polyline points="20 6 9 17 4 12" /></svg>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-cream-200 mt-auto">
        <div>
          <p className="text-xs text-charcoal-500">{texts.startingFrom}</p>
          <p className="text-xl font-serif font-semibold text-charcoal-900">${service.price.toLocaleString()}</p>
        </div>
        {/* 4. FIX: Asertamos el tipo a ServiceItem de forma segura para TS */}
        <Button onClick={() => addItem(service as unknown as ServiceItem)} className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 rounded-full px-5 text-sm">
          {texts.addToCart}
        </Button>
      </div>
    </div>
  );
}

interface ServicesSectionProps {
  onRequestQuote: () => void;
  dict: Dictionary['servicesSection'];
  servicesList: Dictionary['servicesList'];
}

function ServicesSection({ onRequestQuote, dict, servicesList }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sage-100/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="bg-terracotta-100 text-terracotta-700 mb-6">{dict.badge}</Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal-900 mb-6">{dict.title}</h2>
          <p className="text-charcoal-600 text-lg">{dict.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicesList.map((service) => (
            <ServiceCard key={service.id} service={service} texts={dict} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button onClick={onRequestQuote} variant="outline" className="border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 px-8 py-6 text-base rounded-full">
            {dict.btnQuote}
          </Button>
        </div>
      </div>
    </section>
  );
}

// --- WHY CHOOSE US SECTION ---
interface WhyChooseUsSectionProps {
  onRequestQuote: () => void;
  dict: Dictionary['whyChooseUs'];
}

function WhyChooseUsSection({ onRequestQuote, dict }: WhyChooseUsSectionProps) {
  const iconMap: Record<string, JSX.Element> = {
    unique: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    tech: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    efficiency: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    flexibility: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
  };

  return (
    <section className="py-24 bg-cream-200/50 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal-900 leading-tight mb-6">{dict.title}</h2>
            <p className="text-charcoal-600 text-lg leading-relaxed mb-8">{dict.description}</p>
            <Button onClick={onRequestQuote} variant="outline" className="border-charcoal-400 text-charcoal-700 hover:bg-cream-300 px-8 py-6 text-base rounded-full">
              {dict.btn}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
            </Button>
          </div>
          <div className="grid gap-6">
            {dict.items.map((item) => (
              <div key={item.title} className="bg-cream-50 rounded-2xl p-6 border border-cream-300 hover:border-terracotta-300 hover:shadow-lg transition-all duration-300 flex gap-5">
                <div className="w-14 h-14 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-600 flex-shrink-0">{iconMap[item.icon]}</div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-charcoal-900 mb-2">{item.title}</h3>
                  <p className="text-charcoal-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- CTA SECTION ---
interface CTASectionProps {
  onRequestQuote: () => void;
  dict: Dictionary['cta'];
}

function CTASection({ onRequestQuote, dict }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-terracotta-500 to-terracotta-600 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-terracotta-400/50 rounded-full blur-3xl" />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-cream-50 leading-tight mb-6">{dict.title}</h2>
        <p className="text-cream-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">{dict.description}</p>
        <Button onClick={onRequestQuote} className="bg-cream-50 text-terracotta-600 hover:bg-cream-100 px-10 py-7 text-lg font-medium rounded-full shadow-xl shadow-terracotta-700/30">
          {dict.btn}
        </Button>
      </div>
    </section>
  );
}

// --- FOOTER SECTION ---
interface FooterProps {
  dict: Dictionary['footer'];
  navDict: Dictionary['navigation'];
}

function Footer({ dict, navDict }: FooterProps) {
  return (
    <footer id="contact" className="bg-charcoal-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-terracotta-500 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream-100"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <span className="text-xl font-serif font-semibold text-cream-100">Brand Lift<span className="text-terracotta-400">.</span></span>
            </a>
            <p className="text-cream-400 max-w-md leading-relaxed mb-6">{dict.desc}</p>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-100 mb-6">{dict.quickLinks}</h4>
            <ul className="space-y-3">
              {[
                { key: "home", label: navDict.home },
                { key: "about", label: navDict.about },
                { key: "services", label: navDict.services },
                { key: "contact", label: navDict.contact }
              ].map((link) => (
                <li key={link.key}>
                  <a href={`#${link.key}`} className="text-cream-400 hover:text-terracotta-400 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-100 mb-6">{dict.contact}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-cream-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 text-terracotta-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>Mexico City, CDMX</span>
              </li>
              <li className="flex items-center gap-3 text-cream-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terracotta-400 flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>proyectos@brandlift.com.mx</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-charcoal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-500 text-sm">{dict.rights}</p>
          <div className="flex gap-6 text-cream-500 text-sm">
            <a href="#" className="hover:text-terracotta-400 transition-colors">{dict.terms}</a>
            <a href="#" className="hover:text-terracotta-400 transition-colors">{dict.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- MAIN COMPONENT ---
interface HomeClientProps {
  dict: Dictionary;
  lang: 'en' | 'es';
}

export default function HomeClient({ dict, lang }: HomeClientProps) {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const handleRequestQuote = () => setIsQuoteFormOpen(true);

  return (
    <>
      <Header dict={dict.navigation} lang={lang} />
      
      <CartSidebar dict={dict.cart} quoteDict={dict.quoteForm} lang={lang} />
      <QuoteForm isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} dict={dict.quoteForm} lang={lang} />
      
      <main className="relative">
        <HeroSection dict={dict.hero} onRequestQuote={handleRequestQuote} />
        
        <AboutSection dict={dict.about} />
        
        <ServicesSection 
          onRequestQuote={handleRequestQuote} 
          dict={dict.servicesSection} 
          servicesList={dict.servicesList} 
        />
        
        <WhyChooseUsSection onRequestQuote={handleRequestQuote} dict={dict.whyChooseUs} />
        
        <CTASection onRequestQuote={handleRequestQuote} dict={dict.cta} />
      </main>
      
      <Footer dict={dict.footer} navDict={dict.navigation} />
    </>
  );
}