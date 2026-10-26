import type { CloneDocument } from "../types";
import { DocumentCard } from "./DocumentCard";

interface Props {
  documents: CloneDocument[];
  loading: boolean;
  busyIds: Set<string>;
  onRetry: (doc: CloneDocument) => void;
  onDelete: (doc: CloneDocument) => void;
  onGoUpload: () => void;
}

export function KnowledgeScreen({ documents, loading, busyIds, onRetry, onDelete, onGoUpload }: Props) {
  return (
    <main className="screen screen--with-nav">
      <header className="screen__header">
        <h1 className="title">Kennisbank</h1>
        <p className="lead">Dit weet de kloon over mij. Verwijder je een document, dan is het echt weg.</p>
      </header>

      <section className="stack" aria-label="Documenten">
        {loading && <p className="empty">Documenten laden…</p>}
        {!loading && documents.length === 0 && (
          <div className="stack">
            <p className="empty">De kennisbank is nog leeg.</p>
            <button type="button" className="btn btn--primary" onClick={onGoUpload}>
              Document uploaden
            </button>
          </div>
        )}
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            busy={busyIds.has(doc.id)}
            onRetry={onRetry}
            onDelete={onDelete}
          />
        ))}
      </section>
    </main>
  );
}
