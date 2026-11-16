import test from "node:test";
import assert from "node:assert/strict";
import { CLAVES_DE_TEXTO, numeroEnPalabras, rellenar, resolverTextos } from "../src/lib/plantilla.ts";
import { datosDelEstudio, equipo, areasDePractica } from "../src/lib/content.ts";

test("números en letras: 0–99 con «un» delante de sustantivo", () => {
  assert.equal(numeroEnPalabras(1), "un");
  assert.equal(numeroEnPalabras(5), "cinco");
  assert.equal(numeroEnPalabras(7), "siete");
  assert.equal(numeroEnPalabras(16), "dieciséis");
  assert.equal(numeroEnPalabras(21), "veintiún");
  assert.equal(numeroEnPalabras(30), "treinta");
  assert.equal(numeroEnPalabras(31), "treinta y un");
  assert.equal(numeroEnPalabras(39), "treinta y nueve");
  assert.equal(numeroEnPalabras(99), "noventa y nueve");
  assert.equal(numeroEnPalabras(100), "100");
  assert.equal(numeroEnPalabras(-1), "-1");
});

test("marcadores: mayúscula inicial, año de fundación y marcador desconocido", () => {
  const d = { nombre: "N", fundador: "F", ciudad: "C", fundacion: 2000 };
  const c = { abogados: 3, areas: 2 };
  assert.equal(rellenar("{Anios} años, {abogados}/{Abogados}, {areas}", d, c, 2010), "Diez años, tres/Tres, dos");
  assert.equal(rellenar("{nombre} {fundador} {ciudad} {fundacion}", d, c, 2010), "N F C 2000");
  assert.equal(rellenar("{no_existe}", d, c, 2010), "{no_existe}");
});

test("el estudio actual produce exactamente los textos que ya estaban publicados", () => {
  const t = resolverTextos(datosDelEstudio, { abogados: equipo.length, areas: areasDePractica.length }, 2026);
  assert.equal(
    t.heroBajada,
    "Treinta y nueve años frente a Tribunales explicando el derecho en castellano. Contanos tu caso y en 48 horas te decimos, sin costo, si conviene avanzar y qué podés esperar.",
  );
  assert.equal(t.estudioTitulo + " " + t.estudioTituloEnfasis, "Hablamos claro desde 1987.");
  assert.equal(t.historiaTitulo + " " + t.historiaTituloEnfasis, "Treinta y nueve años en la misma puerta.");
  assert.equal(t.equipoTitulo + " " + t.equipoTituloEnfasis, "Siete abogados. Un solo trato.");
  assert.match(t.estudioParrafo, /^Ernesto Iturbe abrió el estudio .* Treinta y nueve años después, somos siete abogados y cinco áreas de práctica, pero la regla es la misma\./);
  assert.match(t.descripcionSitio, /^Estudio jurídico en Buenos Aires desde 1987\./);
  for (const k of CLAVES_DE_TEXTO) assert.doesNotMatch(t[k], /\{\w+\}/, `${k} quedó con un marcador sin resolver`);
});

test("un estudio distinto: ningún dato del estudio actual aparece en los textos", () => {
  const otro = {
    ...datosDelEstudio,
    nombre: "Ferrer & Quiroga",
    fundador: "Lucía Ferrer",
    ciudad: "Córdoba",
    fundacion: 2005,
    descripcionSitio: "Estudio jurídico en {ciudad} desde {fundacion}.",
    heroBajada: "{Anios} años en {ciudad}. Contanos tu caso.",
    estudioTitulo: "Con {nombre}",
    estudioTituloEnfasis: "desde {fundacion}.",
    estudioParrafo: "{fundador} fundó el estudio. Hoy somos {abogados} abogados y {areas} áreas.",
    historiaTitulo: "{Anios} años",
    historiaTituloEnfasis: "de trabajo.",
    historiaBajada: "Nuestra historia.",
    equipoTitulo: "{Abogados} abogados.",
    equipoTituloEnfasis: "Un equipo.",
    contactoDescripcion: "Escribinos desde {ciudad}.",
  };
  const t = resolverTextos(otro, { abogados: 4, areas: 3 }, 2026);
  assert.equal(t.heroBajada, "Veintiún años en Córdoba. Contanos tu caso.");
  assert.equal(t.estudioParrafo, "Lucía Ferrer fundó el estudio. Hoy somos cuatro abogados y tres áreas.");
  assert.equal(t.equipoTitulo, "Cuatro abogados.");
  assert.equal(t.estudioTituloEnfasis, "desde 2005.");
  const todo = Object.values(t).join(" ");
  for (const viejo of ["Iturbe", "Lavalle", "1987", "Buenos Aires", "Tribunales", "Treinta"]) {
    assert.ok(!todo.includes(viejo), `quedó «${viejo}» en los textos del estudio nuevo`);
  }
});
