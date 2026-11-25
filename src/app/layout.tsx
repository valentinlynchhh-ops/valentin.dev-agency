import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}
