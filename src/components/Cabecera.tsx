/** Cabecera de página interna: etiqueta mono, un único h1 y bajada. El header es fijo, por eso el aire superior. */
export function Cabecera({ etiqueta, titulo, bajada }: { etiqueta: string; titulo: React.ReactNode; bajada?: React.ReactNode }) {
  return (
    <section className="section" style={{ paddingBlock: "calc(var(--header-h) + clamp(40px, 6vw, 84px)) clamp(32px, 5vw, 72px)" }}>
      <div className="container" style={{ display: "grid", gap: 20 }}>
        <p className="label">{etiqueta}</p>
        <h1 className="h1" style={{ maxWidth: "16ch" }}>{titulo}</h1>
        {bajada && <p className="lead muted">{bajada}</p>}
      </div>
    </section>
  );
}
