import { getDictionary } from "@/lib/getDictionary";
import HomeClient from "./HomeClient";

interface PageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  
  const dict = await getDictionary(locale);
  return <HomeClient dict={dict} lang={locale} />;
}