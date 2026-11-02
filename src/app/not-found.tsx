import NotFound from "./(sitio)/not-found";

/** 404 para rutas fuera de cualquier layout (URLs inexistentes). */
export default function RootNotFound() {
  return (
    <main id="contenido">
      <NotFound />
    </main>
  );
}
