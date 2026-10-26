import { useCallback, useEffect, useState } from "react";
import type { CloneDocument } from "../types";
import {
  deleteDocument,
  fetchDocuments,
  ingestDocument,
  uploadDocument,
  validateFile,
} from "../lib/documents";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export function useDocuments() {
  const { session } = useAuth();
  const toast = useToast();
  const [documents, setDocuments] = useState<CloneDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      setDocuments(await fetchDocuments());
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markBusy = (id: string, busy: boolean) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  const process = useCallback(
    async (doc: CloneDocument) => {
      markBusy(doc.id, true);
      setDocuments((list) =>
        list.map((d) => (d.id === doc.id ? { ...d, status: "processing", error_message: null } : d)),
      );
      try {
        await ingestDocument(doc.id);
        toast(`${doc.title} is klaar. De kloon kent het nu.`);
      } catch (e) {
        toast(`${doc.title}: ${e instanceof Error ? e.message : String(e)}`, "error");
      } finally {
        markBusy(doc.id, false);
        await refresh();
      }
    },
    [refresh, toast],
  );

  const upload = useCallback(
    async (files: File[]) => {
      const userId = session?.user.id;
      if (!userId) return;
      for (const file of files) {
        const problem = validateFile(file);
        if (problem) {
          toast(problem, "error");
          continue;
        }
        try {
          const doc = await uploadDocument(userId, file);
          setDocuments((list) => [doc, ...list]);
          void process(doc);
        } catch (e) {
          toast(e instanceof Error ? e.message : String(e), "error");
        }
      }
    },
    [session, process, toast],
  );

  const remove = useCallback(
    async (doc: CloneDocument) => {
      markBusy(doc.id, true);
      try {
        await deleteDocument(doc);
        setDocuments((list) => list.filter((d) => d.id !== doc.id));
        toast(`${doc.title} is verwijderd.`);
      } catch (e) {
        toast(e instanceof Error ? e.message : String(e), "error");
      } finally {
        markBusy(doc.id, false);
      }
    },
    [toast],
  );

  return { documents, loading, busyIds, upload, retry: process, remove };
}
