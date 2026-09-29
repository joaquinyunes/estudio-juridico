import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getDatosDelEstudio } from "@/lib/cms";
import { SITE_URL } from "@/lib/schema-org";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export async function generateMetadata(): Promise<Metadata> {
  const datos = await getDatosDelEstudio();
  const descripcion =
    "Estudio jurídico en Buenos Aires desde 1987. Derecho laboral, familia, penal, comercial y sucesiones. Evaluación de tu caso sin costo en 48 h.";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${datos.nombre} — Abogados en Buenos Aires desde 1987`,
      template: `%s — ${datos.nombre}`,
    },
    description: descripcion,
    applicationName: datos.nombre,
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: datos.nombreLegal,
      title: `${datos.nombre} — Abogados en Buenos Aires`,
      description: descripcion,
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f3ede2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        {children}
        {process.env.VERCEL && <Analytics />}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
