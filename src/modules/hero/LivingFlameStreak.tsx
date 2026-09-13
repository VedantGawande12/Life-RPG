import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, X, ChevronRight, Award } from 'lucide-react';
import { calculateStreakMultiplier } from '../core/rpgEngine';
import { playFlintIgnitionSound, playCeremonialFlameSound } from '../economy/SoundEffects';
import confetti from 'canvas-confetti';

interface LivingFlameStreakProps {
  streak: number;
  compact?: boolean;
  onMilestoneAchieved?: (milestone: number) => void;
}

export interface FlameTier {
  tier: number;
  name: string;
  minStreak: number;
  maxStreak: number;
  rune: string;
  runeLabel: string;
  flameColor: string;
  scale: number;
  description: string;
}

export const FLAME_TIERS: FlameTier[] = [
  {
    tier: 1,
    name: 'Kindled Ember',
    minStreak: 1,
    maxStreak: 6,
    rune: 'ᚢ',
    runeLabel: 'Rune of Vitality',
    flameColor: 'from-amber-600 via-orange-500 to-yellow-400',
    scale: 1.0,
    description: 'A fragile initial spark kept alive through discipline.',
  },
  {
    tier: 2,
    name: 'Small Ignition',
    minStreak: 7,
    maxStreak: 13,
    rune: 'ᛊ',
    runeLabel: 'Rune of the Sol Hearth',
    flameColor: 'from-amber-500 via-orange-400 to-yellow-300',
    scale: 1.18,
    description: '7-Day Milestone: The hearth ignites with fervent momentum.',
  },
  {
    tier: 3,
    name: 'Ascendant Pyre',
    minStreak: 14,
    maxStreak: 29,
    rune: 'ᚱ',
    runeLabel: 'Rune of the Blazing Path',
    flameColor: 'from-orange-600 via-amber-400 to-yellow-200',
    scale: 1.38,
    description: '14-Day Milestone: A robust sanctum torch casting warm light across the dark.',
  },
  {
    tier: 4,
    name: 'Ceremonial Bonfire',
    minStreak: 30,
    maxStreak: 99,
    rune: 'ᛝ',
    runeLabel: 'Rune of Cathedral Flame',
    flameColor: 'from-red-600 via-amber-400 to-amber-100',
    scale: 1.62,
    description: '30-Day Milestone: A monumental cathedral pyre of unshakeable will.',
  },
  {
    tier: 5,
    name: 'Rare Legendary Flame',
    minStreak: 100,
    maxStreak: Infinity,
    rune: '⬡',
    runeLabel: 'Rune of Eternity',
    flameColor: 'from-amber-400 via-yellow-200 to-white',
    scale: 1.9,
    description: '100-Day Milestone: An eternal celestial inferno of mythic mastery.',
  },
];

export function getFlameTier(streak: number): FlameTier {
  if (streak >= 100) return FLAME_TIERS[4];
  if (streak >= 30) return FLAME_TIERS[3];
  if (streak >= 14) return FLAME_TIERS[2];
  if (streak >= 7) return FLAME_TIERS[1];
  return FLAME_TIERS[0];
}

export function getNextMilestone(streak: number): { target: number; daysLeft: number; tier: FlameTier } {
  if (streak < 7) return { target: 7, daysLeft: 7 - streak, tier: FLAME_TIERS[1] };
  if (streak < 14) return { target: 14, daysLeft: 14 - streak, tier: FLAME_TIERS[2] };
  if (streak < 30) return { target: 30, daysLeft: 30 - streak, tier: FLAME_TIERS[3] };
  if (streak < 100) return { target: 100, daysLeft: 100 - streak, tier: FLAME_TIERS[4] };
  return { target: 100, daysLeft: 0, tier: FLAME_TIERS[4] };
}

