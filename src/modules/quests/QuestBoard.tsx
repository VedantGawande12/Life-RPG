import React, { useState } from 'react';
import { Plus, Scroll, BookOpen } from 'lucide-react';
import { QuestFilter } from '../../types';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { useGameState } from '../core/GameStateContext';

interface QuestBoardProps {
  onOpenCodex?: () => void;
}

export const QuestBoard: React.FC<QuestBoardProps> = ({ onOpenCodex }) => {
  const { quests, addQuest, completeQuest, deleteQuest, isLoading } = useGameState();
  const [filter, setFilter] = useState<QuestFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic
  const filteredQuests = quests.filter((q) => {
    if (filter === 'all') return !q.completed;
    if (filter === 'daily') return q.is_daily && !q.completed;
    if (filter === 'completed') return q.completed;
    return q.attribute === filter && !q.completed;
  });

  const activeCount = quests.filter(q => !q.completed).length;
  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* 1. Codex Header */}
      <div className="text-center space-y-1.5 pt-1 pb-1">
        <div className="text-[9px] font-mono tracking-[0.35em] text-sanctum-ash uppercase font-semibold">
          THE CODEX OF DECREES
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-amber-500/50 text-xs font-serif">✦</span>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.15em] text-slate-100 font-bold uppercase drop-shadow-md">
            HALL OF RECKONING
          </h1>
          <span className="text-amber-500/50 text-xs font-serif">✦</span>
        </div>
      </div>

      {/* 2. Codex Filter Bar & Inscribe Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-4 sm:gap-6 font-serif text-[11px] tracking-[0.18em]">
          {/* Active Oaths */}
          <button
            onClick={() => setFilter('all')}
            className={`pb-1 relative transition-colors cursor-pointer uppercase ${
              filter === 'all'
                ? 'text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>ACTIVE OATHS ({activeCount})</span>
            {filter === 'all' && (
              <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-amber-500 shadow-rune-gold" />
            )}
          </button>

          <span className="text-slate-600 font-mono text-[9px]">·</span>

          {/* Daily Vows */}
          <button
            onClick={() => setFilter('daily')}
            className={`pb-1 relative transition-colors cursor-pointer uppercase ${
              filter === 'daily'
                ? 'text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>DAILY VOWS</span>
            {filter === 'daily' && (
              <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-amber-500 shadow-rune-gold" />
            )}
          </button>

          <span className="text-slate-600 font-mono text-[9px]">·</span>

          {/* Sealed Triumphs */}
          <button
            onClick={() => setFilter('completed')}
            className={`pb-1 relative transition-colors cursor-pointer uppercase ${
              filter === 'completed'
                ? 'text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>SEALED ({completedCount})</span>
            {filter === 'completed' && (
              <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-amber-500 shadow-rune-gold" />
            )}
          </button>
        </div>

        {/* Action Buttons: Inscribe Oath & Unseal Ancient Tome */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenCodex && (
            <button
              onClick={onOpenCodex}
              className="inline-flex items-center gap-1.5 border border-amber-500/30 hover:border-amber-400 px-3 py-1.5 text-[9px] font-serif tracking-[0.2em] text-amber-300 hover:text-amber-100 uppercase transition bg-[#0d0f17] hover:bg-amber-950/40 cursor-pointer shadow-md"
              title="Open Ancient Magical Journal [Hotkey C]"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">UNSEAL TOME</span>
              <span className="sm:hidden">TOME</span>
              <kbd className="text-[8px] font-mono text-slate-400 border-l border-white/10 pl-1 ml-0.5">C</kbd>
            </button>
          )}

          {/* Inscribe Oath Forged Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 border border-amber-500/40 hover:border-amber-400 px-3.5 py-1.5 text-[9px] font-serif tracking-[0.22em] text-amber-300 hover:text-amber-100 uppercase transition-all duration-300 bg-[#0c1017] hover:bg-amber-950/30 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>INSCRIBE OATH</span>
            <kbd className="text-[8px] font-mono text-slate-400 border-l border-white/10 pl-1.5 ml-0.5">
              N
            </kbd>
          </button>
        </div>
      </div>

      {/* 3. Inscribed Trials Ledger Rows */}
      {isLoading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-white/[0.02] border-b border-white/[0.05] animate-pulse" />
          ))}
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-2 text-slate-500 font-serif">
          <Scroll className="w-8 h-8 mx-auto opacity-30 text-amber-500 mb-2" />
          <p className="text-xs tracking-widest uppercase text-slate-400">
            {filter === 'completed' ? 'No Triumphs Inscribed' : 'The Codex is Silent'}
          </p>
          <p className="text-[11px] italic font-sans max-w-sm mx-auto text-slate-500">
            {filter === 'completed'
              ? 'Fulfill active decrees on your ledger to inscribe permanent conquests.'
              : 'Press "Inscribe Oath" or hotkey N to carve a new trial into the sanctum chronicle.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={completeQuest}
              onDelete={deleteQuest}
            />
          ))}
        </div>
      )}

      {/* 4. Antiquarian Codex Lore Ticker */}
      <div className="pt-6 text-center text-[11px] italic font-serif text-slate-400 select-none border-t border-white/[0.06]">
        <span>☽ The waning light demands discipline · What is forged in shadows endures in flame ☾</span>
      </div>

      {/* Inscribe Oath Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addQuest}
      />
    </div>
  );
};
