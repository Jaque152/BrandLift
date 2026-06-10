import { getDictionary } from "@/lib/getDictionary";
import CartClient from "./CartClient";

interface CartPageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return <CartClient dict={dict.cartPage} lang={locale} />;
}