// Revisión adversaria: cada prueba es un ataque o un descuido que se encontró leyendo el código propio.
import test from "node:test";
import assert from "node:assert/strict";
import { crearContador, enlaceSeguro, ipDelCliente, mismoOrigen, tieneControl } from "../src/lib/seguridad.ts";
import { rellenar } from "../src/lib/plantilla.ts";

const h = (o: Record<string, string>) => new Headers(o);

test("IP del cliente: fuera de Vercel manda la última de x-forwarded-for (la agrega el proxy), no la que escribe el atacante", () => {
  assert.equal(ipDelCliente(h({ "x-forwarded-for": "1.1.1.1, 9.9.9.9" }), false), "9.9.9.9");
  assert.equal(ipDelCliente(h({ "x-forwarded-for": "2.2.2.2, 9.9.9.9" }), false), "9.9.9.9");
  assert.equal(ipDelCliente(h({ "x-forwarded-for": "9.9.9.9" }), false), "9.9.9.9");
  assert.equal(ipDelCliente(h({}), false), "anon");
});

test("IP del cliente: fuera de Vercel no se creen los encabezados propios de Vercel (los puede escribir cualquiera)", () => {
  assert.equal(ipDelCliente(h({ "x-vercel-forwarded-for": "6.6.6.6", "x-forwarded-for": "9.9.9.9" }), false), "9.9.9.9");
  assert.equal(ipDelCliente(h({ "x-real-ip": "6.6.6.6" }), false), "anon");
});

test("IP del cliente: en Vercel manda el encabezado que pone la plataforma", () => {
  assert.equal(ipDelCliente(h({ "x-vercel-forwarded-for": "5.5.5.5", "x-forwarded-for": "1.1.1.1" }), true), "5.5.5.5");
  assert.equal(ipDelCliente(h({ "x-real-ip": "5.5.5.5" }), true), "5.5.5.5");
});

test("mismo origen: un POST desde otro sitio se rechaza; sin Origin (curl, app) pasa", () => {
  assert.equal(mismoOrigen(h({ origin: "https://sitio.example", host: "sitio.example" })), true);
  assert.equal(mismoOrigen(h({ origin: "https://malo.example", host: "sitio.example" })), false);
  assert.equal(mismoOrigen(h({ origin: "null", host: "sitio.example" })), false);
  assert.equal(mismoOrigen(h({ origin: "no es una url", host: "sitio.example" })), false);
  assert.equal(mismoOrigen(h({ "sec-fetch-site": "cross-site", host: "sitio.example" })), false);
  assert.equal(mismoOrigen(h({ "sec-fetch-site": "same-origin", host: "sitio.example" })), true);
  assert.equal(mismoOrigen(h({ host: "sitio.example" })), true);
});

test("enlaces del aviso: solo relativos o http(s); javascript:, data: y // se descartan", () => {
  assert.equal(enlaceSeguro("/notas/x"), "/notas/x");
  assert.equal(enlaceSeguro("https://ok.example/a?b=1"), "https://ok.example/a?b=1");
  assert.equal(enlaceSeguro("http://ok.example"), "http://ok.example");
  for (const malo of ["javascript:alert(1)", " JaVaScRiPt:alert(1)", "data:text/html,<script>", "//malo.example", "vbscript:x", "\tjavascript:x", ""]) {
    assert.equal(enlaceSeguro(malo), undefined, malo);
  }
  assert.equal(enlaceSeguro(undefined), undefined);
});

test("caracteres de control (CR/LF, NUL, separadores de línea) se detectan", () => {
  assert.equal(tieneControl("Ana\r\nBcc: x@y.z"), true);
  assert.equal(tieneControl("Ana\u0000"), true);
  assert.equal(tieneControl("Ana "), true);
  assert.equal(tieneControl("Ana María Pérez"), false);
});

test("contador: cuenta dentro de la ventana, olvida lo viejo y no crece sin límite", () => {
  const c = crearContador(1000, 3);
  assert.equal(c.registrar("a", 0), 1);
  assert.equal(c.registrar("a", 500), 2);
  assert.equal(c.cuenta("a", 900), 2);
  assert.equal(c.cuenta("a", 1400), 1); // el de t=0 ya salió de la ventana
  c.registrar("b", 1700); c.registrar("c", 1700); c.registrar("d", 1700); c.registrar("e", 1700);
  assert.ok(c.tamano() <= 3, `el mapa creció a ${c.tamano()}`);
  c.borrar("e");
  assert.equal(c.cuenta("e", 1700), 0);
});

test("marcadores de plantilla: nombres heredados de Object no se resuelven a funciones", () => {
  const d = { nombre: "N", fundador: "F", ciudad: "C", fundacion: 2000 };
  const c = { abogados: 1, areas: 1 };
  for (const k of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
    assert.equal(rellenar(`x{${k}}y`, d, c, 2010), `x{${k}}y`, k);
  }
});
