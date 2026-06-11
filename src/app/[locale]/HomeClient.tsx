"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Corregido: Importación correcta de Next.js
import { Header } from "@/components/Header";
import { CartSidebar } from "@/components/CartSidebar";
import { QuoteForm } from "@/components/QuoteForm";
import { useCart, type ServiceItem } from "@/context/CartContext";
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
  lang: string; // Corregido: Agregado lang a las propiedades
}

function AboutSection({ dict, lang }: AboutSectionProps) {
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

          <div className="mt-10">
            <Link href={`/${lang}/about-us`}>
              <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                {dict.btn}
              </Button>
            </Link>
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
          <p className="text-2xl font-bold tracking-tight text-charcoal-900">${service.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
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
  lang: string;
}

function Footer({ dict, navDict, lang }: FooterProps) {
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
                <span>Arquímides No.130, Piso 5, Oficina B, Colonia Polanco V Sección, C.P. 11560, Miguel Hidalgo, CDMX</span>
              </li>
              <li className="flex items-center gap-3 text-cream-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terracotta-400 flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>proyectos@brandlift.com.mx</span>
              </li>
              <li className="flex items-center gap-3 text-cream-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-terracotta-400 flex-shrink-0"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h4a2 2 0 0 1 2 1.72c.13 1.21.37 2.39.72 3.53a2 2 0 0 1-.45 1.95l-3.11 3.11a16 16 0 0 0 6.53 6.53l3.11-3.11a2 2 0 0 1 1.95-.45c1.14.35 2.32.59 3.53.72A2 2 0 0 1 22,16.92z" /></svg>
                <span>+52 1 55 4169 5792</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-charcoal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-500 text-sm">{dict.rights}</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-cream-500 text-sm">
            <Link href={`/${lang}/terms`} className="hover:text-terracotta-400 transition-colors">{dict.terms}</Link>
            <Link href={`/${lang}/privacy`} className="hover:text-terracotta-400 transition-colors">{dict.privacy}</Link>
            <Link href={`/${lang}/refunds`} className="hover:text-terracotta-400 transition-colors">{dict.refunds}</Link>
          </div>
                    {/* Payment Icons Alineados a la derecha */}
          <div className="flex gap-3">
            <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center shadow-sm">
              <svg className="h-4" viewBox="0 0 780 500" fill="none"><rect width="780" height="500" rx="40" fill="white"/><path fill="#1434CB" d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"/><path fill="#1434CB" d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"/><path fill="#F7B600" d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"/></svg>
            </div>
            <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center shadow-sm">
              <svg className="h-4" viewBox="0 0 152 100" fill="none"><rect width="152" height="100" rx="8" fill="white"/><circle cx="55" cy="50" r="30" fill="#EB001B"/><circle cx="97" cy="50" r="30" fill="#F79E1B"/><path d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z" fill="#FF5F00"/></svg>
            </div>
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
        
        {/* Corregido: Se pasa la propiedad lang */}
        <AboutSection dict={dict.about} lang={lang} />
        
        <ServicesSection 
          onRequestQuote={handleRequestQuote} 
          dict={dict.servicesSection} 
          servicesList={dict.servicesList} 
        />
        
        <WhyChooseUsSection onRequestQuote={handleRequestQuote} dict={dict.whyChooseUs} />
        
        <CTASection onRequestQuote={handleRequestQuote} dict={dict.cta} />
      </main>
      
      <Footer dict={dict.footer} lang={lang} navDict={dict.navigation} />
    </>
  );
}