import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Coins,
  Sparkles,
  Shield,
  Dumbbell,
  BookOpen,
  Crown,
  Palette,
  Check,
  AlertCircle,
  Swords,
  Flame,
  Hammer,
} from 'lucide-react';
import { ShopItem } from '../../types';
import { useGameState } from '../core/GameStateContext';
import { playCoinSound, playHeavyGateOpenSound } from './SoundEffects';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  FlaskConical: Sparkles,
  Shield: Shield,
  Dumbbell: Dumbbell,
  BookOpen: BookOpen,
  Crown: Crown,
  Palette: Palette,
};

// Procedural floating forge embers
const FORGE_EMBERS = [
  { id: 1, left: '20%', bottom: '15%', size: 3, delay: 0.1, duration: 3.5, xShift: 20 },
  { id: 2, left: '35%', bottom: '22%', size: 4, delay: 0.4, duration: 4.2, xShift: -30 },
  { id: 3, left: '50%', bottom: '10%', size: 2.5, delay: 0.2, duration: 3.8, xShift: 15 },
  { id: 4, left: '68%', bottom: '18%', size: 3.5, delay: 0.6, duration: 4.5, xShift: -25 },
  { id: 5, left: '82%', bottom: '25%', size: 3, delay: 0.3, duration: 3.9, xShift: 35 },
];

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
  const { shopItems, profile, buyItem, isMuted } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // Animation Sequence:
  // 'closed'
  // -> 'doors-appearing' (screen dims, heavy stone/metal doors appear)
  // -> 'symbols-igniting' (engraved runes on stone doors flare with golden light)
  // -> 'doors-separating' (heavy stone gates grind open, warm interior light bursts out, equipment silhouettes visible, camera pushes forward)
  // -> 'chamber-entered' (armory interface settles into the revealed medieval weapons chamber)
  const [stage, setStage] = useState<
    'closed' | 'doors-appearing' | 'symbols-igniting' | 'doors-separating' | 'chamber-entered'
  >('closed');

  useEffect(() => {
    if (!isOpen) return;
    const categories = ['all', 'potion', 'equipment', 'title', 'theme'];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (categories[idx]) {
          setSelectedCategory(categories[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setStage('closed');
      return;
    }

    // Step 3 & 4: Screen dims slightly + two enormous stone doors appear
    setStage('doors-appearing');

    // Step 5: Engraved symbols illuminate
    const t1 = setTimeout(() => {
      setStage('symbols-igniting');
    }, 240);

    // Step 6, 7, 8, 9: Doors slowly separate + warm interior light + weapon silhouettes + camera moves forward
    const t2 = setTimeout(() => {
      setStage('doors-separating');
      if (!isMuted) {
        playHeavyGateOpenSound();
      }
    }, 550);

    // Step 10: Armory interface fades/slides into revealed chamber
    const t3 = setTimeout(() => {
      setStage('chamber-entered');
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, isMuted]);

  if (!isOpen) return null;

  const filteredItems = shopItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handlePurchase = (item: ShopItem) => {
    if (profile.gold < item.cost) {
      setFeedback({
        msg: `Insufficient Gold Ore. Slay more trials to accumulate ${item.cost - profile.gold} more Ore.`,
        isError: true,
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const success = buyItem(item);
    if (success) {
      if (!isMuted) playCoinSound();
      setFeedback({ msg: `Acquired ${item.name}. Placed in your Reliquary.`, isError: false });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 3. SCREEN / ENVIRONMENT DARKENING (Backdrop Fade)                         */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer z-10"
      >
        {/* Ambient Dark Stone Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 via-transparent to-black pointer-events-none" />
      </motion.div>

      {/* ========================================================================= */}
      {/* 9. CAMERA SUBTLE FORWARD PUSH (Container Motion)                          */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={
          stage === 'chamber-entered'
            ? { scale: 1, opacity: 1 }
            : { scale: 0.96, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 w-full max-w-5xl h-[88vh] min-h-[600px] max-h-[820px] flex items-center justify-center"
        style={{ perspective: '2000px' }}
      >
        {/* ======================================================================= */}
        {/* 4, 5 & 6. TWO ENORMOUS STONE/METAL DOORS WITH ILLUMINATED SYMBOLS      */}
        {/* ======================================================================= */}
        {(stage === 'doors-appearing' ||
          stage === 'symbols-igniting' ||
          stage === 'doors-separating') && (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Vaulted Outer Archway Frame */}
            <div className="absolute inset-0 border-[16px] sm:border-[24px] border-[#0c0f14] shadow-[0_30px_90px_rgba(0,0,0,0.95)] rounded-t-3xl overflow-hidden flex">
              {/* LEFT STONE/METAL DOOR */}
              <motion.div
                initial={{ rotateY: 0, x: '0%' }}
                animate={
                  stage === 'doors-separating'
                    ? { rotateY: -80, x: '-95%', opacity: 0.15 }
                    : { rotateY: 0, x: '0%', opacity: 1 }
                }
                transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                }}
                className="w-1/2 h-full bg-gradient-to-r from-[#0d1017] via-[#141923] to-[#0f131a] border-r border-black relative flex flex-col justify-between p-6 shadow-2xl"
              >
                {/* Heavy Iron Rivets & Reinforcing Straps */}
                <div className="absolute top-12 left-0 right-0 h-4 bg-[#0a0d12] border-y border-amber-950/40 flex items-center justify-around">
                  {[1, 2, 3, 4].map((r) => (
                    <div key={r} className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-black shadow-inner" />
                  ))}
                </div>
                <div className="absolute bottom-16 left-0 right-0 h-4 bg-[#0a0d12] border-y border-amber-950/40 flex items-center justify-around">
                  {[1, 2, 3, 4].map((r) => (
                    <div key={r} className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-black shadow-inner" />
                  ))}
                </div>

                {/* Left Door Engraved Rune Emblem */}
                <div className="my-auto flex flex-col items-center justify-center">
                  <div
                    className={`w-28 h-28 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      stage === 'symbols-igniting' || stage === 'doors-separating'
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_35px_rgba(245,158,11,0.85)] scale-105'
                        : 'border-white/15 bg-black/40'
                    }`}
                  >
                    <Hammer
                      className={`w-14 h-14 transition-all duration-500 ${
                        stage === 'symbols-igniting' || stage === 'doors-separating'
                          ? 'text-amber-300 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] animate-pulse'
                          : 'text-stone-600'
                      }`}
                    />
                  </div>
                  <div
                    className={`mt-4 font-serif text-[11px] tracking-[0.3em] uppercase font-bold transition-all duration-500 ${
                      stage === 'symbols-igniting' || stage === 'doors-separating'
                        ? 'text-amber-200 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]'
                        : 'text-stone-600'
                    }`}
                  >
                    ᚠ ARMAMENTUM
                  </div>
                </div>

                {/* Left Iron Door Pull Ring */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-12 rounded-full border-4 border-stone-600/80 bg-black/60 shadow-xl" />
              </motion.div>

              {/* RIGHT STONE/METAL DOOR */}
              <motion.div
                initial={{ rotateY: 0, x: '0%' }}
                animate={
                  stage === 'doors-separating'
                    ? { rotateY: 80, x: '95%', opacity: 0.15 }
                    : { rotateY: 0, x: '0%', opacity: 1 }
                }
                transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  transformOrigin: 'right center',
                  transformStyle: 'preserve-3d',
                }}
                className="w-1/2 h-full bg-gradient-to-l from-[#0d1017] via-[#141923] to-[#0f131a] border-l border-black relative flex flex-col justify-between p-6 shadow-2xl"
              >
                {/* Heavy Iron Rivets & Reinforcing Straps */}
                <div className="absolute top-12 left-0 right-0 h-4 bg-[#0a0d12] border-y border-amber-950/40 flex items-center justify-around">
                  {[1, 2, 3, 4].map((r) => (
                    <div key={r} className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-black shadow-inner" />
                  ))}
                </div>
                <div className="absolute bottom-16 left-0 right-0 h-4 bg-[#0a0d12] border-y border-amber-950/40 flex items-center justify-around">
                  {[1, 2, 3, 4].map((r) => (
                    <div key={r} className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-black shadow-inner" />
                  ))}
                </div>

                {/* Right Door Engraved Rune Emblem */}
                <div className="my-auto flex flex-col items-center justify-center">
                  <div
                    className={`w-28 h-28 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      stage === 'symbols-igniting' || stage === 'doors-separating'
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_35px_rgba(245,158,11,0.85)] scale-105'
                        : 'border-white/15 bg-black/40'
                    }`}
                  >
                    <Swords
                      className={`w-14 h-14 transition-all duration-500 ${
                        stage === 'symbols-igniting' || stage === 'doors-separating'
                          ? 'text-amber-300 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] animate-pulse'
                          : 'text-stone-600'
                      }`}
                    />
                  </div>
                  <div
                    className={`mt-4 font-serif text-[11px] tracking-[0.3em] uppercase font-bold transition-all duration-500 ${
                      stage === 'symbols-igniting' || stage === 'doors-separating'
                        ? 'text-amber-200 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]'
                        : 'text-stone-600'
                    }`}
                  >
                    BELLATORVM ᚦ
                  </div>
                </div>

                {/* Right Iron Door Pull Ring */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-12 rounded-full border-4 border-stone-600/80 bg-black/60 shadow-xl" />
              </motion.div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* 7 & 8. WARM INTERIOR LIGHT & SILHOUETTES OF EQUIPMENT INSIDE            */}
        {/* ======================================================================= */}
        <div className="absolute inset-0 rounded-t-3xl overflow-hidden pointer-events-none z-15 bg-[#090b10]">
          {/* Intense Warm Radial Forge Glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.22) 40%, rgba(10, 12, 18, 0.95) 85%)',
            }}
          />

          {/* Drifting Forge Embers Rising into Chamber */}
          {FORGE_EMBERS.map((ember) => (
            <motion.div
              key={ember.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: -160,
                x: ember.xShift,
              }}
              transition={{
                duration: ember.duration,
                repeat: Infinity,
                delay: ember.delay,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: ember.left,
                bottom: ember.bottom,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
              }}
              className="rounded-full bg-gradient-to-t from-orange-500 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
            />
          ))}

          {/* BACKLIT SILHOUETTES OF WEAPONS & EQUIPMENT (Backdrop Layer) */}
          <div className="absolute inset-0 flex items-center justify-between px-8 sm:px-16 opacity-30 pointer-events-none">
            {/* Left Weapon Rack Silhouette */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-1.5 h-64 bg-black border-x border-stone-800" />
              <div className="w-12 h-12 rounded-full border-2 border-black bg-black flex items-center justify-center">
                <Shield className="w-8 h-8 text-stone-900" />
              </div>
            </div>

            {/* Center Anvil & Crossed Greatsword Silhouettes */}
            <div className="flex flex-col items-center opacity-40">
              <Swords className="w-36 h-36 text-stone-900 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
              <div className="w-28 h-6 bg-black rounded-sm -mt-4" />
            </div>

            {/* Right Polearm & Axe Silhouette */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-1.5 h-64 bg-black border-x border-stone-800" />
              <div className="w-12 h-12 rounded-full border-2 border-black bg-black flex items-center justify-center">
                <Hammer className="w-8 h-8 text-stone-900" />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 10. REVEALED MEDIEVAL WEAPONS CHAMBER INTERFACE                         */}
        {/* Visually inherits the stone, iron, and warm forge chamber environment   */}
        {/* ======================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={
            stage === 'chamber-entered'
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 24 }
          }
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-30 w-full h-full border-2 border-amber-500/40 rounded-t-2xl sm:rounded-2xl bg-[#090c12]/95 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-slate-200"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 15%, rgba(245,158,11,0.14) 0%, transparent 60%), linear-gradient(180deg, rgba(12,15,22,0.98) 0%, rgba(6,8,12,0.98) 100%)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="armory-chamber-title"
        >
          {/* Gothic Bronze Corner Brackets */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-500/70 pointer-events-none z-40" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-500/70 pointer-events-none z-40" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-500/70 pointer-events-none z-40" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-500/70 pointer-events-none z-40" />

          {/* Chamber Header: Archway Lintel with Glowing Furnace Branding */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-amber-500/20 bg-[#06080d]/90 relative z-30">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-md border border-amber-500/50 bg-[#120f0a] flex items-center justify-center text-amber-400 shadow-rune-gold">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[9px] font-mono tracking-[0.35em] text-amber-500 uppercase font-semibold flex items-center gap-2">
                  <span>CHAMBER OF ARMAMENTS</span>
                  <span className="text-amber-500/40">·</span>
                  <span className="text-amber-300">FORGE OF MMXXVI</span>
                </div>
                <h2
                  id="armory-chamber-title"
                  className="text-base sm:text-2xl font-serif tracking-widest text-[#f5ebd7] font-bold uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  The Adventurer's Armory
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              {/* Gold Ore Balance Medallion */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#030508] border border-amber-500/40 text-amber-300 font-mono text-xs sm:text-sm font-bold shadow-inner">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>{profile.gold} ORE</span>
              </div>

              {/* Close Chamber Portal */}
              <button
                onClick={onClose}
                aria-label="Exit Armory Chamber"
                className="p-1.5 text-slate-400 hover:text-amber-200 border border-transparent hover:border-amber-500/30 transition cursor-pointer bg-black/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Inscription Feedback Alert */}
          {feedback && (
            <div
              className={`mx-6 mt-3 p-3 border text-[11px] flex items-center gap-2 font-serif tracking-wider uppercase shadow-md ${
                feedback.isError
                  ? 'bg-red-950/60 border-red-500/50 text-red-200'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              }`}
            >
              {feedback.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              <span>{feedback.msg}</span>
            </div>
          )}

          {/* Chamber Armament Category Pedestals */}
          <div className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 overflow-x-auto text-[10px] font-serif tracking-[0.2em] border-b border-white/[0.07] bg-[#070a10]/80">
            {['all', 'potion', 'equipment', 'title', 'theme'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 uppercase transition cursor-pointer border ${
                  selectedCategory === cat
                    ? 'border-amber-500 text-amber-200 font-bold bg-amber-950/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                {cat === 'all' ? 'All War Relics' : cat}
              </button>
            ))}
          </div>

          {/* Chamber Catalog Grid / Weapon Racks */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-3 bg-[#05070c]/70">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-5xl mx-auto">
              {filteredItems.map((item) => {
                const Icon = ICON_MAP[item.icon] || Sparkles;
                const canAfford = profile.gold >= item.cost;

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-[#0a0e16]/90 border border-white/[0.08] hover:border-amber-500/50 transition-all duration-300 flex items-center justify-between gap-4 group rounded-sm shadow-md"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 bg-[#04060a] border border-amber-500/30 group-hover:border-amber-400 flex items-center justify-center text-amber-400 flex-shrink-0 transition-colors shadow-inner">
                        <Icon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-serif tracking-wider text-[#f5ebd7] uppercase font-bold group-hover:text-amber-200 transition-colors truncate">
                            {item.name}
                          </h4>
                          <span className="text-[8px] font-mono tracking-widest px-1.5 py-0.2 border border-amber-500/20 text-amber-500/90 uppercase">
                            {item.rarity}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-sans leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="font-mono text-xs sm:text-sm text-amber-300 font-bold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.cost}</span>
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`px-3 sm:px-4 py-1.5 text-[9px] font-serif tracking-[0.2em] uppercase transition cursor-pointer border ${
                          canAfford
                            ? 'border-amber-500 text-amber-200 bg-amber-950/50 hover:bg-amber-900/80 shadow-md active:scale-95'
                            : 'border-white/10 text-slate-600 cursor-not-allowed bg-black/40'
                        }`}
                      >
                        Claim Relic
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chamber Footer Archway Bar */}
          <div className="px-6 sm:px-8 py-2.5 border-t border-white/[0.08] bg-[#05070c] flex items-center justify-between text-[9px] font-serif tracking-[0.25em] text-sanctum-ash uppercase relative z-30">
            <span className="truncate pr-2">☽ Master of the Forge · Forged in dark steel and eternal embers ☾</span>
            <button
              onClick={onClose}
              className="text-amber-400 hover:text-amber-200 uppercase transition cursor-pointer font-bold whitespace-nowrap"
            >
              Exit Chamber [ESC]
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
