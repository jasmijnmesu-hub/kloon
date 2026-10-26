import { useState } from "react";
import type { View } from "../types";
import { useDocuments } from "../hooks/useDocuments";
import { useChat } from "../hooks/useChat";
import { useCloneSettings } from "../hooks/useCloneSettings";
import { useToast } from "../contexts/ToastContext";
import { signOut } from "../lib/auth";
import { BottomNav } from "./BottomNav";
import { ChatScreen } from "./ChatScreen";
import { KnowledgeScreen } from "./KnowledgeScreen";
import { SettingsScreen } from "./SettingsScreen";
import { UploadScreen } from "./UploadScreen";

// Hooks staan hier, zodat uploads en het gesprek doorlopen als je van scherm wisselt.
export function CloneApp() {
  const [view, setView] = useState<View>("chat");
  const toast = useToast();
  const docs = useDocuments();
  const chat = useChat();
  const clone = useCloneSettings();

  const handleSignOut = () => {
    signOut().catch((e: unknown) => toast(e instanceof Error ? e.message : String(e), "error"));
  };

  return (
    <>
      {view === "chat" && (
        <ChatScreen
          cloneName={clone.settings?.clone_name ?? "…"}
          messages={chat.messages}
          sending={chat.sending}
          onSend={(q) => void chat.send(q)}
          onOpenSettings={() => setView("instellingen")}
          onOpenSource={() => setView("kennisbank")}
        />
      )}
      {view === "kennisbank" && (
        <KnowledgeScreen
          documents={docs.documents}
          loading={docs.loading}
          busyIds={docs.busyIds}
          onRetry={(d) => void docs.retry(d)}
          onDelete={(d) => void docs.remove(d)}
          onGoUpload={() => setView("upload")}
        />
      )}
      {view === "upload" && (
        <UploadScreen
          documents={docs.documents}
          busyIds={docs.busyIds}
          onUpload={(files) => void docs.upload(files)}
          onRetry={(d) => void docs.retry(d)}
        />
      )}
      {view === "instellingen" && (
        <SettingsScreen
          settings={clone.settings}
          saving={clone.saving}
          onSave={(s) => void clone.save(s)}
          onReset={() => void clone.reset()}
          onBack={() => setView("chat")}
          onSignOut={handleSignOut}
        />
      )}
      {view !== "instellingen" && <BottomNav current={view} onNavigate={setView} />}
    </>
  );
}
