// Solo para las pruebas: el build de Next resuelve esto por su cuenta.
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
