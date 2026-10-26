export type View = "chat" | "kennisbank" | "upload" | "instellingen";

export type DocumentStatus = "uploaded" | "processing" | "ready" | "error";

export interface CloneDocument {
  id: string;
  title: string;
  storage_bucket: string;
  storage_path: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
}

export interface ChatSource {
  nr: number;
  document_id: string;
  title: string;
  similarity: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  sources?: ChatSource[];
  isError?: boolean;
}

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export interface ChatResponse {
  ok: boolean;
  answer?: string;
  sources?: ChatSource[];
  is_ai_clone?: boolean;
  error?: string;
}

export interface IngestResponse {
  ok: boolean;
  chunks?: number;
  error?: string;
}

export interface CloneSettings {
  clone_name: string;
  system_prompt: string;
}

export type ToastKind = "info" | "error";

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}
