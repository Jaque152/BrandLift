import { getDictionary } from "@/lib/getDictionary";
import LegalClient from "@/components/LegalClient";

export default async function TermsPage({ params }: { params: Promise<{ locale: 'en' | 'es' }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return <LegalClient {...dict.legal.terms} lang={locale} />;
}