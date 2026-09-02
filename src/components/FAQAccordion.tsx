"use client";

import { useState } from "react";
import type { Faq } from "@/lib/content";

export function FAQAccordion({ faqs }: { faqs: Faq[] }) {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
      {faqs.map((faq, index) => {
        const estaAbierta = abierta === index;
        return (
          <div key={faq.pregunta}>
            <button
              type="button"
              onClick={() => setAbierta(estaAbierta ? null : index)}
              aria-expanded={estaAbierta}
              className="w-full text-left py-4 flex items-center justify-between gap-4 font-medium"
            >
              <span>{faq.pregunta}</span>
              <span aria-hidden className="text-slate-400">
                {estaAbierta ? "−" : "+"}
              </span>
            </button>
            {estaAbierta && (
              <p className="pb-4 text-slate-600">{faq.respuesta}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
