"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CheckoutClient({ lang }: { lang: string }) {
  const { items, totalPrice, clearCart, removeItem } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "", name: "", cardNumber: "", expiry: "", cvc: "", address: "", city: "", zip: "", country: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    try {
      // Separar MM/YY
      const [expMonth, expYear] = formData.expiry.split("/");
      if (!expMonth || !expYear) throw new Error("Formato de fecha inválido. Usa MM/AA");

      // 1. Enviar datos a nuestro backend de pagos (ETOMIN)
      const paymentRes = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: formData.country
          },
          card: {
            number: formData.cardNumber,
            expMonth: expMonth.trim(),
            expYear: expYear.trim(),
            cvc: formData.cvc,
            name: formData.name
          },
          items,
          totalPrice
        })
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.success) {
        throw new Error(paymentData.error || "El pago fue declinado.");
      }

      // 2. Si el pago fue exitoso, enviar correos (Usuario y Admin)
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          services: items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
          totalPrice,
          type: "payment_success",
          orderId: paymentData.orderId
        }),
      });

      setIsProcessing(false);
      setIsComplete(true);
      clearCart();

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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-charcoal-900 mb-4">¡Pago Exitoso!</h1>
          <p className="text-charcoal-600 mb-8">Gracias por tu compra. Hemos enviado un recibo a {formData.email}.</p>
          <Link href={`/${lang}`}>
            <Button className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-8">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-charcoal-600 hover:text-terracotta-500 mb-8 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Volver
        </Link>

        <h1 className="text-4xl font-serif font-semibold text-charcoal-900 mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulario de Pago */}
          <div className="bg-cream-50 rounded-2xl p-8 border border-cream-300">
            <h2 className="text-xl font-serif font-semibold text-charcoal-900 mb-6">Detalles de Pago (Etomin)</h2>
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre en la tarjeta</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input id="cardNumber" name="cardNumber" maxLength={19} value={formData.cardNumber} onChange={handleInputChange} required placeholder="0000 0000 0000 0000" className="bg-cream-50 border-cream-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Vencimiento (MM/AA)</Label>
                    <Input id="expiry" name="expiry" value={formData.expiry} onChange={handleInputChange} required placeholder="MM/AA" className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" name="cvc" value={formData.cvc} onChange={handleInputChange} required placeholder="123" maxLength={4} className="bg-cream-50 border-cream-300" />
                  </div>
                </div>
              </div>

              <Separator className="bg-cream-300" />

              <div className="space-y-4">
                <h3 className="font-medium text-charcoal-900">Dirección de Facturación</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Código Postal</Label>
                    <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Estado/País</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                </div>
              </div>

              <Button type="submit" disabled={isProcessing || items.length === 0} className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 py-6 text-lg font-medium">
                {isProcessing ? "Procesando pago..." : `Pagar $${totalPrice.toLocaleString()}`}
              </Button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div>
            <div className="bg-cream-50 rounded-2xl p-8 border border-cream-300 sticky top-24">
              <h2 className="text-xl font-serif font-semibold text-charcoal-900 mb-6">Resumen del Pedido</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-cream-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal-900">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-sage-100 text-sage-700 text-xs">{item.category}</Badge>
                        <span className="text-sm text-charcoal-500">Cant: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-charcoal-900">${(item.price * item.quantity).toLocaleString()}</span>
                      <button type="button" onClick={() => removeItem(item.id)} className="block text-xs text-charcoal-500 hover:text-terracotta-500 mt-1">Quitar</button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-cream-300" />

              <div className="space-y-3">
                <div className="flex justify-between text-lg font-semibold text-charcoal-900">
                  <span>Total a Pagar</span>
                  <span className="text-terracotta-500">${totalPrice.toLocaleString()} mxn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}