import React from 'react';
import { Sparkles } from 'lucide-react';
import { CharacterProfile } from '../../types';
import { AttributeConstellation } from './AttributeConstellation';
import { AstrologerTarotCard } from './AstrologerTarotCard';
import { LivingFlameStreak } from './LivingFlameStreak';
import { getXpRequiredForLevel, calculateLevelProgress } from '../core/rpgEngine';

interface HeroCardProps {
  profile: CharacterProfile;
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

export const HeroCard: React.FC<HeroCardProps> = ({ profile }) => {
  const [reactionActive, setReactionActive] = React.useState(false);
  const [reactionAttribute, setReactionAttribute] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleReaction = (e: Event) => {
      const customEvent = e as CustomEvent<{ attribute?: string }>;
      setReactionAttribute(customEvent.detail?.attribute || 'Soul');
      setReactionActive(true);
      const timer = setTimeout(() => {
        setReactionActive(false);
        setReactionAttribute(null);
      }, 1600);
      return () => clearTimeout(timer);
    };

    window.addEventListener('hero-soul-reaction', handleReaction);
    return () => window.removeEventListener('hero-soul-reaction', handleReaction);
  }, []);

  const neededXp = getXpRequiredForLevel(profile.level);
  const progressPercent = calculateLevelProgress(profile.xp, profile.level);

  // Determine dominant stat
  const dominantStatKey = (Object.keys(profile.stats) as (keyof typeof profile.stats)[]).reduce((max, key) =>
    profile.stats[key] > profile.stats[max] ? key : max
  , 'intellect');

  const dominantAuraColor: Record<string, string> = {
    strength: 'from-red-950/40 via-transparent to-transparent',
    intellect: 'from-sky-950/40 via-transparent to-transparent',
    charisma: 'from-purple-950/40 via-transparent to-transparent',
    creativity: 'from-emerald-950/40 via-transparent to-transparent',
  };

  return (
    <div className="w-full flex flex-col space-y-5 select-none">
      {/* 1. CINEMATIC HERO PORTRAIT - The Dominant Anchor */}
      <div
        id="hero-portrait"
        className={`relative w-full aspect-[4/5] max-h-[400px] overflow-hidden bg-[#05070a] border shadow-sanctum-ambient group transition-all duration-500 ${
          reactionActive
            ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] scale-[1.015]'
            : 'border-white/[0.09]'
        }`}
      >
        {/* Dominant Attribute Atmospheric Backlight Aura */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${dominantAuraColor[dominantStatKey] || 'from-amber-950/30'} pointer-events-none z-10`}
        />

        {/* Reaction Soul Surge Flash */}
        {reactionActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/35 via-yellow-400/20 to-transparent pointer-events-none z-25 animate-pulse" />
        )}

        {/* Chiaroscuro Knight Portrait */}
        <img
          src="/knight-portrait.jpg"
          alt={profile.username}
          className={`w-full h-full object-cover object-top opacity-95 transition-all duration-700 filter contrast-125 brightness-90 ${
            reactionActive ? 'scale-105 brightness-110' : 'group-hover:scale-[1.03]'
          }`}
        />

        {/* Cathedral Deep Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-transparent to-black/40 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none z-10" />

        {/* Intaglio Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/40 z-20" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-500/40 z-20" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/40 z-20" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-500/40 z-20" />

        {/* Floating Reaction Banner (Character Reacts!) */}
        {reactionActive && (
          <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/90 border border-amber-400 text-[9px] font-mono tracking-widest text-amber-200 uppercase shadow-rune-gold animate-bounce">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{reactionAttribute?.toUpperCase()} CONSECRATED</span>
          </div>
        )}

        {/* Living Flame Streak Shrine on Portrait */}
        <div className="absolute top-2.5 right-2.5 z-30">
          <LivingFlameStreak streak={profile.streak} />
        </div>

        {/* Hero Identity Plaque Anchored at Base of Portrait */}
        <div className="absolute bottom-3 left-0 right-0 z-20 px-4 text-center space-y-1">
          <div className="text-[9px] font-mono tracking-[0.3em] text-amber-400/90 uppercase font-semibold">
            SOUL LEVEL {toRoman(profile.level)} · {dominantStatKey.toUpperCase()} ASCENDANT
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.14em] text-slate-100 font-bold uppercase drop-shadow-md">
            {profile.username}
          </h2>
          <p className="text-[11px] italic text-slate-400 font-serif">
            "{profile.title || 'Seeker of the Waning Light'}"
          </p>
        </div>
      </div>

      {/* 2. SOUL ESSENCE (XP) HAIRLINE GAUGE */}
      <div id="hero-xp-meter" className="space-y-1.5 px-0.5 transition-all duration-500">
        <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-sanctum-ash uppercase">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500/70" />
            <span>SOUL ESSENCE</span>
          </span>
          <span className="text-slate-300">
            {profile.xp} / {neededXp} XP ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-[2px] bg-white/[0.08] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-300 transition-all duration-700 shadow-soul-glow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Engraved Divider */}
      <div className="engraved-divider my-1" />

      {/* 3. RPG-NATIVE ATTRIBUTE CONSTELLATION */}
      <AttributeConstellation stats={profile.stats} />

      {/* Engraved Divider */}
      <div className="engraved-divider my-1" />

      {/* 4. THE ASTROLOGER'S TAROT & DAILY OMEN (Replaces Vigil) */}
      <AstrologerTarotCard stats={profile.stats} />

    </div>
  );
};
