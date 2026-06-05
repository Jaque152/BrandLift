"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Dictionary } from "@/lib/getDictionary";

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  dict?: Dictionary['quoteForm'];
  lang: 'en' | 'es';
}

export function QuoteForm({ isOpen, onClose, dict, lang }: QuoteFormProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart, addCustomItem } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [existingQuote, setExistingQuote] = useState({ quoteId: "", quoteName: "", quotePrice: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExistingQuoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExistingQuote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/send-quote", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          services: items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
          totalPrice,
          type: "quote_request",
          lang: lang
        }),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsSubmitting(false);
  };

  const handleSubmitExisting = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(existingQuote.quotePrice);
    if (!existingQuote.quoteId || !existingQuote.quoteName || Number.isNaN(price)) return;

    // Agregar de forma segura al carrito
    addCustomItem({
      id: `quote-${existingQuote.quoteId}`,
      name: `${existingQuote.quoteName} (Ref: ${existingQuote.quoteId})`,
      price: price,
      description: dict?.customQuoteDesc || "Servicio Cotizado a Medida",
      category: dict?.customQuoteCategory || "Cotización",
    });

    onClose();
    router.push(`/${lang}/checkout`);
  };

  const handleClose = () => {
    if (isSuccess) {
      clearCart();
      setIsSuccess(false);
      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-cream-50 border-cream-300 max-h-[90vh] overflow-hidden">
        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-charcoal-900 mb-3">{dict?.successTitle || "¡Enviado!"}</h3>
            <p className="text-charcoal-600 mb-8 max-w-md mx-auto">{dict?.successDesc || "Gracias. Te contactaremos pronto."}</p>
            <Button onClick={handleClose} className="bg-terracotta-500 hover:bg-terracotta-600 text-cream-50 px-8">{dict?.btnClose || "Cerrar"}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-charcoal-900">{dict?.title || "Cotización"}</DialogTitle>
              <DialogDescription className="text-charcoal-600">{dict?.desc || "Completa los datos"}</DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-cream-200">
                <TabsTrigger value="existing" className="data-[state=active]:bg-terracotta-500 data-[state=active]:text-cream-50">{dict?.tabExisting || "Tengo una Cotización"}</TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-terracotta-500 data-[state=active]:text-cream-50">{dict?.tabNew || "Nueva Solicitud"}</TabsTrigger>
              </TabsList>

              {/* PESTAÑA: TENGO UNA COTIZACIÓN */}
              <TabsContent value="existing" className="mt-6">
                <form onSubmit={handleSubmitExisting} className="space-y-6">
                  <div className="bg-sage-50 rounded-xl p-4 border border-sage-200 mb-4">
                    <p className="text-sm text-sage-700">{dict?.existingNotice || "Ingresa los datos para pagar"}</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quoteId" className="text-charcoal-700">{dict?.quoteId || "ID de Cotización"}</Label>
                      <Input id="quoteId" name="quoteId" value={existingQuote.quoteId} onChange={handleExistingQuoteChange} required className="bg-cream-50 border-cream-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quoteName" className="text-charcoal-700">{dict?.serviceName || "Nombre del Servicio"}</Label>
                      <Input id="quoteName" name="quoteName" value={existingQuote.quoteName} onChange={handleExistingQuoteChange} required className="bg-cream-50 border-cream-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quotePrice" className="text-charcoal-700">{dict?.quotePrice || "Precio"}</Label>
                      <Input id="quotePrice" name="quotePrice" type="number" min="0" step="0.01" value={existingQuote.quotePrice} onChange={handleExistingQuoteChange} required className="bg-cream-50 border-cream-300" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-charcoal-300 text-charcoal-600 hover:bg-cream-200">{dict?.btnCancel || "Cancelar"}</Button>
                    <Button type="submit" className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 text-cream-50">{dict?.btnAddCheckout || "Pagar"}</Button>
                  </div>
                </form>
              </TabsContent>

              {/* PESTAÑA: NUEVA COTIZACIÓN */}
              <TabsContent value="new" className="mt-6">
                <ScrollArea className="max-h-[50vh] pr-4">
                  <form onSubmit={handleSubmitNew} className="space-y-6">
                    {/* Resumen del carrito oculto por brevedad... igual que el tuyo original */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-charcoal-700">{dict?.fullName || "Nombre"}</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-charcoal-700">{dict?.email || "Correo"}</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-cream-50 border-cream-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-charcoal-700">{dict?.projectDetails || "Detalles"}</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={4} className="bg-cream-50 border-cream-300 resize-none" />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-charcoal-300 text-charcoal-600 hover:bg-cream-200">{dict?.btnCancel || "Cancelar"}</Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 text-cream-50">
                        {isSubmitting ? dict?.btnSending || "Enviando..." : dict?.btnSubmit || "Enviar"}
                      </Button>
                    </div>
                  </form>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}