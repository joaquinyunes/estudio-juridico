type Props = {
  rotulo: string;
  titulo: React.ReactNode;
  bajada?: React.ReactNode;
  children?: React.ReactNode;
};

/** Cabecera de páginas internas: rótulo, titular display y bajada. */
export function CabeceraPagina({ rotulo, titulo, bajada, children }: Props) {
  return (
    <header className="mx-auto max-w-[88rem] px-6 pt-10 pb-14 md:pt-16 md:pb-20">
      <p className="rotulo text-lacre">{rotulo}</p>
      <h1 className="display mt-6 max-w-5xl text-[clamp(3rem,8vw,7.5rem)]">{titulo}</h1>
      {bajada && (
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-tinta-2 md:text-xl">{bajada}</p>
      )}
      {children}
      <div aria-hidden className="filete-doble trazar mt-14 text-tinta" />
    </header>
  );
}
