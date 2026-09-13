import React from 'react';
import { Attributes } from '../../types';

interface AttributeBarProps {
  stats: Attributes;
}

const ATTRIBUTE_MAPPINGS = [
  {
    key: 'strength' as const,
    label: 'VITALITY (STR)',
    lineColor: 'bg-[#a82828]', // Blood/crimson hairline
  },
  {
    key: 'intellect' as const,
    label: 'FOCUS (INT)',
    lineColor: 'bg-[#c59b27]', // Antique gold hairline
  },
  {
    key: 'charisma' as const,
    label: 'SPIRIT (CHA)',
    lineColor: 'bg-[#6366f1]', // Ethereal indigo hairline
  },
  {
    key: 'creativity' as const,
    label: 'PROVIDENCE (CRE)',
    lineColor: 'bg-[#059669]', // Eldritch emerald hairline
  },
];

export const AttributeBar: React.FC<AttributeBarProps> = ({ stats }) => {
  return (
    <div className="space-y-3.5 w-full">
      <div className="text-[10px] tracking-[0.22em] font-serif text-slate-400 uppercase font-semibold">
        Attributes
      </div>

      <div className="space-y-2.5">
        {ATTRIBUTE_MAPPINGS.map(({ key, label, lineColor }) => {
          const val = stats[key];
          const percent = Math.min(100, Math.round((val / 50) * 100));

          return (
            <div key={key} className="flex items-center justify-between gap-3 text-[11px] group">
              {/* Attribute Name */}
              <span className="font-serif tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors w-28 uppercase text-[10px]">
                {label}
              </span>

              {/* Razor Thin Hairline Gauge Track */}
              <div className="flex-1 h-[2px] bg-white/[0.07] overflow-hidden relative">
                <div
                  className={`h-full ${lineColor} transition-all duration-700 opacity-80 group-hover:opacity-100`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Exact Value */}
              <span className="font-mono text-slate-400 group-hover:text-amber-300 transition-colors w-6 text-right text-[11px]">
                {val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
