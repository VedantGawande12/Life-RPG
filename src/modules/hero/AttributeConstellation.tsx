import React, { useState } from 'react';
import { Attributes } from '../../types';
import { useGameState } from '../core/GameStateContext';

interface AttributeConstellationProps {
  stats: Attributes;
}

interface StatNode {
  key: keyof Attributes;
  title: string;
  sub: string;
  rune: string;
  x: number;
  y: number;
  accent: string;
  glow: string;
  description: string;
}

const STAT_NODES: StatNode[] = [
  {
    key: 'intellect',
    title: 'FOCUS',
    sub: 'Intellect',
    rune: 'ᚱ',
    x: 150,
    y: 36,
    accent: 'text-sky-300',
    glow: 'rgba(56, 112, 178, 0.4)',
    description: 'Mental acuity, knowledge retention, and strategic clarity.',
  },
  {
    key: 'charisma',
    title: 'SPIRIT',
    sub: 'Charisma',
    rune: 'ᚦ',
    x: 248,
    y: 130,
    accent: 'text-purple-300',
    glow: 'rgba(126, 75, 153, 0.4)',
    description: 'Commanding presence, articulation, and unbreakable conviction.',
  },
  {
    key: 'creativity',
    title: 'PROVIDENCE',
    sub: 'Creativity',
    rune: 'ᛝ',
    x: 150,
    y: 224,
    accent: 'text-emerald-300',
    glow: 'rgba(40, 125, 90, 0.4)',
    description: 'Ingenuity, problem synthesis, and generative craftsmanship.',
  },
  {
    key: 'strength',
    title: 'VITALITY',
    sub: 'Strength',
    rune: 'ᚢ',
    x: 52,
    y: 130,
    accent: 'text-red-300',
    glow: 'rgba(168, 50, 50, 0.4)',
    description: 'Physical constitution, resilience, and unyielding stamina.',
  },
];