export const LivingFlameStreak: React.FC<LivingFlameStreakProps> = ({ streak, compact = false }) => {
  const [showVigilModal, setShowVigilModal] = useState(false);
  const [activeMilestoneIgnition, setActiveMilestoneIgnition] = useState<number | null>(null);

  const currentTier = getFlameTier(streak);
  const nextMilestone = getNextMilestone(streak);
  const multiplier = calculateStreakMultiplier(streak);

  // Progressive daily flame strength and rune illumination
  const dayProgress = Math.min(1, streak / 100);
  const runeOpacity = Math.min(1, 0.4 + dayProgress * 0.6);

  const triggerMilestonePreview = (targetDays: number) => {
    setActiveMilestoneIgnition(targetDays);

    if (targetDays >= 30) {
      playCeremonialFlameSound();
    } else {
      playFlintIgnitionSound();
    }

    // Launch celebratory burst only during milestone event
    confetti({
      particleCount: targetDays >= 100 ? 80 : targetDays >= 30 ? 55 : 35,
      spread: targetDays >= 100 ? 80 : 60,
      origin: { x: 0.5, y: 0.55 },
      colors: ['#f59e0b', '#f97316', '#fbbf24', '#ffffff'],
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      setActiveMilestoneIgnition(null);
    }, 2400);
  };

  // Compact representation (e.g. For Navbar)
  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowVigilModal(true)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-orange-500/30 hover:border-orange-400/60 bg-[#0c0906] transition-all cursor-pointer group select-none shadow-sm"
          title="Bonfire of Vigil (Click to commune with the Flame)"
        >
          {/* Living Flame Icon with dynamic scale and subtle glow */}
          <div className="relative flex items-center justify-center">
            <Flame
              className={`w-3.5 h-3.5 transition-transform duration-500 ${
                streak >= 30 ? 'text-amber-300' : 'text-orange-500'
              } animate-flame`}
              style={{
                transform: `scale(${0.9 + Math.min(0.5, streak * 0.01)})`,
                filter: `drop-shadow(0 0 ${4 + Math.min(6, streak * 0.1)}px rgba(249, 115, 22, ${0.5 + Math.min(0.5, streak * 0.02)}))`,
              }}
            />
            {/* Subtle Ember Mote */}
            <div className="absolute -top-1 w-1 h-1 rounded-full bg-amber-300 animate-ping opacity-60 pointer-events-none" />
          </div>

          <span className="font-mono text-xs text-orange-400 font-bold group-hover:text-amber-300 transition-colors">
            {streak}d
          </span>

          {/* Underneath Rune Inscription */}
          <span
            className="font-serif text-[10px] text-amber-500 font-bold pl-0.5"
            style={{ opacity: runeOpacity }}
          >
            {currentTier.rune}
          </span>
        </button>

        {/* Bonfire Vigil Modal */}
        <VigilModal
          isOpen={showVigilModal}
          onClose={() => setShowVigilModal(false)}
          streak={streak}
          currentTier={currentTier}
          nextMilestone={nextMilestone}
          multiplier={multiplier}
          onTriggerMilestone={triggerMilestonePreview}
          activeMilestoneIgnition={activeMilestoneIgnition}
        />
      </>
    );
  }

  // Full Hero Card Shrine Representation
  return (
    <>
      <div
        onClick={() => setShowVigilModal(true)}
        className="relative flex items-center gap-2.5 px-3 py-1.5 bg-[#060403]/85 border border-amber-500/40 rounded-sm cursor-pointer hover:border-amber-400 transition-all shadow-md group select-none"
        title="Living Bonfire of Perpetual Vigil (Click to inspect streak fire)"
      >
        {/* Living Flame Center */}
        <div className="relative w-7 h-7 flex items-center justify-center flex-shrink-0">
          {/* Faint Radial Warm Light Aura */}
          <div
            className="absolute inset-0 rounded-full blur-[4px] pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(249, 115, 22, ${0.25 + dayProgress * 0.35}) 0%, transparent 70%)`,
            }}
          />

          {/* Living Flame SVG Tongue */}
          <motion.div
            animate={{
              scale: [currentTier.scale * 0.95, currentTier.scale * 1.05, currentTier.scale * 0.98],
              rotate: [-1, 2, -1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10"
          >
            <Flame
              className={`w-5 h-5 transition-colors duration-500 ${
                streak >= 100
                  ? 'text-yellow-200 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                  : streak >= 30
                  ? 'text-amber-300 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                  : 'text-orange-500 filter drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]'
              }`}
            />
          </motion.div>

          {/* 1-2 Subtle Rising Embers (No screen clutter) */}
          <div className="absolute -top-1 w-1 h-1 rounded-full bg-amber-300/80 animate-dust pointer-events-none" />
          {streak >= 14 && (
            <div
              className="absolute -top-2 right-1 w-1 h-1 rounded-full bg-orange-400/70 animate-dust pointer-events-none"
              style={{ animationDelay: '1.8s' }}
            />
          )}
        </div>

        {/* Streak Counter & Illuminated Underneath Rune */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-[#f5ebd7] font-bold tracking-wider">
              {streak}D VIGIL
            </span>
            <span className="text-[8px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
              · TIER {currentTier.tier}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Rune Underneath: More illuminated with each consecutive day */}
            <span
              className="font-serif text-[11px] font-bold text-amber-400 transition-opacity duration-700 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]"
              style={{ opacity: runeOpacity }}
            >
              {currentTier.rune}
            </span>
            <span className="text-[9px] font-sans text-stone-400 truncate">
              {currentTier.name}
            </span>
          </div>
        </div>

        {/* Small chevron */}
        <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 transition-colors ml-auto" />
      </div>

      {/* Bonfire Vigil Modal */}
      <VigilModal
        isOpen={showVigilModal}
        onClose={() => setShowVigilModal(false)}
        streak={streak}
        currentTier={currentTier}
        nextMilestone={nextMilestone}
        multiplier={multiplier}
        onTriggerMilestone={triggerMilestonePreview}
        activeMilestoneIgnition={activeMilestoneIgnition}
      />
    </>
  );
};

// =========================================================================
// BONFIRE OF PERPETUAL VIGIL MODAL / INSPECTION DIALOG
// =========================================================================
interface VigilModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  currentTier: FlameTier;
  nextMilestone: { target: number; daysLeft: number; tier: FlameTier };
  multiplier: number;
  onTriggerMilestone: (days: number) => void;
  activeMilestoneIgnition: number | null;
}

const VigilModal: React.FC<VigilModalProps> = ({
  isOpen,
  onClose,
  streak,
  currentTier,
  nextMilestone,
  multiplier,
  onTriggerMilestone,
  activeMilestoneIgnition,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === '1') {
        onTriggerMilestone(7);
      } else if (e.key === '2') {
        onTriggerMilestone(14);
      } else if (e.key === '3') {
        onTriggerMilestone(30);
      } else if (e.key === '4') {
        onTriggerMilestone(100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTriggerMilestone]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-orange-950/20 via-transparent to-black pointer-events-none" />

      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-lg bg-[#0e0a07] border-2 border-amber-900/70 p-6 sm:p-8 rounded shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-slate-200 overflow-hidden"
      >
        {/* Bronze Corner Brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-500/80 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-amber-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-orange-500/50 bg-[#160d07] flex items-center justify-center text-orange-400 shadow-rune-gold">
              <Flame className="w-4 h-4 text-orange-400 animate-flame" />
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-[0.35em] text-amber-500 uppercase font-semibold">
                BONFIRE OF PERPETUAL VIGIL
              </div>
              <h2 className="text-lg sm:text-xl font-serif tracking-[0.14em] text-[#f4eedb] font-bold uppercase">
                The Living Flame
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Vigil modal"
            className="p-1.5 text-stone-400 hover:text-stone-100 border border-transparent hover:border-amber-500/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Shrine Hearth Display */}
        <div className="my-6 p-6 bg-[#060403] border border-amber-950/70 rounded flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Radial Warm Forge Radiance */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 60%, rgba(249, 115, 22, 0.25) 0%, rgba(217, 119, 6, 0.1) 45%, transparent 75%)',
            }}
          />

          {/* Living Flame Centerpiece */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <motion.div
              animate={{
                scale: [currentTier.scale * 1.2, currentTier.scale * 1.35, currentTier.scale * 1.25],
                rotate: [-2, 3, -2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Flame
                className={`w-14 h-14 ${
                  streak >= 100
                    ? 'text-yellow-200 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]'
                    : streak >= 30
                    ? 'text-amber-300 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.85)]'
                    : 'text-orange-500 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.7)]'
                }`}
              />
            </motion.div>

            {/* Illuminated Stone Hearth Rune Underneath */}
            <div className="absolute -bottom-1 w-14 h-6 border-t-2 border-amber-500/40 flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                {currentTier.rune}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-serif tracking-[0.16em] text-[#f5ebd7] uppercase font-bold mt-2">
            {currentTier.name}
          </h3>
          <p className="text-[11px] font-sans text-stone-400 max-w-xs mt-1">
            {currentTier.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-mono">
            <span className="px-3 py-1 bg-[#140e09] border border-amber-600/40 text-amber-300 font-bold">
              {streak} CONSECUTIVE DAYS
            </span>
            <span className="px-3 py-1 bg-[#140e09] border border-amber-600/40 text-yellow-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {multiplier.toFixed(2)}x REWARD MULTIPLIER
            </span>
          </div>

          {/* Next Milestone Ignition Progress */}
          {nextMilestone && nextMilestone.daysLeft > 0 && (
            <div className="mt-3.5 w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-amber-400/80">
                <span>NEXT IGNITION: {nextMilestone.tier.name.toUpperCase()}</span>
                <span>{nextMilestone.daysLeft} DAYS LEFT</span>
              </div>
              <div className="h-1.5 w-full bg-stone-950 border border-amber-900/60 rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-300 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(8, (streak / nextMilestone.target) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Milestone Thresholds Ledger */}
        <div className="space-y-2">
          <div className="text-[9px] font-serif tracking-[0.25em] text-amber-500 uppercase font-semibold mb-2">
            CONSECRATED VIGIL MILESTONES
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { days: 7, label: 'Small Ignition', icon: '7D', rune: 'ᛊ' },
              { days: 14, label: 'Larger Flame', icon: '14D', rune: 'ᚱ' },
              { days: 30, label: 'Ceremonial Pyre', icon: '30D', rune: 'ᛝ' },
              { days: 100, label: 'Legendary Flame', icon: '100D', rune: '⬡' },
            ].map((m) => {
              const isUnlocked = streak >= m.days;
              const isCurrent = currentTier.minStreak === m.days;

              return (
                <button
                  key={m.days}
                  onClick={() => onTriggerMilestone(m.days)}
                  className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-950/60 shadow-rune-gold'
                      : isUnlocked
                      ? 'border-amber-700/50 bg-[#120d09] hover:border-amber-500'
                      : 'border-stone-800/60 bg-[#080604] opacity-50 hover:opacity-80'
                  }`}
                  title={`Click to preview the ${m.days}-Day ignition ceremony`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300">{m.icon}</span>
                    <span className="font-serif text-sm font-bold text-amber-400">{m.rune}</span>
                  </div>
                  <div className="mt-2 text-[9px] font-serif uppercase tracking-wider text-stone-300 truncate">
                    {m.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Milestone Celebration Overlay */}
        <AnimatePresence>
          {activeMilestoneIgnition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 bg-[#0c0805]/95 z-50 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-[#1f1207] flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.9)] mb-4">
                <Flame className="w-10 h-10 text-amber-300 animate-flame" />
              </div>

              <div className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase font-semibold">
                MILESTONE IGNITION RITUAL
              </div>
              <h3 className="text-xl sm:text-2xl font-serif tracking-widest text-[#f5ebd7] font-bold uppercase mt-1">
                {activeMilestoneIgnition >= 100
                  ? 'Rare Legendary Flame Consecrated'
                  : activeMilestoneIgnition >= 30
                  ? 'Major Ceremonial Bonfire Stoked'
                  : activeMilestoneIgnition >= 14
                  ? 'Ascendant Pyre Unleashed'
                  : 'Small Ignition Achieved'}
              </h3>
              <p className="text-xs font-sans text-amber-200/70 max-w-sm mt-2 italic">
                "The flame feeds upon sacred persistence. What is forged in shadows endures in eternal fire."
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-amber-300 bg-black/60 px-4 py-1.5 border border-amber-500/40">
                <Award className="w-4 h-4 text-amber-400" />
                <span>BONFIRE VIGIL REWARD MULTIPLIER ENHANCED</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-amber-900/50 flex items-center justify-between text-[9px] font-serif tracking-[0.2em] text-stone-500 uppercase">
          <span>☽ Discipline is the fuel of immortality ☾</span>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-200 uppercase font-bold transition cursor-pointer"
          >
            Close Hearth [ESC]
          </button>
        </div>
      </motion.div>
    </div>
  );
};
