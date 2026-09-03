import type { Testimonio } from "@/lib/content";

export function TestimonioCard({ testimonio }: { testimonio: Testimonio }) {
  return (
    <blockquote className="rounded-lg border border-slate-200 border-l-4 border-l-gold bg-white p-6 shadow-sm">
      <p className="text-slate-700 italic">&ldquo;{testimonio.texto}&rdquo;</p>
      <footer className="mt-4 text-sm font-medium text-navy">
        {testimonio.tipoDeCaso}
      </footer>
    </blockquote>
  );
}
