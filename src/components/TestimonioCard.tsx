import type { Testimonio } from "@/lib/content";

export function TestimonioCard({ testimonio }: { testimonio: Testimonio }) {
  return (
    <blockquote className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-slate-700 italic">&ldquo;{testimonio.texto}&rdquo;</p>
      <footer className="mt-4 text-sm font-medium text-slate-500">
        {testimonio.tipoDeCaso}
      </footer>
    </blockquote>
  );
}
