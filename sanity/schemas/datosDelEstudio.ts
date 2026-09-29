import { defineField, defineType } from "sanity";

export default defineType({
  name: "datosDelEstudio",
  title: "Datos del estudio",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre del estudio", type: "string" }),
    defineField({ name: "horarios", title: "Horarios de atención", type: "string" }),
    defineField({ name: "direccion", title: "Dirección", type: "string" }),
    defineField({ name: "telefono", title: "Teléfono", type: "string" }),
    defineField({ name: "telefonoWhatsapp", title: "Número de WhatsApp (con código de país, sin +)", type: "string" }),
    defineField({ name: "email", title: "Email de contacto", type: "string" }),
  ],
});
