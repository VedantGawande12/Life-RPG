import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onNewQuest?: () => void;
  onOpenShop?: () => void;
  onOpenInventory?: () => void;
  onOpenCodex?: () => void;
  onOpenAuth?: () => void;
  onToggleMute?: () => void;
  onToggleLexicon?: () => void;
  onSelectChamber?: (chamber: 'hero' | 'codex' | 'vigil') => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onNewQuest,
  onOpenShop,
  onOpenInventory,
  onOpenCodex,
  onOpenAuth,
  onToggleMute,
  onToggleLexicon,
  onSelectChamber,
  onEscape,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape' && onEscape) {
          onEscape();
        }
        return;
      }

      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      } else if ((e.key === 'n' || e.key === 'N') && onNewQuest) {
        e.preventDefault();
        onNewQuest();
      } else if ((e.key === 's' || e.key === 'S') && onOpenShop) {
        e.preventDefault();
        onOpenShop();
      } else if ((e.key === 'i' || e.key === 'I') && onOpenInventory) {
        e.preventDefault();
        onOpenInventory();
      } else if ((e.key === 'c' || e.key === 'C') && onOpenCodex) {
        e.preventDefault();
        onOpenCodex();
      } else if ((e.key === 'a' || e.key === 'A' || e.key === 'k' || e.key === 'K') && onOpenAuth) {
        e.preventDefault();
        onOpenAuth();
      } else if ((e.key === 'm' || e.key === 'M') && onToggleMute) {
        e.preventDefault();
        onToggleMute();
      } else if (e.key === '?' && onToggleLexicon) {
        e.preventDefault();
        onToggleLexicon();
      } else if (e.key === '1' && onSelectChamber) {
        onSelectChamber('hero');
      } else if (e.key === '2' && onSelectChamber) {
        onSelectChamber('codex');
      } else if (e.key === '3' && onSelectChamber) {
        onSelectChamber('vigil');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onNewQuest,
    onOpenShop,
    onOpenInventory,
    onOpenCodex,
    onOpenAuth,
    onToggleMute,
    onToggleLexicon,
    onSelectChamber,
    onEscape,
  ]);
}
