/** Cintas tipográficas infinitas con las áreas del estudio. Decorativas. */
export function Marquesina({ items }: { items: string[] }) {
  const fila = (
    <span className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="font-display text-[clamp(2rem,4.5vw,3.75rem)] italic [font-variation-settings:'SOFT'_100,'WONK'_1]">
            {item}
          </span>
          <span className="text-2xl text-lacre">§</span>
        </span>
      ))}
    </span>
  );

  const filaMono = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item) => (
        <span key={item} className="rotulo flex items-center gap-8 text-tinta-3">
          {item}
          <span aria-hidden className="text-lacre">
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div aria-hidden className="border-y border-tinta select-none">
      <div className="marquesina-mascara overflow-hidden py-5">
        <div className="marquesina flex w-max">
          {fila}
          {fila}
        </div>
      </div>
      <div className="marquesina-mascara overflow-hidden border-t border-linea bg-papel-2 py-3">
        <div className="marquesina-inversa flex w-max">
          {filaMono}
          {filaMono}
          {filaMono}
          {filaMono}
        </div>
      </div>
    </div>
  );
}
