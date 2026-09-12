import React, { useState } from 'react';
import { GameStateProvider, useGameState } from './modules/core/GameStateContext';
import { Navbar } from './modules/economy/Navbar';
import { HeroCard } from './modules/hero/HeroCard';
import { LevelUpCelebration } from './modules/hero/LevelUpCelebration';
import { QuestBoard } from './modules/quests/QuestBoard';
import { QuestModal } from './modules/quests/QuestModal';
import { ShopModal } from './modules/economy/ShopModal';
import { InventoryDrawer } from './modules/economy/InventoryDrawer';
import { AuthModal } from './modules/economy/AuthModal';
import { useKeyboardShortcuts } from './modules/quests/useKeyboardShortcuts';

const MainDashboard: React.FC = () => {
  const { profile, activeLevelUp, dismissLevelUp, addQuest } = useGameState();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);

  // Global hotkeys (N for new quest, S for shop, Esc to close modals)
  useKeyboardShortcuts({
    onNewQuest: () => setIsQuestModalOpen(true),
    onOpenShop: () => setIsShopOpen(true),
    onEscape: () => {
      setIsShopOpen(false);
      setIsInventoryOpen(false);
      setIsAuthOpen(false);
      setIsQuestModalOpen(false);
      dismissLevelUp();
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Top Navbar HUD */}
      <Navbar
        onOpenShop={() => setIsShopOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stream 2: Hero Character HUD & Attributes */}
        <section aria-label="Hero Profile">
          <HeroCard profile={profile} />
        </section>

        {/* Stream 3: Quest Board */}
        <section aria-label="Quest Log">
          <QuestBoard />
        </section>
      </main>

      {/* Global Modals & Drawers */}
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      <InventoryDrawer isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <QuestModal
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        onSave={addQuest}
      />

      {/* Level Up Celebration Fanfare */}
      {activeLevelUp && (
        <LevelUpCelebration event={activeLevelUp} onDismiss={dismissLevelUp} />
      )}

      {/* Subtle Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>Life RPG &bull; Hackathon Edition &bull; Gamifying Real-World Ascension</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GameStateProvider>
      <MainDashboard />
    </GameStateProvider>
  );
}
