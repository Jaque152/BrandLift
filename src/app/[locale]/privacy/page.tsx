import { getDictionary } from "@/lib/getDictionary";
import LegalClient from "@/components/LegalClient";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: 'en' | 'es' }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return <LegalClient {...dict.legal.privacy} lang={locale} />;
}