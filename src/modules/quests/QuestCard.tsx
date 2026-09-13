import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sparkles, Coins, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { Quest } from '../../types';
import { playQuestCompleteSound, playRuneScribeSound, playOathBrokenSound } from '../economy/SoundEffects';
import { useGameState } from '../core/GameStateContext';
import { getXpRequiredForLevel } from '../core/rpgEngine';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

interface FloatingCombatText {
  id: number;
  text: string;
  color: string;
}

const ATTRIBUTE_SIGILS: Record<string, { rune: string; label: string; border: string; text: string }> = {
  Strength: { rune: '⚔', label: 'WAR RITE', border: 'border-red-900/60', text: 'text-red-400' },
  Intellect: { rune: '👁', label: 'OCCULT RITE', border: 'border-sky-900/60', text: 'text-sky-400' },
  Charisma: { rune: '👑', label: 'IMPERIAL RITE', border: 'border-purple-900/60', text: 'text-purple-400' },
  Creativity: { rune: '⚗', label: 'ALCHEMICAL RITE', border: 'border-emerald-900/60', text: 'text-emerald-400' },
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, onDelete }) => {
  const { profile, isMuted } = useGameState();
  const [floaters, setFloaters] = useState<FloatingCombatText[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Multi-stage tactile completion state:
  // 'idle' -> 'depressed' -> 'rune-active' -> 'illuminating' -> 'drawing-mark' -> 'floaters-emerging' -> 'triumph'
  const [animStage, setAnimStage] = useState<
    'idle' | 'depressed' | 'rune-active' | 'illuminating' | 'drawing-mark' | 'floaters-emerging' | 'triumph'
  >('idle');

  // Subtle Somber "Oath Broken" Deletion Sequence:
  // 'idle' -> 'darkening' -> 'cracking' -> 'crumbling' -> 'collapsing'
  const [breakStage, setBreakStage] = useState<
    'idle' | 'darkening' | 'cracking' | 'crumbling' | 'collapsing'
  >('idle');

  const isBreaking = breakStage !== 'idle';

  const sigil = ATTRIBUTE_SIGILS[quest.attribute] || {
    rune: '✦',
    label: 'SACRED RITE',
    border: 'border-amber-900/60',
    text: 'text-amber-400',
  };

  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quest.completed || animStage !== 'idle' || isBreaking) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Determine if completion causes a level-up
    const neededXp = getXpRequiredForLevel(profile.level);
    const willLevelUp = profile.xp + quest.xp_reward >= neededXp;

    // Stage 1: Checkbox/button physically depresses
    setAnimStage('depressed');

    // Stage 2: Quest seal/rune activates (100ms)
    setTimeout(() => {
      setAnimStage('rune-active');
      if (!isMuted) {
        playQuestCompleteSound();
      }
    }, 110);

    // Stage 3: Quest entry receives brief golden illumination (220ms)
    setTimeout(() => {
      setAnimStage('illuminating');
    }, 220);

    // Stage 4: Magical completion mark is drawn across quest (350ms)
    setTimeout(() => {
      setAnimStage('drawing-mark');
      if (!isMuted) {
        playRuneScribeSound();
      }
    }, 350);

    // Stage 5: "+XP" emerges from quest (500ms)
    setTimeout(() => {
      setAnimStage('floaters-emerging');
      setFloaters([
        { id: Date.now(), text: `+${quest.xp_reward} ESSENCE`, color: 'text-amber-300' },
        { id: Date.now() + 1, text: `+${quest.gold_reward} GOLD`, color: 'text-yellow-400' },
        { id: Date.now() + 2, text: `+2 ${quest.attribute.toUpperCase()}`, color: 'text-emerald-400' },
      ]);
    }, 500);

    // Stage 6, 7, 8: Flying Particles (650ms)
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('trigger-quest-particles', {
          detail: {
            id: quest.id,
            startX,
            startY,
            xpReward: quest.xp_reward,
            goldReward: quest.gold_reward,
            attribute: quest.attribute,
            willLevelUp,
            onXpArrival: () => {
              if (willLevelUp) {
                onComplete(quest.id);
                setAnimStage('triumph');
              }
            },
            onFinished: () => {
              if (!willLevelUp) {
                onComplete(quest.id);
                setAnimStage('triumph');
              }
            },
          },
        })
      );
    }, 650);
  };

  // Subtle Somber "Oath Broken" Sequence
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBreaking || animStage !== 'idle') return;

    // Step 1: Darken parchment + somber audio
    setBreakStage('darkening');
    if (!isMuted) {
      playOathBrokenSound();
    }

    // Step 2: Develop faint fracture crack / broken rune (150ms)
    setTimeout(() => {
      setBreakStage('cracking');
    }, 150);

    // Step 3: Crumble / decay away into ash flecks (350ms)
    setTimeout(() => {
      setBreakStage('crumbling');
    }, 350);

    // Step 4: Height smoothly collapses to 0, closing gap (680ms)
    setTimeout(() => {
      setBreakStage('collapsing');
    }, 680);

    // Step 5: Unmount / remove from state (950ms)
    setTimeout(() => {
      onDelete(quest.id);
    }, 950);
  };

  const isCompleteOrTriumph = quest.completed || animStage === 'triumph';

  return (
    <motion.div
      layout
      animate={
        breakStage === 'collapsing'
          ? {
              height: 0,
              opacity: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
              overflow: 'hidden',
            }
          : {
              height: 'auto',
              opacity: isBreaking ? (breakStage === 'crumbling' ? 0.25 : 0.6) : 1,
            }
      }
      transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
      onClick={() => {
        if (!isBreaking) setIsExpanded(!isExpanded);
      }}
      className={`relative py-4 px-3 sm:px-4 border-b transition-all select-none overflow-hidden group ${
        isBreaking
          ? 'bg-[#050403] border-stone-800/40 filter grayscale pointer-events-none'
          : isCompleteOrTriumph
          ? 'opacity-70 bg-black/25 border-white/[0.04] hover:bg-white/[0.02] cursor-pointer'
          : animStage === 'illuminating'
          ? 'bg-amber-950/30 border-amber-500/50 shadow-[inset_0_0_25px_rgba(245,158,11,0.25)] cursor-pointer'
          : 'hover:bg-white/[0.02] border-white/[0.06] hover:border-amber-500/20 cursor-pointer'
      }`}
    >
      {/* 3. Golden Illumination Light Sweep (Completion Only) */}
      {animStage === 'illuminating' && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/25 to-transparent pointer-events-none z-20"
        />
      )}

      {/* 4. Magical Completion Mark (Completion Only) */}
      {(animStage === 'drawing-mark' || animStage === 'floaters-emerging' || isCompleteOrTriumph) && !isBreaking && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-25 overflow-visible"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 20,28 Q 180,24 380,30 T 700,26"
            fill="none"
            stroke={isCompleteOrTriumph ? 'rgba(180, 83, 9, 0.45)' : 'rgba(251, 191, 36, 0.9)'}
            strokeWidth={isCompleteOrTriumph ? '2' : '3'}
            strokeLinecap="round"
            initial={{ pathLength: isCompleteOrTriumph ? 1 : 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            filter="drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))"
          />
        </svg>
      )}

      {/* ======================================================================= */}
      {/* OATH BROKEN: Faint Jagged Fracture Crack & Broken Rune                 */}
      {/* ======================================================================= */}
      {(breakStage === 'cracking' || breakStage === 'crumbling' || breakStage === 'collapsing') && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Jagged Cold Stone Fracture Crack Line */}
          <motion.path
            d="M 12,24 L 85,28 L 150,16 L 240,30 L 350,18 L 470,26 L 580,17 L 680,24"
            fill="none"
            stroke="rgba(168, 162, 158, 0.55)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="3 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            filter="drop-shadow(0 0 3px rgba(120, 113, 108, 0.4))"
          />

          {/* Faint Broken Rune Symbol Inscription in Background */}
          <motion.text
            x="50%"
            y="52%"
            textAnchor="middle"
            dominantBaseline="middle"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.25, scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="font-serif text-3xl fill-stone-400 select-none pointer-events-none"
          >
            ᚼ
          </motion.text>
        </svg>
      )}

      {/* ======================================================================= */}
      {/* OATH BROKEN: Faint Ash & Cinder Particle Dissolution                    */}
      {/* ======================================================================= */}
      {(breakStage === 'crumbling' || breakStage === 'collapsing') && (
        <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
          {[
            { id: 1, x: '20%', delay: 0 },
            { id: 2, x: '38%', delay: 0.06 },
            { id: 3, x: '55%', delay: 0.12 },
            { id: 4, x: '72%', delay: 0.04 },
            { id: 5, x: '85%', delay: 0.1 },
          ].map((ash) => (
            <motion.div
              key={ash.id}
              initial={{ opacity: 0.6, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                y: -36,
                x: ash.id % 2 === 0 ? 12 : -12,
                scale: 0.2,
              }}
              transition={{ duration: 0.45, delay: ash.delay, ease: 'easeOut' }}
              style={{ left: ash.x, top: '42%' }}
              className="absolute w-1.5 h-1.5 rounded-full bg-stone-500 shadow-sm"
            />
          ))}
        </div>
      )}

      {/* 5. Floating Combat Text (+XP, +GOLD, +STAT) */}
      <div className="absolute right-20 -top-2 pointer-events-none z-30 flex flex-col items-end gap-1">
        <AnimatePresence>
          {floaters.map((f, idx) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 1, y: 0, scale: 0.85 }}
              animate={{ opacity: 0, y: -50 - idx * 16, scale: 1.15 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className={`text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 bg-[#030508] border border-amber-500/50 shadow-2xl ${f.color}`}
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 sm:gap-5 relative z-10">
        {/* Left: Sigil & Title */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Engraved Sigil Medallion */}
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-serif border bg-[#05080e] flex-shrink-0 transition-all duration-300 ${
              isBreaking
                ? 'border-stone-800 text-stone-600 bg-black'
                : animStage === 'rune-active' || animStage === 'illuminating'
                ? 'border-amber-400 bg-amber-950/60 shadow-rune-gold scale-110 text-amber-200'
                : `${sigil.border} ${sigil.text} group-hover:border-amber-500/60`
            }`}
            title={`${quest.attribute} Discipline Trial`}
          >
            <span>{sigil.rune}</span>
          </div>

          {/* Title & Lore Line */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              {isBreaking ? (
                <span className="text-[8px] font-mono tracking-widest text-stone-500 uppercase font-semibold">
                  OATH FRACTURED
                </span>
              ) : (
                <>
                  <span className="text-[9px] font-mono tracking-widest text-sanctum-ash uppercase">
                    {sigil.label}
                  </span>
                  {quest.is_daily && (
                    <span className="text-[8px] font-mono tracking-wider px-1 py-0.2 bg-amber-950/40 text-amber-300 border border-amber-500/30 uppercase">
                      DAILY
                    </span>
                  )}
                  {isCompleteOrTriumph && (
                    <span className="text-[8px] font-mono tracking-wider px-1.5 py-0.2 bg-amber-950/70 text-amber-200 border border-amber-500/50 uppercase font-semibold flex items-center gap-1">
                      <Award className="w-2.5 h-2.5 text-amber-400" />
                      <span>CONSECRATED TRIUMPH</span>
                    </span>
                  )}
                </>
              )}
            </div>

            <h3
              className={`text-xs sm:text-sm font-serif tracking-[0.08em] font-semibold transition-colors uppercase truncate ${
                isBreaking
                  ? 'line-through text-stone-600'
                  : isCompleteOrTriumph
                  ? 'line-through text-slate-500'
                  : 'text-slate-100 group-hover:text-amber-200'
              }`}
            >
              {quest.title}
            </h3>

            {/* Weathered Underline */}
            <div
              className={`h-[1px] w-20 sm:w-32 transition-all duration-500 mt-1 ${
                isBreaking
                  ? 'bg-stone-800'
                  : 'bg-gradient-to-r from-amber-600/40 to-transparent group-hover:w-44'
              }`}
            />
          </div>
        </div>

        {/* Right: Rewards, Wax Seal & Deletion */}
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          {/* Rewards Inscription */}
          <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-wider text-slate-400">
            <span
              className={`flex items-center gap-1 ${
                isBreaking ? 'text-stone-600' : 'text-amber-300/80'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${isBreaking ? 'text-stone-700' : 'text-amber-500'}`} />
              +{quest.xp_reward} XP
            </span>
            <span
              className={`flex items-center gap-1 ${
                isBreaking ? 'text-stone-600' : 'text-yellow-400/80'
              }`}
            >
              <Coins className={`w-3 h-3 ${isBreaking ? 'text-stone-700' : 'text-amber-500'}`} />
              +{quest.gold_reward} G
            </span>
          </div>

          {/* Wax Seal Stamp Button (Active Oaths Only) */}
          {!isCompleteOrTriumph && (
            <button
              onClick={handleSealClick}
              disabled={animStage !== 'idle' || isBreaking}
              aria-label={`Seal decree: ${quest.title}`}
              title="Stamp Oath with Wax Seal"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border shadow-md ${
                isBreaking
                  ? 'opacity-20 border-stone-800 bg-black cursor-not-allowed'
                  : animStage === 'depressed'
                  ? 'scale-[0.82] bg-black border-amber-600 shadow-inner'
                  : animStage === 'rune-active' || animStage === 'illuminating'
                  ? 'scale-115 bg-amber-900 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.9)] text-amber-100'
                  : 'bg-[#0a0e16] border-amber-500/30 text-amber-500 hover:border-amber-400 hover:scale-110 hover:shadow-rune-gold cursor-pointer'
              }`}
            >
              <span className="text-[10px] font-serif font-bold text-amber-400 group-hover:text-amber-200">
                ✦
              </span>
            </button>
          )}

          {/* Erase Inscription / Break Oath / Purge Triumph Button */}
          <button
            onClick={handleDeleteClick}
            disabled={isBreaking}
            aria-label={isCompleteOrTriumph ? "Purge consecrated triumph" : "Break oath"}
            title={isCompleteOrTriumph ? "Purge Triumph from Chronicle" : "Fracture Oath (Break Inscription)"}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              isCompleteOrTriumph
                ? 'opacity-60 hover:opacity-100 text-stone-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50'
                : 'opacity-0 group-hover:opacity-100 text-stone-500 hover:text-stone-300 hover:bg-stone-900/50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand/Collapse Indicator */}
          <span className="text-slate-500 text-[10px] font-mono group-hover:text-slate-300">
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </div>
      </div>

      {/* Expanded Lore Description */}
      {isExpanded && quest.description && !isBreaking && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-2 text-xs text-slate-300 pl-4 border-l border-amber-500/30 font-sans leading-relaxed bg-[#05070c]/50 p-2"
        >
          <div className="flex items-center gap-1 text-[10px] font-serif uppercase tracking-widest text-amber-400/80 mb-1">
            <span>Inscribed Decree Condition</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed italic">
            "{quest.description}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
