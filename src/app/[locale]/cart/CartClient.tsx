"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Dictionary } from "@/lib/getDictionary";

interface CartClientProps {
  dict: Dictionary['cartPage'];
  lang: 'en' | 'es';
}

export default function CartClient({ dict, lang }: CartClientProps) {
  const { items, subtotal, ivaAmount, totalWithIva, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal-400">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-charcoal-900 mb-4">{dict.emptyTitle}</h1>
          <p className="text-charcoal-600 mb-8">{dict.emptyDesc}</p>
          <Link href={`/${lang}`}>
            <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-8">{dict.btnContinue}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-charcoal-600 hover:text-terracotta-500 mb-8 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          {dict.btnContinue}
        </Link>

        <h1 className="text-4xl font-serif font-semibold text-charcoal-900 mb-8">{dict.title}</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Detalles de los Servicios */}
          <div className="lg:col-span-2">
            <div className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-cream-200 text-sm font-medium text-charcoal-500 uppercase tracking-wide">
                <div className="col-span-6">{dict.service}</div>
                <div className="col-span-2 text-center">{dict.price}</div>
                <div className="col-span-2 text-center">{dict.quantity}</div>
                <div className="col-span-2 text-right">{dict.total}</div>
              </div>
              
              <div className="divide-y divide-cream-200">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      {item.image && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-cream-200">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-charcoal-900">{item.name}</h3>
                        <p className="text-sm text-charcoal-500 mt-1 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 text-center font-medium text-charcoal-700 hidden md:block">
                      ${item.price.toLocaleString()}
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center gap-3 bg-cream-100 rounded-lg px-2 py-1 border border-cream-300">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-terracotta-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <span className="w-8 text-center font-medium text-charcoal-900">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-terracotta-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-right">
                      <span className="text-xl font-bold text-charcoal-900 block">${(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-charcoal-500 hover:text-red-500 mt-2">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <div className="bg-cream-50 rounded-2xl p-8 border border-cream-300 sticky top-24">
              <h2 className="text-2xl font-serif font-semibold text-charcoal-900 mb-6">{dict.summaryTitle}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-charcoal-600">
                  <span>{dict.subtotal}</span>
                  <span className="font-medium text-charcoal-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>{dict.iva}</span>
                  <span className="font-medium text-charcoal-900">${ivaAmount.toLocaleString()}</span>
                </div>
              </div>

              <Separator className="bg-cream-300 mb-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-semibold text-charcoal-900">{dict.totalToPay}</span>
                <span className="text-3xl font-bold tracking-tight text-terracotta-500">${totalWithIva.toLocaleString()} MXN</span>
              </div>

              <Link href={`/${lang}/checkout`}>
                <Button className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-7 text-lg font-medium rounded-xl">
                  {dict.btnCheckout}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}