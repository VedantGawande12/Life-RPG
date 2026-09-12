import React, { useState } from 'react';
import { Swords, Flame, Coins, Package, ShoppingBag, Volume2, VolumeX, User, HelpCircle } from 'lucide-react';
import { useGameState } from '../core/GameStateContext';

interface NavbarProps {
  onOpenShop: () => void;
  onOpenInventory: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShop, onOpenInventory, onOpenAuth }) => {
  const { profile, isMuted, toggleMute, isSupabaseActive } = useGameState();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-glow-gold flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl tracking-tight text-slate-100 font-display flex items-center gap-1.5">
              <span>LIFE</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 font-black">
                RPG
              </span>
            </h1>
          </div>
        </div>

        {/* Global HUD Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Flame */}
          <div
            title="Consecutive daily activity streak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-400 font-mono font-bold text-xs shadow-inner"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span>{profile.streak}d</span>
          </div>

          {/* Gold Balance */}
          <div
            title="Available gold currency"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs"
          >
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{profile.gold}</span>
          </div>

          {/* Shop Trigger */}
          <button
            onClick={onOpenShop}
            title="Open Armory Shop (Hotkey: S)"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Shop</span>
          </button>

          {/* Inventory Trigger */}
          <button
            onClick={onOpenInventory}
            title="Open Hero Vault"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <Package className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Vault</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Keyboard Help */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            title="Keyboard Shortcuts"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition cursor-pointer hidden sm:block"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Auth Status / Button */}
          <button
            onClick={onOpenAuth}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 transition cursor-pointer flex items-center gap-1.5"
            title={isSupabaseActive ? 'Account connected' : 'Connect Supabase Account'}
          >
            <User className="w-4 h-4" />
            <span className="text-xs font-semibold hidden lg:inline">
              {isSupabaseActive ? 'Cloud Sync' : 'Demo Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Shortcuts Help Modal / Dropdown */}
      {showHelp && (
        <div className="absolute right-4 top-18 z-50 w-72 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-200 pb-1 border-b border-slate-800">
            <span>Keyboard Shortcuts</span>
            <button onClick={() => setShowHelp(false)} className="text-slate-500 hover:text-slate-300">✕</button>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Forge New Quest</span>
            <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">N</kbd>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Open Armory Shop</span>
            <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">S</kbd>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Close Any Dialog</span>
            <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">Esc</kbd>
          </div>
        </div>
      )}
    </header>
  );
};
