import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { Sparkles, Shield, ArrowRight } from 'lucide-react';
import { LevelUpEvent } from '../../types';
import { playLevelUpSound } from '../economy/SoundEffects';
import { useGameState } from '../core/GameStateContext';

interface LevelUpCelebrationProps {
  event: LevelUpEvent;
  onDismiss: () => void;
}

function toRoman(num: number): string {
  const lookup: [number, string][] = [
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
  return result || 'I';
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ event, onDismiss }) => {
  const { isMuted } = useGameState();
  const containerRef = useRef<HTMLDivElement>(null);
  const steleRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const [displayLevel, setDisplayLevel] = useState(event.newLevel - 1);

  useEffect(() => {
    if (!isMuted) {
      playLevelUpSound();
    }

    // GSAP Cinematic Timeline
    const tl = gsap.timeline();

    // Stage 1: Screen Darkening
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    );

    // Stage 2: Runic Shockwave Blast
    tl.fromTo(
      shockwaveRef.current,
      { scale: 0.2, opacity: 0.9 },
      { scale: 3.8, opacity: 0, duration: 1.0, ease: 'expo.out' },
      '-=0.1'
    );

    // Stage 3: Stele 3D Monumental Entrance
    tl.fromTo(
      steleRef.current,
      { scale: 0.8, rotationX: 20, y: 40, opacity: 0 },
      { scale: 1, rotationX: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.7'
    );

    // Camera Screen Shake
    tl.to(steleRef.current, {
      x: 5,
      yoyo: true,
      repeat: 6,
      duration: 0.04,
      onComplete: () => gsap.set(steleRef.current, { x: 0 }),
    }, '-=0.3');

    // Dual Particle Confetti (Gold, Bronze, Ember, Arcane)
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#c59b27', '#e2bc49', '#8a6230', '#dcd7cc', '#8f2828'],
      zIndex: 99999,
    });

    // Rolling Level Number Counter Animation
    const counterObj = { val: Math.max(1, event.newLevel - 1) };
    tl.to(counterObj, {
      val: event.newLevel,
      duration: 0.8,
      ease: 'power1.inOut',
      onUpdate: () => setDisplayLevel(Math.round(counterObj.val)),
    }, '-=0.4');

    return () => {
      tl.kill();
    };
  }, [event.newLevel, isMuted]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
    >
      {/* Shockwave Ring */}
      <div
        ref={shockwaveRef}
        className="absolute w-72 h-72 rounded-full border-2 border-amber-400/80 pointer-events-none shadow-rune-gold"
      />

      {/* Main Monumental Stele */}
      <div
        ref={steleRef}
        className="relative w-full max-w-lg bg-[#070a10] border border-amber-500/40 p-6 sm:p-10 text-center shadow-2xl space-y-6"
      >
        {/* Intaglio Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-amber-500/60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-amber-500/60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-amber-500/60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-amber-500/60" />

        {/* Heraldic Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/40 border border-amber-500/40 text-amber-300 text-[9px] font-mono tracking-[0.3em] uppercase">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SOUL ASCENSION CONSUMMATED</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-[0.15em] text-slate-100 uppercase pt-2">
            SOUL LEVEL <span className="text-amber-400 font-mono">{toRoman(displayLevel)}</span>
          </h2>
          <p className="text-xs font-serif italic text-slate-400 max-w-sm mx-auto">
            "Your unwavering discipline has broken the boundary of the waning light. The sanctum honors your ascent."
          </p>
        </div>

        {/* Engraved Divider */}
        <div className="engraved-divider" />

        {/* Stat Elevation Grid */}
        <div className="grid grid-cols-2 gap-2 text-left text-[11px] font-serif">
          <div className="p-2.5 bg-[#030508] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-300 tracking-wider uppercase">VITALITY (STR)</span>
            <span className="font-mono text-red-400 font-bold">+2</span>
          </div>
          <div className="p-2.5 bg-[#030508] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-300 tracking-wider uppercase">FOCUS (INT)</span>
            <span className="font-mono text-sky-400 font-bold">+2</span>
          </div>
          <div className="p-2.5 bg-[#030508] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-300 tracking-wider uppercase">SPIRIT (CHA)</span>
            <span className="font-mono text-purple-400 font-bold">+2</span>
          </div>
          <div className="p-2.5 bg-[#030508] border border-white/[0.08] flex items-center justify-between">
            <span className="text-slate-300 tracking-wider uppercase">PROVIDENCE (CRE)</span>
            <span className="font-mono text-emerald-400 font-bold">+2</span>
          </div>
        </div>

        {/* Confirm Action Button */}
        <button
          onClick={onDismiss}
          className="w-full py-3.5 px-6 border border-amber-500/80 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 font-serif text-xs font-bold tracking-[0.25em] uppercase transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-lg hover:shadow-rune-gold"
        >
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Claim Ascension & Resume Vigil</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
