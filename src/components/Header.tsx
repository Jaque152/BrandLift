"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/getDictionary";

interface HeaderProps {
  dict: Dictionary['navigation'];
  lang: 'en' | 'es';
}

export function Header({ dict, lang }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función mejorada para cambiar el idioma
  const toggleLanguage = () => {
    if (!pathname) return;
    
    const newLang = lang === 'en' ? 'es' : 'en';
    const segments = pathname.split('/');
    
    // Asegurarnos de reemplazar el segmento correcto del idioma
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'es')) {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    
    router.push(segments.join('/'));
  };

  // Enlaces arreglados: Siempre te llevan a la página correcta sin importar dónde estés navegando
  const navLinks = [
    { key: "home", label: dict.home, href: `/${lang}` },
    { key: "about", label: dict.about, href: `/${lang}#about` },
    { key: "services", label: dict.services, href: `/${lang}#services` },
    { key: "contact", label: dict.contact, href: `/${lang}#contact` },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-cream-100/90 backdrop-blur-lg shadow-sm py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-terracotta-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream-100">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-serif font-semibold text-charcoal-900">Brand Lift<span className="text-terracotta-500">.</span></span>
        </Link>

        {/* NAVEGACIÓN DE ESCRITORIO (Agregada para PC) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link key={item.key} href={item.href} className="text-charcoal-700 hover:text-terracotta-500 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Botón Toggle de Idioma (Visible solo en PC) */}
          <Button 
            onClick={toggleLanguage} 
            variant="ghost" 
            className="hidden md:flex text-charcoal-700 hover:text-terracotta-500 hover:bg-cream-200 transition-colors font-semibold"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </Button>

          {/* Botón del Carrito */}
          <Button onClick={openCart} variant="outline" className="relative border-charcoal-300 hover:border-terracotta-500 hover:bg-terracotta-50 transition-all duration-300 group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal-700 group-hover:text-terracotta-500 transition-colors">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 px-1.5 min-w-5 h-5 flex items-center justify-center text-xs">{totalItems}</Badge>
            )}
          </Button>

          {/* Botón de Menú Hamburguesa (Móvil) */}
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-charcoal-300 hover:border-terracotta-500 transition-colors">
            <span className={`w-5 h-0.5 bg-charcoal-700 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-charcoal-700 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-charcoal-700 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-cream-100/95 backdrop-blur-lg border-b border-cream-300 overflow-hidden transition-all duration-500 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col items-center gap-4 py-8">
          {navLinks.map((item) => (
            <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-charcoal-700 hover:text-terracotta-500 transition-colors duration-300 text-lg font-medium tracking-wide uppercase">
              {item.label}
            </Link>
          ))}
          
          {/* Botón Toggle de Idioma para versión móvil */}
          <Button 
            onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} 
            variant="ghost" 
            className="text-terracotta-500 hover:bg-cream-200 mt-2 font-semibold"
          >
            Cambiar a {lang === 'en' ? 'Español' : 'English'}
          </Button>
        </nav>
      </div>
    </header>
  );
}