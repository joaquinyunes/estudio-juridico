import type { Metadata } from "next";
import { testimonios } from "@/lib/content";
import { TestimonioCard } from "@/components/TestimonioCard";

export const metadata: Metadata = {
  title: "Casos resueltos",
  description: "Testimonios anonimizados por tipo de caso resuelto.",
};

export default function TestimoniosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold text-navy">
        Casos resueltos
      </h1>
      <p className="mt-4 text-slate-600 max-w-2xl">
        Testimonios anonimizados, sin nombres, por respeto a la confidencialidad
        y ética profesional.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonios.map((testimonio) => (
          <TestimonioCard key={testimonio.texto} testimonio={testimonio} />
        ))}
      </div>
    </div>
  );
}
