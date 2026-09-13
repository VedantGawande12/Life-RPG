import React, { useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Attributes } from '../../types';

interface TarotCard {
  roman: string;
  name: string;
  title: string;
  discipline: string;
  rune: string;
  omen: string;
  prophecy: string;
  accentColor: string;
  borderColor: string;
}

const TAROT_DECK: Record<string, TarotCard> = {
  strength: {
    roman: 'I',
    name: 'THE ECLIPSE SENTINEL',
    title: 'Arcanum of Fortitude',
    discipline: 'Vitality & Constitution',
    rune: 'ᚦ',
    omen: '+20% Essence on Physical Oaths',
    prophecy: 'When darkness encroaches, only an unyielding body can endure the weight of the abyss.',
    accentColor: 'text-red-300',
    borderColor: 'border-red-900/60 hover:border-red-500/60',
  },
  intellect: {
    roman: 'II',
    name: 'THE CELESTIAL EYE',
    title: 'Arcanum of Clarity',
    discipline: 'Focus & Deep Cognition',
    rune: 'ᚱ',
    omen: '+25% Gold Ore on Knowledge Trials',
    prophecy: 'The fog parts before the blade of razor-sharp reason. The mind commands reality.',
    accentColor: 'text-sky-300',
    borderColor: 'border-sky-900/60 hover:border-sky-500/60',
  },
  charisma: {
    roman: 'III',
    name: 'THE SOVEREIGN CROWN',
    title: 'Arcanum of Dominion',
    discipline: 'Spirit & Conviction',
    rune: 'ᚠ',
    omen: 'Streak Momentum Shield Active',
    prophecy: 'A resolute voice strikes terror into the void. Lead yourself before commanding others.',
    accentColor: 'text-purple-300',
    borderColor: 'border-purple-900/60 hover:border-purple-500/60',
  },
  creativity: {
    roman: 'IV',
    name: 'THE ALCHEMICAL COIL',
    title: 'Arcanum of Transmutation',
    discipline: 'Providence & Craft',
    rune: 'ᛝ',
    omen: 'Bonus Essence on Synthesis Rites',
    prophecy: 'Out of stagnant ash, the craftsman strikes sparks. Order is forged from wild chaos.',
    accentColor: 'text-emerald-300',
    borderColor: 'border-emerald-900/60 hover:border-emerald-500/60',
  },
};

interface AstrologerTarotCardProps {
  stats: Attributes;
}

export const AstrologerTarotCard: React.FC<AstrologerTarotCardProps> = ({ stats }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const dominantStatKey = (Object.keys(stats) as (keyof Attributes)[]).reduce((max, key) =>
    stats[key] > stats[max] ? key : max
  , 'intellect');

  const card = TAROT_DECK[dominantStatKey] || TAROT_DECK.intellect;

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between text-[9px] font-serif tracking-[0.25em] text-sanctum-ash uppercase font-semibold">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-amber-500/80" />
          <span>DAILY OMEN · ASTROLOGER'S TAROT</span>
        </span>
        <span className="font-mono text-[8px] text-amber-400 font-bold">ARCANA {card.roman}</span>
      </div>

      {/* Physical Obsidian Tarot Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full p-3.5 bg-[#06080d] border ${card.borderColor} transition-all duration-500 cursor-pointer shadow-sanctum-ambient group hover:shadow-rune-gold`}
        title="Click to flip and commune with the Daily Omen"
      >
        {/* Intaglio Corner Filigree */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-amber-500/40 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-amber-500/40 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-amber-500/40 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-amber-500/40 pointer-events-none" />

        {/* Occult Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none" />

        <div className="relative z-10 space-y-2.5">
          {/* Card Top Label */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
            <span className="font-serif text-[10px] tracking-[0.2em] text-amber-400 font-bold">
              TAROT {card.roman} · {card.name}
            </span>
            <span className="font-mono text-[8px] text-slate-400 tracking-widest uppercase">
              {card.discipline}
            </span>
          </div>

          {/* Center Rune & Title */}
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-full bg-[#030508] border border-amber-500/40 flex items-center justify-center text-lg font-serif text-amber-400 shadow-inner group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
              <span>{card.rune}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-serif tracking-wider text-slate-100 font-bold uppercase truncate">
                {card.title}
              </h4>
              <p className={`text-[10px] font-serif font-bold tracking-wide mt-0.5 ${card.accentColor}`}>
                ✦ {card.omen}
              </p>
            </div>
          </div>

          {/* Flipped Prophecy Inscription */}
          {isFlipped && (
            <div className="p-2 bg-[#030508]/90 border border-white/[0.06] text-[10px] text-slate-300 font-sans italic leading-relaxed animate-fade-in">
              "{card.prophecy}"
            </div>
          )}

          {/* Bottom Flip Action Hint */}
          <div className="flex items-center justify-between text-[8px] font-mono text-sanctum-ash tracking-widest uppercase pt-0.5">
            <span>{isFlipped ? 'COMMUNED WITH FATE' : 'CLICK TO REVEAL PROPHECY'}</span>
            <RefreshCw className={`w-2.5 h-2.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
