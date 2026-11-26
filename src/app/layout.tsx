import type { Metadata, Viewport } from "next";
import "./fuentes.css";
import "./globals.css";
import "./landing.css";
import "./paginas.css";
import { MARCA, SITE_URL } from "@/lib/sitio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: MARCA.nombre, template: `%s · ${MARCA.nombre}` },
  description: MARCA.descripcion,
  applicationName: MARCA.nombre,
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "es_AR", siteName: MARCA.nombre },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-wght-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
