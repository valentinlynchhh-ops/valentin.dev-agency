/* Transición entre páginas: cada navegación vuelve a montar este template y la cortina amarilla se abre. Solo CSS. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="x-cortina" aria-hidden="true" />
      <div className="x-pagina">{children}</div>
    </>
  );
}
