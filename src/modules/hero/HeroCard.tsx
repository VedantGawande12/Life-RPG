import React from 'react';
import { CharacterProfile } from '../../types';
import { HeroAvatar } from './HeroAvatar';
import { LevelProgress } from './LevelProgress';
import { AttributeBar } from './AttributeBar';
import { ShieldCheck, Flame, Coins } from 'lucide-react';

interface HeroCardProps {
  profile: CharacterProfile;
}

export const HeroCard: React.FC<HeroCardProps> = ({ profile }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 md:p-6 shadow-2xl">
      {/* Subtle background decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <HeroAvatar level={profile.level} badge={profile.equipped_badge} />

        {/* Character Info & XP */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-display">
                  {profile.username}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  {profile.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Class: <span className="text-slate-300 font-medium">Full-Stack Achiever</span> &bull; Aura: <span className="text-purple-400 font-medium capitalize">{profile.equipped_theme.replace('_', ' ')}</span>
              </p>
            </div>

            {/* Quick Currency & Streak Badges */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-sm">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{profile.gold}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono font-bold text-sm">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>{profile.streak}d</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <LevelProgress level={profile.level} xp={profile.xp} />

          {/* Core Attribute Meters */}
          <AttributeBar stats={profile.stats} />
        </div>
      </div>
    </div>
  );
};
