import React, { useState } from 'react';
import { X, ShoppingBag, Coins, Sparkles, Shield, Dumbbell, BookOpen, Crown, Palette, Check, AlertCircle } from 'lucide-react';
import { ShopItem } from '../../types';
import { useGameState } from '../core/GameStateContext';
import { playCoinSound } from './SoundEffects';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  FlaskConical: Sparkles,
  Shield: Shield,
  Dumbbell: Dumbbell,
  BookOpen: BookOpen,
  Crown: Crown,
  Palette: Palette,
};

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
  const { shopItems, profile, buyItem, isMuted } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const filteredItems = shopItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handlePurchase = (item: ShopItem) => {
    if (profile.gold < item.cost) {
      setFeedback({ msg: `Insufficient Gold! Slay more quests to accumulate ${item.cost - profile.gold} more Gold.`, isError: true });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const success = buyItem(item);
    if (success) {
      if (!isMuted) playCoinSound();
      setFeedback({ msg: `Acquired ${item.name}! Added to your inventory.`, isError: false });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shop-title" className="text-xl font-black text-slate-100 font-display">
                The Adventurer's Armory
              </h2>
              <p className="text-xs text-slate-400">
                Spend your hard-earned gold on consumables, relics, and prestige
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Player Gold Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm">
              <Coins className="w-4 h-4" />
              <span>{profile.gold} Gold</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close shop"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
              feedback.isError
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {feedback.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Categories */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs border-b border-slate-800 scrollbar-none">
          {['all', 'potion', 'equipment', 'title', 'theme'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium capitalize transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || Sparkles;
            const canAfford = profile.gold >= item.cost;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-750 hover:border-slate-700 transition flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{item.cost} Gold</span>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span>Purchase</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
