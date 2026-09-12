import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface HeroAvatarProps {
  level: number;
  badge?: string;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({ level }) => {
  return (
    <div className="relative group">
      {/* Glow aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-500 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500"></div>
      
      {/* Avatar Container */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700/80 p-2 flex flex-col items-center justify-center shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Shield className="w-7 h-7" />
        </div>
        
        {/* Floating Level Ribbon */}
        <div className="absolute -bottom-3 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-300 shadow-glow-gold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>LVL {level}</span>
        </div>
      </div>
    </div>
  );
};
