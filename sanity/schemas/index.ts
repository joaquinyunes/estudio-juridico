import areaDePractica from "./areaDePractica";
import testimonio from "./testimonio";
import datosDelEstudio from "./datosDelEstudio";
import abogado from "./abogado";
import nota from "./nota";
import lead from "./lead";
import aviso from "./aviso";
import faqGeneral from "./faqGeneral";
import hito from "./hito";

export const schemaTypes = [
  areaDePractica,
  abogado,
  testimonio,
  nota,
  faqGeneral,
  hito,
  datosDelEstudio,
  aviso,
  lead,
];

/** Documentos únicos: el panel los muestra como una sola ficha, sin lista. */
export const documentosUnicos = ["datosDelEstudio", "aviso"] as const;
