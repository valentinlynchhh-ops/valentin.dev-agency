import type { MetadataRoute } from "next";
import { RUTAS_SITEMAP, urlAbsoluta } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS_SITEMAP.map((r) => ({
    url: urlAbsoluta(r.ruta) || urlAbsoluta("/"),
    changeFrequency: "monthly",
    priority: r.prioridad,
  }));
}
