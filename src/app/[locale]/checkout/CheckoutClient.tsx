"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/getDictionary";

interface CheckoutClientProps {
  dict: Dictionary['checkout'];
  lang: string;
}

export default function CheckoutClient({ dict, lang }: CheckoutClientProps) {
  const { items, subtotal, ivaAmount, totalWithIva, clearCart, removeItem } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Estado actualizado con los campos solicitados
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", country: "", address: "", city: "", state: "", zip: "", 
    phone: "", email: "", notes: "", cardName: "", cardNumber: "", expiry: "", cvv: ""
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const [expMonth, expYear] = formData.expiry.split("/");
      if (!expMonth || !expYear) throw new Error(dict.errorDate);

      const paymentRes = await fetch("/api/process-payment", { // Ajusta la ruta si la tuya es distinta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          },
          card: {
            name: formData.cardName,
            number: formData.cardNumber,
            expMonth: expMonth.trim(),
            expYear: expYear.trim(),
            cvv: formData.cvv
          },
          items: [
            ...items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
            { id: "TAX-IVA", name: dict.iva, price: ivaAmount, quantity: 1 }
          ],
          totalPrice: totalWithIva,
          notes: formData.notes
        })
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.success) {
        throw new Error(paymentData.error || "El pago fue declinado.");
      }

      if (paymentData.redirectTo) {
        window.location.href = paymentData.redirectTo;
        return; 
      }

      if (paymentData.status === "APPROVED") {
        // Enviar correo de éxito
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "payment_success",
            lang: lang,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`,
            orderId: paymentData.orderId,
            items: items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
            subtotal: subtotal,
            iva: ivaAmount,
            total: totalWithIva
          }),
        });

        setIsProcessing(false);
        setIsComplete(true);
        clearCart();
      }

    } catch (err: unknown) {
      setIsProcessing(false);
      setErrorMsg((err as Error).message);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-600"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-charcoal-900 mb-4">{dict.successTitle}</h1>
          <p className="text-charcoal-600 mb-8">{dict.successDesc} {formData.email}.</p>
          <Link href={`/${lang}`}>
            <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-8">{dict.btnHome}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Link href={`/${lang}/cart`} className="inline-flex items-center gap-2 text-charcoal-600 hover:text-terracotta-500 mb-8 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          {dict.backToCart}
        </Link>

        <h1 className="text-4xl font-serif font-semibold text-charcoal-900 mb-8">{dict.title}</h1>

        <div className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">{errorMsg}</div>
            )}
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* DETALLES DE FACTURACIÓN */}
              <div className="bg-cream-50 rounded-2xl p-8 border border-cream-300">
                <h2 className="text-xl font-serif font-semibold text-charcoal-900 mb-6">{dict.billingDetails}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{dict.firstName}</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{dict.lastName}</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{dict.email}</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{dict.phone}</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="country">{dict.country}</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">{dict.address}</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{dict.city}</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{dict.state}</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="zip">{dict.zip}</Label>
                    <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2 md:col-span-2 mt-2">
                    <Label htmlFor="notes">{dict.notes}</Label>
                    <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="bg-cream-50 border-cream-300 resize-none" />
                  </div>
                </div>
              </div>

              {/* DATOS DE LA TARJETA */}
              <div className="bg-cream-50 rounded-2xl p-8 border border-cream-300">
                <h2 className="text-xl font-serif font-semibold text-charcoal-900 mb-6">{dict.paymentDetails}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardName">{dict.nameOnCard}</Label>
                    <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cardNumber">{dict.cardNumber}</Label>
                    <Input id="cardNumber" name="cardNumber" maxLength={19} value={formData.cardNumber} onChange={handleInputChange} required placeholder="0000 0000 0000 0000" className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">{dict.expiry}</Label>
                    <Input id="expiry" name="expiry" value={formData.expiry} onChange={handleInputChange} required placeholder="MM/AA" className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">{dict.cvv}</Label>
                    <Input id="cvv" name="cvv" type="password" inputMode="numeric" value={formData.cvv} onChange={handleInputChange} required placeholder="***" maxLength={4} className="bg-cream-50 border-cream-300 tracking-widest text-lg" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-4 mt-6">
                  <Image src="/etomin_secbadge.svg" alt="Pago Seguro" width={100} height={35} className="h-8 w-auto opacity-80" />
                  <Image src="/etomin_logo.svg" alt="Etomin" width={80} height={25} className="h-6 w-auto opacity-80 grayscale" />
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-cream-50 rounded-2xl p-8 border border-cream-300 sticky top-24">
              <h2 className="text-xl font-serif font-semibold text-charcoal-900 mb-6">{dict.orderSummary}</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-cream-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal-900 leading-tight">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-charcoal-500">{dict.qty}: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* PRECIOS SIN SERIF (font-bold) */}
                      <span className="text-lg font-bold tracking-tight text-charcoal-900">${formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-cream-300" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-charcoal-600">
                  <span>{dict.subtotal}</span>
                  <span className="font-medium text-charcoal-900">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>{dict.iva}</span>
                  <span className="font-medium text-charcoal-900">${formatPrice(ivaAmount)}</span>
                </div>
                <Separator className="bg-cream-300 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-charcoal-900">{dict.total}</span>
                  <span className="text-3xl font-bold tracking-tight text-terracotta-500">${formatPrice(totalWithIva)} MXN</span>
                </div>
              </div>

              <Button form="checkout-form" type="submit" disabled={isProcessing || items.length === 0} className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-7 text-lg font-medium rounded-xl">
                {isProcessing ? dict.processing : `${dict.payButton} $${formatPrice(totalWithIva)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}