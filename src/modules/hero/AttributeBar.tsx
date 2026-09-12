import React from 'react';
import { Dumbbell, Brain, MessageSquare, Palette } from 'lucide-react';
import { Attributes } from '../../types';

interface AttributeBarProps {
  stats: Attributes;
}

const STAT_CONFIG = [
  {
    key: 'strength' as const,
    label: 'Strength',
    icon: Dumbbell,
    color: 'text-red-400',
    barBg: 'bg-red-500',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
    desc: 'Physical vitality & discipline',
  },
  {
    key: 'intellect' as const,
    label: 'Intellect',
    icon: Brain,
    color: 'text-blue-400',
    barBg: 'bg-blue-500',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    desc: 'Logic, coding & analytical depth',
  },
  {
    key: 'charisma' as const,
    label: 'Charisma',
    icon: MessageSquare,
    color: 'text-purple-400',
    barBg: 'bg-purple-500',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
    desc: 'Articulation & social magnetism',
  },
  {
    key: 'creativity' as const,
    label: 'Creativity',
    icon: Palette,
    color: 'text-emerald-400',
    barBg: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    desc: 'Artistic rhythm & originality',
  },
];

export const AttributeBar: React.FC<AttributeBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STAT_CONFIG.map(({ key, label, icon: Icon, color, barBg, border, bg }) => {
        const val = stats[key];
        // Calculate a visual gauge percent (capped at 100)
        const percent = Math.min(100, Math.round((val / 50) * 100));

        return (
          <div
            key={key}
            className={`p-3 rounded-xl ${bg} border ${border} flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs font-semibold text-slate-300 tracking-wide">{label}</span>
              </div>
              <span className={`text-sm font-black font-mono ${color}`}>{val}</span>
            </div>

            {/* Micro Progress Track */}
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${barBg} rounded-full transition-all duration-700`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
