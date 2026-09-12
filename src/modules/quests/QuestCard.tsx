import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Trash2, Flame, Coins, Sparkles, Clock } from 'lucide-react';
import { Quest } from '../../types';
import { getAttributeColor } from '../core/rpgEngine';
import { playQuestCompleteSound } from '../economy/SoundEffects';
import { useGameState } from '../core/GameStateContext';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, onDelete }) => {
  const { isMuted } = useGameState();
  const [isCompleting, setIsCompleting] = useState(false);
  const colors = getAttributeColor(quest.attribute);

  const handleCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (quest.completed || isCompleting) return;

    setIsCompleting(true);

    // Audio SFX
    if (!isMuted) {
      playQuestCompleteSound();
    }

    // Localized particle effect origin based on clicked button coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { x, y },
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#a855f7'],
      disableForReducedMotion: true,
    });

    onComplete(quest.id);
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 p-4 sm:p-5 flex items-start gap-4 ${
        quest.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
          : `bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-xl`
      }`}
    >
      {/* Interactive Spring Checkbox */}
      <button
        onClick={handleCheckboxClick}
        disabled={quest.completed}
        aria-label={quest.completed ? "Quest completed" : `Mark ${quest.title} complete`}
        className={`mt-0.5 relative flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
          quest.completed
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
            : 'border-2 border-slate-600 hover:border-amber-400 hover:scale-105 active:scale-95 bg-slate-800/60'
        }`}
      >
        {quest.completed && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      {/* Quest Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {/* Attribute Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {quest.attribute}
          </span>

          {/* Difficulty Badge */}
          <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60">
            {quest.difficulty}
          </span>

          {/* Streak indicator if daily */}
          {quest.is_daily && quest.streak_count > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{quest.streak_count}d streak</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3
          className={`text-sm sm:text-base font-bold text-slate-100 transition-all ${
            quest.completed ? 'line-through text-slate-500' : ''
          }`}
        >
          {quest.title}
        </h3>

        {quest.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {quest.description}
          </p>
        )}

        {/* Reward Pills */}
        <div className="flex items-center gap-3 mt-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            <span>+{quest.xp_reward} XP</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
            <Coins className="w-3 h-3" />
            <span>+{quest.gold_reward} Gold</span>
          </div>
          {quest.is_daily && (
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>Daily</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(quest.id)}
        aria-label="Delete quest"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 focus:opacity-100 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
