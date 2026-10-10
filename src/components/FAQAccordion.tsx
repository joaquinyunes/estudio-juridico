import type { Faq } from "@/lib/content";

/**
 * Preguntas frecuentes con <details>/<summary> nativos: accesibles, sin
 * JavaScript y con el contenido indexable por buscadores.
 */
export function FAQAccordion({ faqs, abrirPrimera = true }: { faqs: Faq[]; abrirPrimera?: boolean }) {
  return (
    <div className="border-t border-tinta">
      {faqs.map((faq, index) => (
        <details
          key={faq.pregunta}
          open={abrirPrimera && index === 0}
          className="faq group border-b border-linea"
        >
          <summary className="flex cursor-pointer list-none items-start gap-5 py-6 [&::-webkit-details-marker]:hidden">
            <span className="rotulo pt-2 text-lacre transition-transform duration-500 ease-[var(--ease-folio)] group-hover:translate-x-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-display text-xl leading-snug transition-colors duration-300 group-hover:text-lacre group-open:text-lacre md:text-2xl">
              {faq.pregunta}
            </span>
            <span
              aria-hidden
              className="relative mt-2 h-4 w-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-tinta after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-tinta after:transition-transform after:duration-300 group-open:after:scale-y-0"
            />
          </summary>
          <p className="max-w-2xl pb-7 pl-10 leading-relaxed text-tinta-2">{faq.respuesta}</p>
        </details>
      ))}
    </div>
  );
}