export const AttributeConstellation: React.FC<AttributeConstellationProps> = ({ stats }) => {
  const { profile, allocateStatPoint } = useGameState();
  const [hoveredStat, setHoveredStat] = useState<StatNode | null>(null);

  const statPoints = profile.stat_points || 0;

  // Find dominant attribute
  const dominantStatKey = (Object.keys(stats) as (keyof Attributes)[]).reduce((max, key) =>
    stats[key] > stats[max] ? key : max
  , 'intellect');

  const totalPoints = stats.strength + stats.intellect + stats.charisma + stats.creativity;

  // Calculate polygon points based on normalized stats (scaled 10-50)
  const center = { x: 150, y: 130 };
  const getRadiusOffset = (val: number, maxRadius: number) => {
    const clamped = Math.min(50, Math.max(10, val));
    return (clamped / 50) * maxRadius;
  };

  const northY = center.y - getRadiusOffset(stats.intellect, 84);
  const eastX = center.x + getRadiusOffset(stats.charisma, 88);
  const southY = center.y + getRadiusOffset(stats.creativity, 84);
  const westX = center.x - getRadiusOffset(stats.strength, 88);

  const polygonPath = `${center.x},${northY} ${eastX},${center.y} ${center.x},${southY} ${westX},${center.y}`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Label */}
      <div className="w-full flex items-center justify-between text-[9px] font-serif tracking-[0.25em] text-sanctum-ash uppercase pb-2 border-b border-white/[0.06]">
        <span>ASTRAL RESONANCE</span>
        <span className="font-mono text-amber-500/80">TOTAL {totalPoints}</span>
      </div>

      {/* Unspent Stat Points Banner */}
      {statPoints > 0 && (
        <div className="w-full mt-2 px-3 py-1.5 bg-amber-950/70 border border-amber-500/70 rounded flex items-center justify-between text-xs font-serif text-amber-200 animate-pulse shadow-rune-gold">
          <span className="text-[10px] tracking-wider uppercase font-bold text-amber-300">
            ✦ {statPoints} STAT POINT{statPoints > 1 ? 'S' : ''} UNSPENT
          </span>
          <span className="text-[9px] font-mono text-amber-400 font-semibold">Click node to allocate</span>
        </div>
      )}

      {/* Interactive Constellation SVG Dial */}
      <div className="relative w-full max-w-[300px] aspect-[300/260] my-2 select-none">
        <svg viewBox="0 0 300 260" className="w-full h-full overflow-visible">
          <defs>
            {/* Radial background glow */}
            <radialGradient id="nexusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(197, 155, 39, 0.12)" />
              <stop offset="100%" stopColor="rgba(3, 5, 8, 0)" />
            </radialGradient>

            {/* Inner web fill */}
            <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(197, 155, 39, 0.22)" />
              <stop offset="100%" stopColor="rgba(37, 75, 121, 0.18)" />
            </linearGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="150" cy="130" r="100" fill="url(#nexusGlow)" />

          {/* Outer Astrolabe Coordinate Rings */}
          <circle
            cx="150"
            cy="130"
            r="94"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <circle
            cx="150"
            cy="130"
            r="62"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
          />
          <circle
            cx="150"
            cy="130"
            r="30"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
            strokeDasharray="1 3"
          />

          {/* Cross Axes Lines */}
          <line
            x1="150"
            y1="36"
            x2="150"
            y2="224"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
          <line
            x1="52"
            y1="130"
            x2="248"
            y2="130"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />

          {/* Diagonal Guide Lines */}
          <line
            x1="80"
            y1="60"
            x2="220"
            y2="200"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <line
            x1="220"
            y1="60"
            x2="80"
            y2="200"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Connecting Constellation Web Area */}
          <polygon
            points={polygonPath}
            fill="url(#webGrad)"
            stroke="rgba(197, 155, 39, 0.5)"
            strokeWidth="1.5"
            className="transition-all duration-700 filter drop-shadow(0 0 6px rgba(197,155,39,0.3))"
          />

          {/* Central Nexus Core */}
          <circle
            cx="150"
            cy="130"
            r="5"
            fill="#c59b27"
            className="animate-pulse"
          />
          <circle
            cx="150"
            cy="130"
            r="10"
            fill="none"
            stroke="rgba(197, 155, 39, 0.35)"
            strokeWidth="1"
          />

          {/* 4 Cardinal Interactive Nodes */}
          {STAT_NODES.map((node) => {
            const val = stats[node.key];
            const isDominant = dominantStatKey === node.key;
            const isHovered = hoveredStat?.key === node.key;

            return (
              <g
                key={node.key}
                id={`attr-${node.key}`}
                onClick={() => {
                  if (statPoints > 0) {
                    allocateStatPoint(node.key);
                  }
                }}
                onMouseEnter={() => setHoveredStat(node)}
                onMouseLeave={() => setHoveredStat(null)}
                className="cursor-pointer group transition-transform duration-300"
              >
                {/* Node Outer Halo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 17 : 14}
                  fill="#070a10"
                  stroke={
                    statPoints > 0
                      ? 'rgba(245, 158, 11, 0.9)'
                      : isDominant
                      ? 'rgba(197, 155, 39, 0.8)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                  strokeWidth={statPoints > 0 ? 2 : isDominant ? 1.5 : 1}
                  className="transition-all duration-300"
                />

                {/* Node Inner Rune Inscription */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className={`font-serif text-[11px] font-bold ${
                    statPoints > 0 ? 'fill-yellow-300' : isDominant ? 'fill-amber-300' : 'fill-slate-300'
                  }`}
                >
                  {node.rune}
                </text>

                {/* Unspent Plus Indicator Badge */}
                {statPoints > 0 && (
                  <g className="animate-bounce">
                    <circle
                      cx={node.x + 12}
                      cy={node.y - 12}
                      r="6"
                      fill="#b45309"
                      stroke="#fde047"
                      strokeWidth="1"
                    />
                    <text
                      x={node.x + 12}
                      y={node.y - 9}
                      textAnchor="middle"
                      className="font-mono text-[9px] font-bold fill-white pointer-events-none"
                    >
                      +
                    </text>
                  </g>
                )}

                {/* Numerical Badge */}
                <rect
                  x={node.x - 12}
                  y={node.y > 130 ? node.y + 12 : node.y - 23}
                  width="24"
                  height="12"
                  fill="#030508"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="0.8"
                />
                <text
                  x={node.x}
                  y={node.y > 130 ? node.y + 21 : node.y - 14}
                  textAnchor="middle"
                  className="font-mono text-[9px] font-bold fill-slate-200"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Lore Tooltip / Selected Node Breakdown */}
      <div className="w-full bg-[#070a10]/80 border border-white/[0.06] p-2.5 min-h-[58px] flex flex-col justify-center transition-all">
        {hoveredStat ? (
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[10px] font-serif tracking-widest uppercase">
              <span className={`font-bold ${hoveredStat.accent}`}>
                {hoveredStat.title} · {hoveredStat.sub}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {stats[hoveredStat.key]} / 50
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-tight">
              {hoveredStat.description}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[10px] font-serif text-slate-400 tracking-wider">
            <span className="italic">
              Dominant Discipline: <strong className="text-amber-300 uppercase">{dominantStatKey}</strong>
            </span>
            <span className="text-[9px] font-mono text-slate-500">HOVER NODES</span>
          </div>
        )}
      </div>
    </div>
  );
};
