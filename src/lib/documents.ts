import type { CloneDocument, IngestResponse } from "../types";
import { ALLOWED_EXTENSIONS, DOCUMENT_BUCKET, MAX_FILE_BYTES, supabase } from "./supabase";
import { invokeFunction } from "./functions";

const COLUMNS = "id, title, storage_bucket, storage_path, status, error_message, created_at";

export async function fetchDocuments(): Promise<CloneDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .returns<CloneDocument[]>();
  if (error) throw new Error(`Documenten ophalen mislukt: ${error.message}`);
  return data ?? [];
}

export function validateFile(file: File): string | null {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return `${file.name}: dit bestandstype kan niet. Kies pdf, docx, txt, md of csv.`;
  }
  if (file.size > MAX_FILE_BYTES) return `${file.name} is groter dan 10 MB.`;
  if (file.size === 0) return `${file.name} is leeg.`;
  return null;
}

function safeFileName(name: string): string {
  return name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");
}

// Bestand naar Storage (map = user-id, zo eist de Storage-policy) en daarna een rij in documents.
export async function uploadDocument(userId: string, file: File): Promise<CloneDocument> {
  const path = `${userId}/${Date.now()}-${safeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (uploadError) throw new Error(`Uploaden mislukt: ${uploadError.message}`);

  const { data, error } = await supabase
    .from("documents")
    .insert({ title: file.name, storage_bucket: DOCUMENT_BUCKET, storage_path: path })
    .select(COLUMNS)
    .single<CloneDocument>();

  if (error || !data) {
    await supabase.storage.from(DOCUMENT_BUCKET).remove([path]);
    throw new Error(`Opslaan mislukt: ${error?.message ?? "onbekende fout"}`);
  }
  return data;
}

export async function ingestDocument(documentId: string): Promise<number> {
  const result = await invokeFunction<IngestResponse>("ingest", { document_id: documentId });
  return result.chunks ?? 0;
}

// Eerst het bestand uit Storage, dan de rij; de chunks verdwijnen via ON DELETE CASCADE.
export async function deleteDocument(doc: CloneDocument): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(doc.storage_bucket)
    .remove([doc.storage_path]);
  if (storageError) throw new Error(`Bestand verwijderen mislukt: ${storageError.message}`);

  const { error } = await supabase.from("documents").delete().eq("id", doc.id);
  if (error) throw new Error(`Document verwijderen mislukt: ${error.message}`);
}
