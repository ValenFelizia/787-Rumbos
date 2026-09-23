import SiteLayout from "./(site)/layout";
import NotFoundPage from "./(site)/not-found";

/**
 * Con dos root layouts (`(site)` y `(payload)`), una URL que no matchea
 * no entra en ninguno. Esta página reusa el layout del sitio para que
 * el 404 global conserve fuentes, estilos y el chrome de la app.
 */
export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundPage />
    </SiteLayout>
  );
}
