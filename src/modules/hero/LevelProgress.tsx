import React from 'react';
import { Sparkles } from 'lucide-react';
import { getXpRequiredForLevel, calculateLevelProgress } from '../core/rpgEngine';

interface LevelProgressProps {
  level: number;
  xp: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp }) => {
  const neededXp = getXpRequiredForLevel(level);
  const progressPercent = calculateLevelProgress(xp, level);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EXPERIENCE</span>
        </div>
        <div className="font-mono text-slate-400">
          <span className="text-amber-300 font-bold">{xp}</span>
          <span className="text-slate-600 mx-1">/</span>
          <span>{neededXp} XP</span>
          <span className="ml-2 text-slate-500 font-semibold">({progressPercent}%)</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-glow-gold"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
