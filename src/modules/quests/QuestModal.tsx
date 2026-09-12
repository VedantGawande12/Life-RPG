import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, AlertCircle, Sparkles, Coins, Dumbbell, Brain, MessageSquare, Palette } from 'lucide-react';
import { AttributeType, Difficulty, Quest } from '../../types';
import { getDifficultyRewards } from '../core/rpgEngine';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quest: Omit<Quest, 'id' | 'streak_count' | 'completed'>) => Promise<void>;
}

const ATTRIBUTES: { type: AttributeType; icon: React.FC<{ className?: string }>; color: string }[] = [
  { type: 'Strength', icon: Dumbbell, color: 'hover:border-red-500 hover:text-red-400' },
  { type: 'Intellect', icon: Brain, color: 'hover:border-blue-500 hover:text-blue-400' },
  { type: 'Charisma', icon: MessageSquare, color: 'hover:border-purple-500 hover:text-purple-400' },
  { type: 'Creativity', icon: Palette, color: 'hover:border-emerald-500 hover:text-emerald-400' },
];

const DIFFICULTIES: Difficulty[] = ['Trivial', 'Easy', 'Medium', 'Hard', 'Epic'];

export const QuestModal: React.FC<QuestModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState<AttributeType>('Intellect');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [isDaily, setIsDaily] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setAttribute('Intellect');
      setDifficulty('Medium');
      setIsDaily(true);
      setErrorMessage('');
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rewards = getDifficultyRewards(difficulty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation: Strictly prevent empty task titles
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Quest title cannot be empty. Give your heroic task a name!');
      titleInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        title: trimmedTitle,
        description: description.trim(),
        attribute,
        difficulty,
        xp_reward: rewards.xp,
        gold_reward: rewards.gold,
        is_daily: isDaily,
      });
      onClose();
    } catch (err) {
      setErrorMessage('Failed to save quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-100 font-display">
              Forge New Quest
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform real-world actions into tangible character growth
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quest Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Quest Title <span className="text-amber-400">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g., Read 20 pages of system design"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description <span className="text-slate-500 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clarify success criteria or notes..."
              rows={2}
              className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
              maxLength={250}
            />
          </div>

          {/* Attribute Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Attribute
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ATTRIBUTES.map(({ type, icon: Icon, color }) => {
                const isSelected = attribute === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAttribute(type)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : `bg-slate-800/60 border-slate-700 text-slate-400 ${color}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Rewards Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Difficulty
              </label>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />+{rewards.xp} XP
                </span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <Coins className="w-3 h-3" />+{rewards.gold} Gold
                </span>
              </div>
            </div>
            <div className="flex rounded-xl bg-slate-800/60 p-1 border border-slate-700">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    difficulty === diff
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Habit Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400 w-4 h-4"
            />
            <span className="text-xs text-slate-300 font-medium">
              Daily Quest (Tracks consecutive completion streaks)
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Forging...' : 'Inscribe Quest'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
