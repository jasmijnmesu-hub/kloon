import { useCallback, useState } from "react";
import type { ChatMessage, ChatTurn } from "../types";
import { askClone } from "../lib/clone";

const HISTORY_TURNS = 6;

function newId(): string {
  return crypto.randomUUID();
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const send = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || sending) return;

      // Alleen geslaagde beurten gaan mee als geschiedenis
      const history: ChatTurn[] = messages
        .filter((m) => !m.isError)
        .slice(-HISTORY_TURNS)
        .map((m) => ({ role: m.role, text: m.text }));

      setMessages((list) => [...list, { id: newId(), role: "user", text }]);
      setSending(true);
      try {
        const { answer, sources } = await askClone(text, history);
        setMessages((list) => [...list, { id: newId(), role: "model", text: answer, sources }]);
      } catch (e) {
        const reason = e instanceof Error ? e.message : String(e);
        setMessages((list) => [
          ...list,
          { id: newId(), role: "model", text: `Er ging iets mis: ${reason}`, isError: true },
        ]);
      } finally {
        setSending(false);
      }
    },
    [messages, sending],
  );

  return { messages, sending, send };
}
