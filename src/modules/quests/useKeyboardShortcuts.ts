import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onNewQuest?: () => void;
  onOpenShop?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onNewQuest, onOpenShop, onEscape }: UseKeyboardShortcutsProps) {
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
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewQuest, onOpenShop, onEscape]);
}
