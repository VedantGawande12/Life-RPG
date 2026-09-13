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
import { VigilChronicle } from './modules/chronicle/VigilChronicle';
import { PhysicalCodexModal } from './modules/quests/PhysicalCodexModal';
import { QuestCompletionParticles } from './modules/quests/QuestCompletionParticles';
import { FallingSanctumParticles } from './modules/core/FallingSanctumParticles';
import { useKeyboardShortcuts } from './modules/quests/useKeyboardShortcuts';
import { User, Scroll, Compass } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { profile, activeLevelUp, dismissLevelUp, addQuest, toggleMute } = useGameState();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  
  // Mobile HUD active chamber tab
  const [mobileChamber, setMobileChamber] = useState<'hero' | 'codex' | 'vigil'>('codex');

  // Global hotkeys (N for new oath, S for armory, I for reliquary, C for codex, A for auth, M for mute, 1/2/3 for chambers, Esc to dismiss)
  useKeyboardShortcuts({
    onNewQuest: () => setIsQuestModalOpen(true),
    onOpenShop: () => setIsShopOpen(true),
    onOpenInventory: () => setIsInventoryOpen(true),
    onOpenCodex: () => setIsCodexOpen(true),
    onOpenAuth: () => setIsAuthOpen(true),
    onToggleMute: toggleMute,
    onSelectChamber: (chamber) => setMobileChamber(chamber),
    onEscape: () => {
      setIsShopOpen(false);
      setIsInventoryOpen(false);
      setIsAuthOpen(false);
      setIsQuestModalOpen(false);
      setIsCodexOpen(false);
      dismissLevelUp();
    },
  });

  return (
    <div className="min-h-screen bg-[#030508] flex flex-col text-[#dcd7cc] relative overflow-x-hidden selection:bg-amber-800/30 selection:text-amber-200">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC ENVIRONMENT LAYERS (The Ruined Cathedral Sanctum)          */}
      {/* ========================================================================= */}

      {/* Layer A: Ruined Cathedral Sanctum Background Image */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/sanctum-cathedral-bg.jpg")',
        }}
      />

      {/* Layer B: Dark Fantasy Vignette & Contrast Depth Layer (ensures high UI legibility) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(3, 5, 9, 0.45) 0%, rgba(3, 5, 8, 0.75) 65%, rgba(2, 3, 5, 0.94) 100%), linear-gradient(180deg, rgba(3, 5, 8, 0.6) 0%, transparent 20%, transparent 65%, rgba(2, 3, 5, 0.9) 100%)'
        }}
      />

      {/* Layer C: Ambient Drifting Lowland Fog / Mist */}
      <div className="fixed inset-x-0 bottom-0 h-80 pointer-events-none opacity-25 z-0 overflow-hidden">
        <div className="w-[200%] h-full bg-gradient-to-t from-[#020305] via-[#080d16]/30 to-transparent animate-fog" />
      </div>

      {/* Layer D: Falling Sanctum Particles (Downward drifting celestial dust, golden motes & embers) */}
      <FallingSanctumParticles />

      {/* ========================================================================= */}
      {/* 2. SANCTUM ARCHWAY NAVIGATION                                            */}
      {/* ========================================================================= */}
      <Navbar
        onOpenShop={() => setIsShopOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 3. MOBILE RPG HUD CHAMBER SWITCHER                                        */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex items-center justify-around border-b border-white/[0.08] bg-[#060910] text-[10px] font-serif tracking-[0.2em] py-2.5 px-4 sticky top-14 z-30">
        <button
          onClick={() => setMobileChamber('hero')}
          className={`flex items-center gap-1.5 uppercase transition cursor-pointer ${
            mobileChamber === 'hero' ? 'text-amber-300 font-bold' : 'text-slate-500'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>HERO</span>
        </button>
        <span className="text-slate-700">·</span>
        <button
          onClick={() => setMobileChamber('codex')}
          className={`flex items-center gap-1.5 uppercase transition cursor-pointer ${
            mobileChamber === 'codex' ? 'text-amber-300 font-bold' : 'text-slate-500'
          }`}
        >
          <Scroll className="w-3.5 h-3.5" />
          <span>CODEX</span>
        </button>
        <span className="text-slate-700">·</span>
        <button
          onClick={() => setMobileChamber('vigil')}
          className={`flex items-center gap-1.5 uppercase transition cursor-pointer ${
            mobileChamber === 'vigil' ? 'text-amber-300 font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>OMEN</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN SANCTUM COMMAND VIEWPORT: Asymmetric Cathedral Composition        */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Wing (4 cols lg): The Hero Sanctum (Primary Visual Anchor) */}
          <aside
            className={`lg:col-span-4 lg:pr-8 lg:border-r border-white/[0.07] ${
              mobileChamber !== 'hero' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="The Hero Sanctum"
          >
            <HeroCard profile={profile} />
          </aside>

          {/* Center Wing (5 cols lg): The Codex of Decrees (Quest Chronicle) */}
          <section
            className={`lg:col-span-5 px-0 lg:px-2 ${
              mobileChamber !== 'codex' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="Codex of Decrees"
          >
            <QuestBoard onOpenCodex={() => setIsCodexOpen(true)} />
          </section>

          {/* Right Wing (3 cols lg): The Astrologer's Divination & Consecrated Chronicle */}
          <aside
            className={`lg:col-span-3 lg:pl-8 lg:border-l border-white/[0.07] ${
              mobileChamber !== 'vigil' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="The Astrologer's Divination and Consecrated Chronicle"
          >
            <VigilChronicle />
          </aside>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. SANCTUM MODALS & RELIQUARY DRAWERS                                     */}
      {/* ========================================================================= */}
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      <InventoryDrawer isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <PhysicalCodexModal isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />
      <QuestModal
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        onSave={addQuest}
      />

      {/* GSAP Monumental Soul Ascension Celebration */}
      {activeLevelUp && (
        <LevelUpCelebration event={activeLevelUp} onDismiss={dismissLevelUp} />
      )}

      {/* Global Flying Reward Particle System */}
      <QuestCompletionParticles />

      {/* Antiquarian Cathedral Footer */}
      <footer className="py-6 border-t border-white/[0.07] text-center text-[9px] font-serif tracking-[0.3em] text-sanctum-ash uppercase relative z-10 bg-[#020305]/80">
        <p>THE LAST SANCTUM · LIFE RPG · SOVEREIGN DISCIPLINE IN THE ABYSS · MMXXVI</p>
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
