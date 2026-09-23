import { DestinosView } from "./destinos-view";
import { getAllDestinations } from "@/lib/catalog/repository";

export default async function DestinosIndex() {
  const destinations = await getAllDestinations();
  return <DestinosView destinations={destinations} />;
}
