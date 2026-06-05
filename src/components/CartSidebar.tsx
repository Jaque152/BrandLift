"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { QuoteForm } from "@/components/QuoteForm";
import type { Dictionary } from "@/lib/getDictionary";

interface CartSidebarProps {
  dict: Dictionary['cart'];
  quoteDict: Dictionary['quoteForm'];
  lang: 'en' | 'es';
}

export function CartSidebar({ dict, quoteDict, lang }: CartSidebarProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const pathname = usePathname();

  const handleRequestQuote = () => {
    closeCart();
    setIsQuoteFormOpen(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-lg bg-cream-50 border-l border-cream-300">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-2xl font-serif text-charcoal-900 flex items-center gap-3">
              {dict.title}
              {items.length > 0 && <Badge className="bg-terracotta-500 text-cream-50">{items.length} {items.length === 1 ? dict.item : dict.items}</Badge>}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal-400">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-charcoal-700 mb-2">{dict.emptyTitle}</h3>
              <p className="text-charcoal-500 text-sm max-w-xs">{dict.emptyDesc}</p>
              <Button onClick={closeCart} className="mt-6 bg-terracotta-500 hover:bg-terracotta-600 text-cream-50">{dict.btnBrowse}</Button>
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-120px)]">
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-cream-100 rounded-xl p-4 border border-cream-300 group hover:border-terracotta-300 transition-colors">
                      <div className="flex justify-between items-start mb-3 gap-3">
                        {/* Aquí agregamos la imagen en miniatura */}
                        {item.image && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-cream-200">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-serif text-base text-charcoal-900 leading-tight">{item.name}</h4>
                          <Badge variant="secondary" className="mt-2 bg-sage-100 text-sage-700 text-xs">{item.category}</Badge>
                        </div>
                        <button type="button" onClick={() => removeItem(item.id)} className="text-charcoal-400 hover:text-terracotta-500 transition-colors p-1">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-cream-50 rounded-lg px-2 py-1 border border-cream-300">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-terracotta-500 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="w-8 text-center font-medium text-charcoal-900">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-terracotta-500 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                        <span className="font-serif text-xl text-charcoal-900">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="pt-6 space-y-4 border-t border-cream-300 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-charcoal-900">{dict.total}</span>
                  <span className="font-serif text-2xl text-terracotta-500">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="grid gap-3 pt-2">
                  <Link href={`/${lang}/checkout`} onClick={closeCart}>
                    <Button className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-6 text-base font-medium">{dict.btnCheckout}</Button>
                  </Link>
                  <Button onClick={handleRequestQuote} variant="outline" className="w-full border-charcoal-300 text-charcoal-600 hover:bg-cream-200">{dict.btnQuote}</Button>
                  <Button variant="ghost" onClick={clearCart} className="w-full text-charcoal-500 hover:text-terracotta-500">{dict.btnClear}</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <QuoteForm isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} dict={quoteDict} lang={lang} />
    </>
  );
}