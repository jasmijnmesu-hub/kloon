import { BookOpen, MessageCircle, Upload, type LucideIcon } from "lucide-react";
import type { View } from "../types";

const ITEMS: { view: View; label: string; Icon: LucideIcon }[] = [
  { view: "chat", label: "Chat", Icon: MessageCircle },
  { view: "kennisbank", label: "Kennisbank", Icon: BookOpen },
  { view: "upload", label: "Uploaden", Icon: Upload },
];

interface Props {
  current: View;
  onNavigate: (view: View) => void;
}

export function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Hoofdmenu">
      {ITEMS.map(({ view, label, Icon }) => {
        const active = current === view;
        return (
          <button
            key={view}
            type="button"
            className="bottom-nav__item"
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(view)}
          >
            <Icon size={24} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
