import { getDictionary } from "@/lib/getDictionary";
import CheckoutClient from "./CheckoutClient";

interface CheckoutPageProps {
  params: Promise<{ locale: 'en' | 'es' }>; 
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return <CheckoutClient dict={dict.checkout} lang={locale} />;
}