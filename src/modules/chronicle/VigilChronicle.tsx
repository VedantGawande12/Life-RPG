import React, { useState } from 'react';
import { History, HelpCircle, Compass, Scroll } from 'lucide-react';
import { useGameState } from '../core/GameStateContext';

export const VigilChronicle: React.FC = () => {
  const { profile, quests } = useGameState();
  const [showRules, setShowRules] = useState(false);

  const completedQuests = quests.filter((q) => q.completed);

  return (
    <div className="w-full flex flex-col space-y-5 select-none">
      {/* ========================================================= */}
      {/* 1. THE CONSECRATED CHRONICLE (Scribe's Audit Ledger)     */}
      {/* ========================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[9px] font-serif tracking-[0.25em] text-sanctum-ash uppercase font-semibold">
          <span className="flex items-center gap-1.5">
            <History className="w-3 h-3 text-amber-500/80" />
            <span>THE CONSECRATED CHRONICLE</span>
          </span>
          <span className="font-mono text-[8px] text-amber-400 font-bold">{completedQuests.length} DEEDS SEALED</span>
        </div>

        <div className="space-y-2 font-serif text-xs">
          {completedQuests.length > 0 ? (
            completedQuests.slice(0, 4).map((q) => (
              <div key={q.id} className="flex items-start gap-2.5 p-2.5 bg-[#06080d]/70 border border-white/[0.05] hover:border-amber-500/30 transition-colors">
                <span className="text-amber-400 text-[10px] mt-0.5">✦</span>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 leading-snug text-[11px] truncate">
                    Sealed: <span className="text-amber-200 uppercase font-semibold">{q.title}</span>
                  </p>
                  <div className="flex items-center gap-2.5 mt-1 font-mono text-[9px]">
                    <span className="text-sanctum-ash tracking-wider uppercase">
                      +{q.xp_reward} ESSENCE
                    </span>
                    <span className="text-yellow-400/90 tracking-wider uppercase font-bold">
                      +{q.gold_reward} ORE
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-2.5 p-3 bg-[#06080d]/60 border border-white/[0.04]">
              <Scroll className="w-4 h-4 text-amber-500/60 mt-0.5" />
              <div>
                <p className="text-slate-300 leading-snug text-[11px]">
                  Sanctum consecrated. First triumph awaits your resolve.
                </p>
                <span className="text-[8px] font-mono text-sanctum-ash tracking-wider uppercase">
                  RECORD COMMENCED
                </span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-2.5 bg-[#06080d]/70 border border-white/[0.05]">
            <span className="text-sky-400 text-[10px] mt-0.5">✦</span>
            <div>
              <p className="text-slate-300 leading-snug text-[11px]">
                Soul essence attuned. Current treasury: <strong className="text-amber-300 font-mono">{profile.gold} Gold Ore</strong>.
              </p>
              <span className="text-[8px] font-mono text-sanctum-ash tracking-wider uppercase">
                SANCTUARY TREASURY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Engraved Divider */}
      <div className="engraved-divider" />

      {/* ========================================================= */}
      {/* 2. CELESTIAL RECKONINGS (Astrological Conjunctions)      */}
      {/* ========================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[9px] font-serif tracking-[0.25em] text-sanctum-ash uppercase font-semibold">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-amber-500/70" />
            <span>CELESTIAL RECKONINGS</span>
          </span>
          <span className="font-mono text-[8px] text-slate-400">ALIGNMENTS</span>
        </div>

        <div className="space-y-2">
          {/* Conjunction 1 */}
          <div className="flex items-start gap-3 p-2.5 bg-[#06080d]/70 border border-white/[0.05] hover:border-amber-500/30 transition-colors group cursor-pointer">
            <div className="text-right w-12 font-mono text-[9px] text-sanctum-ash tracking-wider pt-0.5 uppercase">
              <div className="text-[8px] text-slate-500">TODAY</div>
              <div className="text-amber-300 font-bold">SUN</div>
            </div>
            <div className="flex-1 min-w-0 border-l border-white/[0.06] pl-2.5">
              <div className="flex items-center gap-1 text-[8px] font-mono text-amber-500/80 uppercase">
                <span>HOUSE OF DAWN</span>
              </div>
              <h4 className="text-[11px] font-serif tracking-wider text-slate-200 group-hover:text-amber-200 transition-colors uppercase truncate font-semibold">
                The Conclave of Shadows
              </h4>
              <p className="text-[9px] font-mono text-slate-400">09:00 · SACRED DISCIPLINE</p>
            </div>
          </div>

          {/* Conjunction 2 */}
          <div className="flex items-start gap-3 p-2.5 bg-[#06080d]/70 border border-white/[0.05] hover:border-amber-500/30 transition-colors group cursor-pointer">
            <div className="text-right w-12 font-mono text-[9px] text-sanctum-ash tracking-wider pt-0.5 uppercase">
              <div className="text-[8px] text-slate-500">+2 DAYS</div>
              <div className="text-slate-300 font-bold">TUE</div>
            </div>
            <div className="flex-1 min-w-0 border-l border-white/[0.06] pl-2.5">
              <div className="flex items-center gap-1 text-[8px] font-mono text-slate-400 uppercase">
                <span>HOUSE OF COMMERCE</span>
              </div>
              <h4 className="text-[11px] font-serif tracking-wider text-slate-200 group-hover:text-amber-200 transition-colors uppercase truncate font-semibold">
                Reckoning of Accounts
              </h4>
              <p className="text-[9px] font-mono text-slate-400">14:30 · GOLD ORE LEDGER</p>
            </div>
          </div>

          {/* Conjunction 3 */}
          <div className="flex items-start gap-3 p-2.5 bg-[#06080d]/70 border border-white/[0.05] hover:border-red-500/30 transition-colors group cursor-pointer">
            <div className="text-right w-12 font-mono text-[9px] text-sanctum-ash tracking-wider pt-0.5 uppercase">
              <div className="text-[8px] text-slate-500">+4 DAYS</div>
              <div className="text-red-400 font-bold">THU</div>
            </div>
            <div className="flex-1 min-w-0 border-l border-white/[0.06] pl-2.5">
              <div className="flex items-center gap-1 text-[8px] font-mono text-red-400/80 uppercase">
                <span>HOUSE OF WAR</span>
              </div>
              <h4 className="text-[11px] font-serif tracking-wider text-red-300 group-hover:text-red-200 transition-colors uppercase truncate font-semibold">
                Grand Milestone Seal
              </h4>
              <p className="text-[9px] font-mono text-red-400/80">23:59 · ABSOLUTE DEADLINE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Accordion */}
      <div className="pt-1">
        <button
          onClick={() => setShowRules(!showRules)}
          className="w-full py-1.5 px-2.5 border border-white/[0.08] hover:border-amber-500/40 bg-[#06080d]/70 flex items-center justify-between text-[9px] font-serif tracking-widest text-slate-400 hover:text-amber-200 uppercase transition cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3 text-amber-500/70" />
            <span>Laws of Sanctum Consecration</span>
          </span>
          <span className="font-mono">{showRules ? '−' : '+'}</span>
        </button>

        {showRules && (
          <div className="mt-1.5 p-3 bg-[#070a10] border border-white/10 text-[10px] font-sans text-slate-400 leading-relaxed space-y-1.5">
            <p className="font-serif text-amber-200 uppercase font-bold text-[9px] tracking-wider">
              The Sovereign Discipline
            </p>
            <p>1. Every fulfilled trial carves permanent essence into your chronicle.</p>
            <p>2. The Daily Omen in the Hero Sanctum amplifies the discipline of your soul.</p>
            <p>3. Gold ore acquired in battle may be transmuted into relics in the Armory.</p>
          </div>
        )}
      </div>
    </div>
  );
};
