import React, { useState } from 'react';
import { Plus, CheckCircle2, Flame, ScrollText } from 'lucide-react';
import { QuestFilter, AttributeType } from '../../types';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { useGameState } from '../core/GameStateContext';

export const QuestBoard: React.FC = () => {
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

  const activeCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-display flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-amber-400" />
              <span>Quest Log</span>
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {activeCount} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Slay daily inertia. Fulfill objectives to accumulate Gold, XP, and Attribute masteries.
          </p>
        </div>

        {/* Forge Quest Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Forge Quest</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-amber-600/60 rounded text-slate-900 border border-amber-400/40">
            N
          </kbd>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
            filter === 'all'
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('daily')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
            filter === 'daily'
              ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3 h-3 text-orange-400" />
          Daily
        </button>

        {(['Strength', 'Intellect', 'Charisma', 'Creativity'] as AttributeType[]).map((attr) => (
          <button
            key={attr}
            onClick={() => setFilter(attr)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
              filter === attr
                ? 'bg-slate-800 border border-slate-600 text-slate-100 font-bold'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {attr}
          </button>
        ))}

        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
            filter === 'completed'
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Completed ({completedCount})
        </button>
      </div>

      {/* Quest List / Loading Skeleton / Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-800/40 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-500 mb-3">
            <CheckCircle2 className="w-6 h-6 text-amber-500/60" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            {filter === 'completed' ? 'No completed quests yet' : 'Quest log is clear'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {filter === 'completed'
              ? 'Check off active quests on your board to log triumphant achievements.'
              : 'No pending quests in this category. Press "Forge Quest" or press N on your keyboard to create one.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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

      {/* Forge Quest Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addQuest}
      />
    </div>
  );
};
