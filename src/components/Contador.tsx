"use client";

import { useEffect, useRef } from "react";

/** "4200" → "4.200" (es-AR no agrupa los números de cuatro cifras). */
const conMiles = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Cifra que cuenta desde 0 al entrar en pantalla. El HTML del servidor ya trae
 * el valor final (sin JavaScript o con movimiento reducido no cambia nada).
 */
export function Contador({ valor }: { valor: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const meta = Number(valor.replace(/\./g, ""));
    if (!el || !Number.isFinite(meta)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        const duracion = 1600;
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min((ahora - inicio) / duracion, 1);
          const suave = 1 - Math.pow(1 - t, 4);
          el.textContent = conMiles(Math.round(meta * suave));
          if (t < 1) raf = requestAnimationFrame(paso);
        };
        el.textContent = "0";
        raf = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor]);

  return (
    <span ref={ref} className="tabular-nums">
      {valor}
    </span>
  );
}
