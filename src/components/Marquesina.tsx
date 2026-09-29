/** Cinta tipográfica infinita con las áreas del estudio. Decorativa. */
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

  return (
    <div aria-hidden className="overflow-hidden border-y border-tinta py-5 select-none">
      <div className="marquesina flex w-max">
        {fila}
        {fila}
      </div>
    </div>
  );
}
