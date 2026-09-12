import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, Star } from 'lucide-react';
import { LevelUpEvent } from '../../types';

interface LevelUpCelebrationProps {
  event: LevelUpEvent;
  onDismiss: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ event, onDismiss }) => {
  useEffect(() => {
    // Fire celebratory confetti burst from both screen edges
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f59e0b', '#fbbf24', '#ffffff'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#a855f7', '#3b82f6', '#10b981'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#f59e0b', '#ef4444'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20">
        {/* Glow halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Icon & Ribbon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-glow-gold mb-4">
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ascension Achieved!</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-display tracking-tight">
          LEVEL <span className="text-amber-400">{event.newLevel}</span>
        </h2>

        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          Your real-world discipline has materialized into transcendent power. All core attributes fortified!
        </p>

        {/* Stat perks highlight */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 grid grid-cols-2 gap-2 text-left text-xs font-medium">
          <div className="flex items-center gap-2 text-red-300">
            <Star className="w-3.5 h-3.5 text-red-400" />
            <span>Strength Fortified</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300">
            <Star className="w-3.5 h-3.5 text-blue-400" />
            <span>Intellect Expanded</span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <Star className="w-3.5 h-3.5 text-purple-400" />
            <span>Charisma Magnified</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300">
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            <span>Creativity Unlocked</span>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={onDismiss}
          className="mt-6 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Claim Ascension & Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
