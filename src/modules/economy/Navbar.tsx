import React, { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, Coins, Compass, Shield, Package, Key, BookOpen } from 'lucide-react';
import { useGameState } from '../core/GameStateContext';
import { LivingFlameStreak } from '../hero/LivingFlameStreak';

interface NavbarProps {
  onOpenShop: () => void;
  onOpenInventory: () => void;
  onOpenAuth: () => void;
  onOpenCodex?: () => void;
}

function getRomanDate(): string {
  const now = new Date();
  const day = now.getDate();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  function toRoman(num: number): string {
    const lookup: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [val, letter] of lookup) {
      while (num >= val) {
        result += letter;
        num -= val;
      }
    }
    return result;
  }

  return `${toRoman(day)} · ${month} · ${toRoman(year)}`;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShop, onOpenInventory, onOpenAuth, onOpenCodex }) => {
  const { profile, isMuted, toggleMute, isSupabaseActive, currentUser } = useGameState();
  const [showLexicon, setShowLexicon] = useState(false);
  const [isArmoryRuneLit, setIsArmoryRuneLit] = useState(false);

  const handleArmoryClick = () => {
    setIsArmoryRuneLit(true);
    setTimeout(() => setIsArmoryRuneLit(false), 900);
    onOpenShop();
  };

  return (
    <header className="w-full bg-[#030508]/95 border-b border-white/[0.08] relative z-40 select-none shadow-sanctum-ambient">
      <div className="w-full px-4 sm:px-8 h-14 flex items-center justify-between text-xs">
        {/* Left: Sanctuary Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-b from-amber-900/40 to-black border border-amber-500/40 flex items-center justify-center shadow-rune-gold">
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-serif tracking-[0.25em] text-slate-100 font-bold uppercase">
              THE LAST SANCTUM
            </h1>
            <div className="text-[8px] font-mono tracking-widest text-sanctum-ash uppercase hidden sm:block">
              ANNO DOMINI · MMXXVI · RUINED CATHEDRAL
            </div>
          </div>
        </div>

        {/* Center: Roman Date Header */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-sanctum-ash select-none">
          <span className="text-amber-500/60">✦</span>
          <span>{getRomanDate()}</span>
          <span className="text-amber-500/60">✦</span>
        </div>

        {/* Right Navigation & Economy Telemetry */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-serif tracking-wider">
          
          {/* Chamber 1: Codex */}
          {onOpenCodex && (
            <button
              onClick={onOpenCodex}
              className="text-slate-400 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer group"
              title="Ancient Magical Journal (Hotkey: C)"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              <span className="hidden sm:inline">CHRONICLE</span>
              <kbd className="text-[8px] font-mono text-slate-600 border-l border-white/10 pl-1 hidden lg:inline">C</kbd>
            </button>
          )}

          {/* Chamber 3: Armory */}
          <button
            onClick={handleArmoryClick}
            className={`flex items-center gap-1.5 transition-all duration-300 cursor-pointer group px-1.5 py-0.5 rounded ${
              isArmoryRuneLit
                ? 'text-amber-200 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-500/60 scale-105'
                : 'text-slate-400 hover:text-amber-200 border border-transparent'
            }`}
            title="The Merchant's Armory (Hotkey: S)"
          >
            <Shield
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                isArmoryRuneLit
                  ? 'text-amber-300 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse'
                  : 'text-slate-500 group-hover:text-amber-400'
              }`}
            />
            <span className="hidden sm:inline">ARMORY</span>
            <kbd className="text-[8px] font-mono text-slate-600 border-l border-white/10 pl-1 hidden lg:inline">S</kbd>
          </button>

          {/* Chamber 4: Reliquary / Vault */}
          <button
            onClick={onOpenInventory}
            className="text-slate-400 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer group"
            title="The Hero Reliquary (Hotkey: I)"
          >
            <Package className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
            <span className="hidden sm:inline">RELIQUARY</span>
            <kbd className="text-[8px] font-mono text-slate-600 border-l border-white/10 pl-1 hidden lg:inline">I</kbd>
          </button>

          {/* Chamber 5: Covenant */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentUser
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-slate-400 hover:text-amber-200'
            }`}
            title={
              currentUser
                ? `Covenant Active: ${currentUser.email || currentUser.username} (Hotkey: A)`
                : isSupabaseActive
                ? 'Commune with Realm (Sign In) (Hotkey: A)'
                : 'Demo Mode (Offline) (Hotkey: A)'
            }
          >
            <Key className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{currentUser ? 'COVENANT' : 'COMMUNE'}</span>
            <kbd className="text-[8px] font-mono text-slate-600 border-l border-white/10 pl-1 hidden lg:inline">A</kbd>
          </button>

          {/* Gold Ore Medallion & Bonfire Streak */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10 font-mono text-xs">
            <div id="navbar-gold-counter" className="flex items-center gap-1.5 text-amber-300 font-bold transition-transform duration-300" title="Gold Ore Balance">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile.gold}</span>
            </div>
            <LivingFlameStreak streak={profile.streak} compact={true} />
          </div>

          {/* Audio & Runic Lexicon Controls */}
          <div className="flex items-center gap-1.5 text-slate-500 pl-2">
            <button
              onClick={toggleMute}
              className="hover:text-amber-200 transition cursor-pointer p-1"
              title={isMuted ? "Unmute Ambient SFX" : "Mute SFX"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-600" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500/80" />}
            </button>
            <button
              onClick={() => setShowLexicon(!showLexicon)}
              className="hover:text-amber-200 transition cursor-pointer p-1 hidden sm:block"
              title="Sacred Lexicon & Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Runic Lexicon Dropdown */}
      {showLexicon && (
        <div className="absolute right-4 sm:right-8 top-14 w-64 bg-[#070a10] border border-white/15 p-4 shadow-2xl text-[11px] space-y-2 z-50">
          <div className="flex items-center justify-between font-serif font-bold text-amber-200 pb-1.5 border-b border-white/10 tracking-widest uppercase">
            <span>Runic Keybindings</span>
            <button onClick={() => setShowLexicon(false)} className="text-slate-500 hover:text-slate-300">✕</button>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-sans">Quest Chronicle Journal</span>
            <kbd className="px-1.5 py-0.5 bg-black border border-white/10 font-mono text-[9px] text-amber-400">C</kbd>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-sans">Inscribe Oath</span>
            <kbd className="px-1.5 py-0.5 bg-black border border-white/10 font-mono text-[9px] text-amber-400">N</kbd>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-sans">Merchant Armory</span>
            <kbd className="px-1.5 py-0.5 bg-black border border-white/10 font-mono text-[9px] text-amber-400">S</kbd>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-sans">Dismiss Sanctuary</span>
            <kbd className="px-1.5 py-0.5 bg-black border border-white/10 font-mono text-[9px] text-amber-400">Esc</kbd>
          </div>
        </div>
      )}
    </header>
  );
};
