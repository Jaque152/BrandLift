import type { Metadata } from "next";
import "../globals.css";
import ClientBody from "./ClientBody";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Brand Lift | Creative Digital Agency",
  description: "Boost your digital presence with precision and purpose.",
};

// 1. Definimos params como Promise
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// 2. Marcamos el layout como async
export default async function RootLayout({ children, params }: RootLayoutProps) {
  // 3. Resolvemos la promesa
  const { locale } = await params;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={locale || 'en'}>
      <body className="antialiased" suppressHydrationWarning>
        <ClientBody>{children}</ClientBody>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </body>
    </html>
  );
}