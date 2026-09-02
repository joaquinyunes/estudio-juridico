import type { Metadata } from "next";
import { FormularioCalificador } from "@/components/FormularioCalificador";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contanos tu caso y te respondemos a la brevedad.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold text-slate-900">
        Contanos tu caso
      </h1>
      <p className="mt-4 text-slate-600">
        Completá el formulario con el área y un resumen breve. Vas a continuar
        la conversación por WhatsApp con ese contexto ya cargado.
      </p>
      <div className="mt-8">
        <FormularioCalificador />
      </div>
    </div>
  );
}
