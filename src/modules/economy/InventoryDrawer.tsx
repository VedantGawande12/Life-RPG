import React from 'react';
import { X, Package, Check, Sparkles, Shield, Dumbbell, BookOpen, Crown, Palette } from 'lucide-react';
import { InventoryItem } from '../../types';
import { useGameState } from '../core/GameStateContext';

interface InventoryDrawerProps {
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

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({ isOpen, onClose }) => {
  const { inventory, equipItem } = useGameState();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col shadow-2xl animate-slide-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 id="inventory-title" className="text-lg font-bold text-slate-100 font-display">
              Hero's Vault
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {inventory.length} Items
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close inventory"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {inventory.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-slate-400">Vault is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Visit the Armory Shop to purchase stat relics, streak shields, and prestigious titles with your earned Gold.
              </p>
            </div>
          ) : (
            inventory.map((inv) => {
              const item = inv.item_data;
              const Icon = ICON_MAP[item.icon] || Sparkles;
              const canEquip = item.category === 'title' || item.category === 'theme' || item.category === 'equipment';

              return (
                <div
                  key={inv.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    inv.equipped
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-glow-gold'
                      : 'bg-slate-800/60 border-slate-750'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-200 truncate">{item.name}</h4>
                        {inv.equipped && (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Equipped
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {canEquip && (
                    <button
                      onClick={() => equipItem(inv.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                        inv.equipped
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      {inv.equipped ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Equip</span>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
