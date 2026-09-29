type Props = {
  numero: string;
  rotulo: string;
  titulo: React.ReactNode;
  bajada?: React.ReactNode;
  claro?: boolean;
  className?: string;
  id?: string;
};

/**
 * Encabezado de sección con numeración "§", como los apartados de un código.
 * `titulo` acepta <em> para la palabra enfatizada en lacre.
 */
export function EncabezadoSeccion({ numero, rotulo, titulo, bajada, claro, className = "", id }: Props) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 ${className}`}>
      <p className={`rotulo md:col-span-3 md:pt-4 ${claro ? "text-lacre-claro" : "text-lacre"}`}>
        § {numero} <span className={claro ? "text-papel/60" : "text-tinta-3"}>— {rotulo}</span>
      </p>
      <div className="md:col-span-9">
        <h2 id={id} className="display text-[clamp(2.4rem,5.6vw,5rem)]">
          {titulo}
        </h2>
        {bajada && (
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${claro ? "text-papel/70" : "text-tinta-2"}`}>
            {bajada}
          </p>
        )}
      </div>
    </div>
  );
}
