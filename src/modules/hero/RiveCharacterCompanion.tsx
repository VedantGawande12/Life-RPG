import React, { useState, useEffect } from 'react';
import { useGameState } from '../core/GameStateContext';

interface RiveCharacterCompanionProps {
  level: number;
}

export const RiveCharacterCompanion: React.FC<RiveCharacterCompanionProps> = ({ level }) => {
  const { profile } = useGameState();
  const [mood, setMood] = useState<'idle' | 'stirred' | 'triumphant'>('idle');
  const [whisper, setWhisper] = useState<string>('Discipline endures');

  // React to player triumphs
  useEffect(() => {
    setMood('triumphant');
    setWhisper('The embers burn bright.');
    const timer = setTimeout(() => {
      setMood('idle');
      setWhisper('Sanctum watchful.');
    }, 2800);

    return () => clearTimeout(timer);
  }, [profile.xp, profile.gold]);

  const handleCommune = () => {
    setMood('stirred');
    const whispers = [
      'The covenant holds.',
      'Steel your resolve.',
      'Every trial leaves a mark.',
      'Darkness yields to fortitude.',
    ];
    setWhisper(whispers[Math.floor(Math.random() * whispers.length)]);
    setTimeout(() => {
      setMood('idle');
      setWhisper('Sanctum watchful.');
    }, 2200);
  };

  return (
    <div
      onClick={handleCommune}
      className="relative flex flex-col items-center group cursor-pointer select-none"
      title="Commune with your Sanctum Familiar"
    >
      {/* Speech / Reaction Whispers */}
      <div
        className={`absolute -top-7 text-[9px] font-serif tracking-widest px-2.5 py-0.5 border transition-all duration-300 pointer-events-none whitespace-nowrap z-20 ${
          mood === 'triumphant'
            ? 'opacity-100 scale-100 bg-[#0c1018] text-amber-300 border-amber-500/50 shadow-lg'
            : mood === 'stirred'
            ? 'opacity-100 scale-100 bg-[#0c1018] text-slate-200 border-white/20 shadow-lg'
            : 'opacity-0 scale-95 bg-[#070a10] text-slate-400 border-white/10'
        }`}
      >
        <span className="italic">"{whisper}"</span>
      </div>

      {/* Gothic Stone Gargoyle / Raven Familiar Frame */}
      <div className="relative w-20 h-20 bg-[#070a10] border border-white/10 p-2 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/40">
        {/* Subtle stone texture lines */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />

        {/* Familiar SVG Glyph */}
        <div className={`relative z-10 transition-transform duration-300 ${mood === 'triumphant' ? 'scale-110' : ''}`}>
          <svg
            viewBox="0 0 80 80"
            className="w-12 h-12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stone Horns / Wings of the Gargoyle */}
            <path
              d="M18 36 C12 24 20 14 26 12 C24 22 28 28 32 30 Z"
              fill="#18202d"
              stroke="#2e3a50"
              strokeWidth="1"
            />
            <path
              d="M62 36 C68 24 60 14 54 12 C56 22 52 28 48 30 Z"
              fill="#18202d"
              stroke="#2e3a50"
              strokeWidth="1"
            />

            {/* Chiseled Head Crest */}
            <polygon
              points="40,16 47,28 40,32 33,28"
              fill="#222c3e"
              stroke="#3a4862"
              strokeWidth="1"
            />

            {/* Main Obsidian Face */}
            <path
              d="M26 30 L54 30 L48 56 L40 64 L32 56 Z"
              fill="#101520"
              stroke="#2a3549"
              strokeWidth="1.2"
            />

            {/* Glowing Piercing Eyes */}
            <circle
              cx="35"
              cy="40"
              r="2.5"
              fill={mood === 'triumphant' ? '#e2bc49' : mood === 'stirred' ? '#ffffff' : '#c59b27'}
              className="transition-colors duration-300"
            />
            <circle
              cx="45"
              cy="40"
              r="2.5"
              fill={mood === 'triumphant' ? '#e2bc49' : mood === 'stirred' ? '#ffffff' : '#c59b27'}
              className="transition-colors duration-300"
            />

            {/* Eye Glow Slits */}
            <line x1="32" y1="40" x2="38" y2="40" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
            <line x1="42" y1="40" x2="48" y2="40" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />

            {/* Runic Chin Sigil */}
            <path
              d="M40 48 L40 58 M36 53 L44 53"
              stroke="#8a6230"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Level Rune Pin */}
        <div className="absolute bottom-0 right-0 text-[8px] font-mono font-bold tracking-widest text-amber-400 bg-[#030508] px-1 border-t border-l border-white/10">
          L.{level}
        </div>
      </div>

      <div className="text-[9px] font-serif tracking-[0.2em] text-sanctum-ash uppercase mt-1 text-center group-hover:text-amber-300 transition-colors">
        <span>FAMILIAR</span>
      </div>
    </div>
  );
};
