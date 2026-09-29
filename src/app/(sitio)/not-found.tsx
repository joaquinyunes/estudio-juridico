import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[88rem] flex-col justify-center px-6 py-24">
      <p className="rotulo text-lacre">Error 404 — Expediente no encontrado</p>
      <h1 className="display mt-6 max-w-4xl text-[clamp(3rem,9vw,8rem)]">
        Esta foja <em>no existe.</em>
      </h1>
      <p className="mt-8 max-w-xl text-lg text-tinta-2">
        La página que buscás se movió o nunca fue parte del expediente. Volvé al inicio o contanos tu
        caso directamente.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="rounded-full bg-tinta px-7 py-4 text-papel hover:bg-lacre">
          Volver al inicio
        </Link>
        <Link href="/contacto" className="rounded-full border border-tinta px-7 py-4 hover:bg-tinta hover:text-papel">
          Contanos tu caso
        </Link>
      </div>
    </section>
  );
}
