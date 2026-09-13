import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface HeroAvatarProps {
  level: number;
  badge?: string;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({ level }) => {
  return (
    <div className="relative group">
      {/* Dark Fantasy Aura Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-red-900 to-amber-700 rounded-2xl blur-md opacity-50 group-hover:opacity-90 transition duration-500"></div>

      {/* Avatar Obsidian Container */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#0e1320] to-[#06080e] border-2 border-amber-600/50 p-2 flex flex-col items-center justify-center shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Shield className="w-7 h-7 fill-amber-500/15" />
        </div>

        {/* Level Ribbon with Dark Fantasy Font */}
        <div className="absolute -bottom-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full border border-amber-300 shadow-glow-gold flex items-center gap-1 font-fantasy">
          <Sparkles className="w-3 h-3" />
          <span>LVL {level}</span>
        </div>
      </div>
    </div>
  );
};
