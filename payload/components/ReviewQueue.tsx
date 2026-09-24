import type { Payload } from "payload";
import { classifyForReview, type ReviewDoc, type ReviewLink } from "../editorial/review";

type ReviewQueueProps = {
  payload: Payload;
};

const sections: { key: "expiring" | "missingValidity" | "noDepartures" | "staleReview"; title: string }[] = [
  { key: "expiring", title: "Precios vencidos o por vencer" },
  { key: "missingValidity", title: "Sin vigencia de precio cargada" },
  { key: "noDepartures", title: "Sin salidas activas" },
  { key: "staleReview", title: "Sin revisión hace 30 días o más" },
];

function List({ items }: { items: ReviewLink[] }) {
  if (items.length === 0) {
    return <p className="rumbos-review-empty">Nada en esta lista.</p>;
  }
  return (
    <ul>
      {items.map((item) => (
        <li key={String(item.id)}>
          <a href={`/admin/collections/destinations/${item.id}`}>
            {item.name}
            <span className="rumbos-review-meta">{item.detail}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export async function ReviewQueue({ payload }: ReviewQueueProps) {
  const published = await payload.find({
    collection: "destinations",
    depth: 0,
    draft: false,
    limit: 200,
    overrideAccess: true,
    pagination: false,
    sort: "name",
    where: { _status: { equals: "published" } },
  });
  const pending = await payload.find({
    collection: "destinations",
    depth: 0,
    draft: true,
    limit: 200,
    overrideAccess: true,
    pagination: false,
    sort: "name",
    where: { pendingApproval: { equals: true } },
  });

  const lists = classifyForReview(published.docs as ReviewDoc[]);
  const pendingItems: ReviewLink[] = pending.docs.map((doc) => ({
    id: doc.id,
    name: doc.name?.trim() || doc.slug || String(doc.id),
    detail: "Borrador pendiente de aprobación",
  }));

  return (
    <section className="rumbos-review">
      <style>{`
        .rumbos-review { color: var(--theme-text); margin: 0 0 1.75rem; }
        .rumbos-review h2 { font-size: 1.35rem; line-height: 1.2; margin: 0 0 0.35rem; }
        .rumbos-review > p { margin: 0 0 1rem; max-width: 42rem; }
        .rumbos-review h3 { font-size: 1rem; margin: 1.1rem 0 0.45rem; }
        .rumbos-review ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
        .rumbos-review a {
          display: block;
          padding: 0.8rem 0.95rem;
          border-radius: 8px;
          background: var(--theme-elevation-50);
          color: var(--theme-text);
          text-decoration: none;
        }
        .rumbos-review a:hover { background: var(--theme-elevation-100); }
        .rumbos-review-meta { display: block; margin-top: 0.15rem; font-size: 0.82rem; opacity: 0.75; }
        .rumbos-review-empty { margin: 0; font-size: 0.9rem; opacity: 0.7; }
        @media (max-width: 640px) {
          .rumbos-review a { padding: 0.95rem 1rem; }
        }
      `}</style>
      <h2>Para revisar</h2>
      <p>Lo que conviene mirar antes de que quede un precio viejo publicado.</p>
      {sections.map((section) => (
        <div key={section.key}>
          <h3>
            {section.title} ({lists[section.key].length})
          </h3>
          <List items={lists[section.key]} />
        </div>
      ))}
      <div>
        <h3>Pendiente de aprobación ({pendingItems.length})</h3>
        <List items={pendingItems} />
      </div>
    </section>
  );
}
