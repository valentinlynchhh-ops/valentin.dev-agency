import { bajarArchivo } from "@/lib/archivos";
import { ARCHIVO_FOTO, rutaFoto } from "@/lib/demoImagenes";

/* Fotos de las muestras: /demo/img/<hash>.webp (y -1024, -640). Las guarda POST /api/muestras/fotos en el bucket
   privado; acá se sirven con caché de un año (el nombre es el hash del contenido, nunca cambia). */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const { archivo } = await params;
  const no = () => new Response("No encontrada", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  if (!ARCHIVO_FOTO.test(archivo)) return no();
  const r = await bajarArchivo(rutaFoto(archivo));
  if (!r?.body) return no();
  return new Response(r.body, {
    status: 200,
    headers: {
      "content-type": "image/webp",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'",
      "cross-origin-resource-policy": "cross-origin",
      "x-robots-tag": "noindex",
    },
  });
}
