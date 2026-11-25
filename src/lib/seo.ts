import type { Metadata } from "next";
import { CATALOGO } from "./catalogo.ts";
import { FAQ, MARCA, PAGINAS, SITE_URL, paginaPorRuta } from "./sitio.ts";

export function urlAbsoluta(ruta: string): string {
  return `${SITE_URL}${ruta === "/" ? "" : ruta}`;
}

/** Metadatos de una página, todos salen de PAGINAS. */
export function metaPagina(ruta: string): Metadata {
  const p = paginaPorRuta(ruta);
  const url = urlAbsoluta(ruta);
  return {
    title: { absolute: p.titulo },
    description: p.descripcion,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: MARCA.nombre,
      title: p.titulo,
      description: p.descripcion,
      url,
    },
    twitter: { card: "summary_large_image", title: p.titulo, description: p.descripcion },
  };
}

type Json = Record<string, unknown>;

export function sitioLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: MARCA.nombre,
    url: SITE_URL,
    inLanguage: MARCA.idioma,
  };
}

/** Negocio de servicios; las ofertas salen del catálogo. */
export function negocioLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: MARCA.nombre,
    url: SITE_URL,
    description: MARCA.descripcion,
    areaServed: { "@type": "Country", name: "Argentina" },
    makesOffer: CATALOGO.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.nombre, description: s.resumen },
      priceSpecification: s.desde
        ? { "@type": "PriceSpecification", minPrice: s.usd, priceCurrency: "USD" }
        : { "@type": "PriceSpecification", price: s.usd, priceCurrency: "USD" },
    })),
  };
}

export function faqLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function migasLd(ruta: string): Json {
  const p = paginaPorRuta(ruta);
  const items = [{ nombre: "Inicio", ruta: "/" }, ...(ruta === "/" ? [] : [{ nombre: p.nav, ruta }])];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nombre,
      item: urlAbsoluta(it.ruta),
    })),
  };
}

/** JSON-LD por página. Solo datos verificables, derivados de las mismas fuentes. */
export function ldDePagina(ruta: string): Json[] {
  const base: Json[] = [migasLd(ruta)];
  if (ruta === "/") base.unshift(sitioLd(), negocioLd());
  if (ruta === "/preguntas-frecuentes") base.push(faqLd());
  if (ruta === "/servicios" || ruta === "/precios") base.push(negocioLd());
  return base;
}

export const RUTAS_SITEMAP = PAGINAS.map((p) => ({ ruta: p.ruta, prioridad: p.prioridad }));
