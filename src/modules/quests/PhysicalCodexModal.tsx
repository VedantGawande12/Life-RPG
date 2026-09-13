import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Check, Sparkles, Coins, Trash2, ChevronDown, ChevronUp, Feather } from 'lucide-react';
import { useGameState } from '../core/GameStateContext';
import { Quest, QuestFilter } from '../../types';
import { QuestModal } from './QuestModal';
import { playQuestCompleteSound, playBookOpenSound, playPageTurnSound, playRuneScribeSound, playOathBrokenSound } from '../economy/SoundEffects';
import { getXpRequiredForLevel } from '../core/rpgEngine';
import confetti from 'canvas-confetti';

interface PhysicalCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ATTRIBUTE_SIGILS: Record<string, { rune: string; label: string; text: string; bg: string }> = {
  Strength: { rune: '⚔', label: 'WAR RITE', text: 'text-red-400', bg: 'border-red-500/30' },
  Intellect: { rune: '👁', label: 'OCCULT RITE', text: 'text-sky-400', bg: 'border-sky-500/30' },
  Charisma: { rune: '👑', label: 'IMPERIAL RITE', text: 'text-purple-400', bg: 'border-purple-500/30' },
  Creativity: { rune: '⚗', label: 'ALCHEMICAL RITE', text: 'text-emerald-400', bg: 'border-emerald-500/30' },
};

// Procedural dust motes configuration
const DUST_MOTES = [
  { id: 1, left: '46%', top: '48%', size: 3, delay: 0.1, duration: 2.2, xOffset: -18 },
  { id: 2, left: '52%', top: '50%', size: 4, delay: 0.2, duration: 2.5, xOffset: 24 },
  { id: 3, left: '49%', top: '44%', size: 2, delay: 0.15, duration: 1.9, xOffset: -8 },
  { id: 4, left: '55%', top: '46%', size: 3, delay: 0.3, duration: 2.8, xOffset: 35 },
  { id: 5, left: '44%', top: '52%', size: 2.5, delay: 0.25, duration: 2.1, xOffset: -28 },
  { id: 6, left: '50%', top: '40%', size: 3.5, delay: 0.35, duration: 2.6, xOffset: 12 },
  { id: 7, left: '47%', top: '55%', size: 2, delay: 0.4, duration: 2.4, xOffset: -14 },
  { id: 8, left: '53%', top: '42%', size: 3, delay: 0.45, duration: 2.7, xOffset: 20 },
];

export const PhysicalCodexModal: React.FC<PhysicalCodexModalProps> = ({ isOpen, onClose }) => {
  const { quests, profile, addQuest, completeQuest, deleteQuest, isMuted } = useGameState();
  const [filter, setFilter] = useState<QuestFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [brokenQuestMap, setBrokenQuestMap] = useState<Record<string, 'darkening' | 'cracking' | 'crumbling' | 'collapsing'>>({});

  // Animation Stage Progression:
  // 'spawning' (book appears in center)
  // -> 'unsealing' (cover swings open in 3D + latch sound)
  // -> 'flipping' (pages turn rapidly + page turn sound + dust motes rise)
  // -> 'settled' (final page settles into active Quest Chronicle interface)
  const [stage, setStage] = useState<'closed' | 'spawning' | 'unsealing' | 'flipping' | 'settled'>('closed');

  useEffect(() => {
    if (!isOpen) {
      setStage('closed');
      return;
    }

    // Step 1 & 2: Book appears in center + latch click
    setStage('spawning');
    if (!isMuted) {
      playBookOpenSound();
    }

    // Step 3: Cover rotates open in perspective
    const tCover = setTimeout(() => {
      setStage('unsealing');
    }, 220);

    // Step 4 & 5: Pages turn rapidly + dust rises
    const tPages = setTimeout(() => {
      setStage('flipping');
      if (!isMuted) {
        playPageTurnSound();
      }
    }, 450);

    // Step 6, 7 & 8: Settles into illuminated parchment folio with sequential entries
    const tSettled = setTimeout(() => {
      setStage('settled');
    }, 900);

    return () => {
      clearTimeout(tCover);
      clearTimeout(tPages);
      clearTimeout(tSettled);
    };
  }, [isOpen, isMuted]);

  useEffect(() => {
    if (!isOpen) return;
    const filterTabs: ('all' | 'daily' | 'completed')[] = ['all', 'daily', 'completed'];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === '1') {
        setFilter('all');
      } else if (e.key === '2') {
        setFilter('daily');
      } else if (e.key === '3') {
        setFilter('completed');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setFilter((prev) => {
          const idx = filterTabs.indexOf(prev as 'all' | 'daily' | 'completed');
          const next = filterTabs[(idx + 1) % filterTabs.length];
          if (!isMuted) playPageTurnSound();
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setFilter((prev) => {
          const idx = filterTabs.indexOf(prev as 'all' | 'daily' | 'completed');
          const next = filterTabs[(idx - 1 + filterTabs.length) % filterTabs.length];
          if (!isMuted) playPageTurnSound();
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isMuted]);

  if (!isOpen) return null;

  const filteredQuests = quests.filter((q) => {
    if (filter === 'all') return !q.completed;
    if (filter === 'daily') return q.is_daily && !q.completed;
    if (filter === 'completed') return q.completed;
    return q.attribute === filter && !q.completed;
  });

  const handleSealClick = (e: React.MouseEvent, quest: Quest) => {
    e.stopPropagation();
    if (quest.completed) return;

    if (!isMuted) {
      playQuestCompleteSound();
      playRuneScribeSound();
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const neededXp = getXpRequiredForLevel(profile.level);
    const willLevelUp = profile.xp + quest.xp_reward >= neededXp;

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
              onClose();
              completeQuest(quest.id);
            }
          },
          onFinished: () => {
            if (!willLevelUp) {
              completeQuest(quest.id);
            }
          },
        },
      })
    );

    if (!willLevelUp) {
      const x = startX / window.innerWidth;
      const y = startY / window.innerHeight;

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x, y },
        colors: ['#c59b27', '#8a6230', '#dcd7cc', '#8f2828', '#f3ebd7'],
        disableForReducedMotion: true,
      });

      completeQuest(quest.id);
    }
  };

  const handleDeleteQuest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (brokenQuestMap[id]) return;

    if (!isMuted) {
      playOathBrokenSound();
    }

    setBrokenQuestMap((prev) => ({ ...prev, [id]: 'darkening' }));

    setTimeout(() => {
      setBrokenQuestMap((prev) => ({ ...prev, [id]: 'cracking' }));
    }, 150);

    setTimeout(() => {
      setBrokenQuestMap((prev) => ({ ...prev, [id]: 'crumbling' }));
    }, 350);

    setTimeout(() => {
      setBrokenQuestMap((prev) => ({ ...prev, [id]: 'collapsing' }));
    }, 680);

    setTimeout(() => {
      deleteQuest(id);
      setBrokenQuestMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 950);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. CURRENT DASHBOARD SUBTLY FADES/DIMS (Atmospheric Backdrop)             */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
      >
        {/* Radial Dark Sanctuary Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-950/25 via-transparent to-black pointer-events-none" />
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. FAINT DUST / PARTICLE EFFECT RISING FROM PAGES                        */}
      {/* ========================================================================= */}
      {(stage === 'flipping' || stage === 'settled') && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {DUST_MOTES.map((mote) => (
            <motion.div
              key={mote.id}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0.6,
              }}
              animate={{
                opacity: [0, 0.75, 0],
                x: mote.xOffset,
                y: -140 - mote.id * 15,
                scale: [0.6, 1.2, 0.4],
              }}
              transition={{
                duration: mote.duration,
                delay: mote.delay,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: mote.left,
                top: mote.top,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
              }}
              className="rounded-full bg-gradient-to-tr from-amber-400 to-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3D BOOK VOLUME CONTAINER (Realistic Perspective)                         */}
      {/* ========================================================================= */}
      <div
        className="relative z-30 flex items-center justify-center w-full max-w-5xl h-[86vh] min-h-[580px] max-h-[820px]"
        style={{ perspective: '2200px' }}
      >
        {/* ======================================================================= */}
        {/* STAGES 1 & 2: CLOSED ANCIENT LEATHER TOME WITH REALISTIC THICKNESS      */}
        {/* ======================================================================= */}
        {(stage === 'spawning' || stage === 'unsealing') && (
          <div
            className="relative w-[340px] sm:w-[420px] h-[520px] flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Realistic Page Thickness: Edge block stacked sheets behind cover */}
            <div
              className="absolute right-0 top-3 bottom-3 w-5 bg-gradient-to-l from-[#d4cbba] via-[#bfb39d] to-[#73634e] rounded-r-sm shadow-2xl"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(180deg, #d4cbba 0px, #d4cbba 2px, #8c7a65 2px, #8c7a65 3px)',
                boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.7), 8px 0 20px rgba(0,0,0,0.8)',
              }}
            />

            {/* Heavy Book Spine on Left */}
            <div
              className="absolute left-[-14px] top-0 bottom-0 w-8 bg-[#100d0a] border-l border-amber-950/70 rounded-l-md shadow-2xl flex flex-col justify-around py-8 items-center"
              style={{
                boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.9), -5px 0 15px rgba(0,0,0,0.8)',
              }}
            >
              {/* Spine Ribs & Bronze Rivets */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-5 h-1.5 bg-amber-700/60 rounded-full border border-amber-500/40 shadow-sm" />
              ))}
            </div>

            {/* Dangling Silk Ribbon Bookmark */}
            <div
              className="absolute bottom-[-24px] left-[35%] w-4 h-9 bg-gradient-to-b from-[#8f2828] to-[#591616] border-x border-amber-500/40 shadow-lg"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
              }}
            />

            {/* 3D Rotating Front Cover (Realistic Perspective) */}
            <motion.div
              initial={{ rotateY: 0, scale: 0.95, opacity: 0 }}
              animate={
                stage === 'unsealing'
                  ? { rotateY: -160, scale: 1, opacity: 1 }
                  : { rotateY: 0, scale: 1, opacity: 1 }
              }
              transition={
                stage === 'unsealing'
                  ? { duration: 0.68, ease: [0.3, 1, 0.4, 1] }
                  : { duration: 0.35, ease: 'easeOut' }
              }
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                boxShadow: '0 30px 70px -15px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,0,0,0.85)',
              }}
              className="absolute inset-0 bg-[#140f0c] border-2 border-amber-900/70 rounded-r-md flex flex-col items-center justify-center p-8 text-center"
            >
              {/* Dark Full-Grain Leather Grain & Beveled Inner Inset */}
              <div className="absolute inset-3 border border-amber-700/30 rounded pointer-events-none" />
              <div className="absolute inset-5 border-2 border-amber-600/20 rounded pointer-events-none" />

              {/* Four Heavy Cast-Bronze Corner Caps */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />

              {/* Subtle Engraved Symbols & Arcane Orbit Rings */}
              <div className="relative w-28 h-28 rounded-full border-2 border-amber-500/50 flex items-center justify-center bg-[#0d0907] shadow-rune-gold mb-6">
                <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/40 animate-[spin_40s_linear_infinite]" />
                <span className="text-4xl text-amber-400 font-serif filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  ⬡
                </span>
              </div>

              {/* Golden/Ivory Embossed Typography */}
              <h2 className="text-2xl font-serif tracking-[0.25em] text-amber-200 font-bold uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                CHRONICON
              </h2>
              <p className="text-[10px] font-mono tracking-[0.3em] text-amber-500/90 mt-1 uppercase font-semibold">
                Liber Factorum · The Book of Oaths
              </p>

              <div className="mt-8 flex items-center gap-2 text-[9px] font-serif tracking-widest text-amber-400/80 uppercase">
                <span className="animate-pulse">✦</span>
                <span>Unsealing Ancient Binding...</span>
                <span className="animate-pulse">✦</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STAGE 4: RAPID SMOOTH PARCHMENT PAGE FLIPPING                          */}
        {/* ======================================================================= */}
        {stage === 'flipping' && (
          <div
            className="relative w-full max-w-4xl h-[580px] flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Turning Leaf 1 (Front Cover Shadow Follow-through) */}
            <motion.div
              initial={{ rotateY: -120 }}
              animate={{ rotateY: -180 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-1/2 top-0 bottom-0 w-1/2 bg-[#120d0a] border border-amber-900/50 shadow-2xl rounded-r-sm"
            />

            {/* Turning Leaf 2 (Aged Parchment Folio) */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -172 }}
              transition={{ duration: 0.48, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-1/2 top-1 bottom-1 w-[48%] bg-[#e3dbc9] border border-stone-400/70 shadow-2xl rounded-r-sm flex flex-col justify-center p-6 text-stone-700/60 font-serif text-[10px] space-y-3"
            >
              <div className="h-2 w-3/4 bg-stone-500/20 rounded" />
              <div className="h-2 w-full bg-stone-500/15 rounded" />
              <div className="h-2 w-5/6 bg-stone-500/15 rounded" />
            </motion.div>

            {/* Turning Leaf 3 (Illuminated Manuscript Leaf) */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -166 }}
              transition={{ duration: 0.42, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-1/2 top-2 bottom-2 w-[47%] bg-[#dcd3be] border border-stone-400/80 shadow-xl rounded-r-sm flex flex-col justify-center p-6 text-stone-700/60 font-serif text-[10px] space-y-2"
            >
              <div className="h-3 w-1/2 bg-amber-800/30 rounded" />
              <div className="h-2 w-full bg-stone-500/20 rounded" />
              <div className="h-2 w-2/3 bg-stone-500/15 rounded" />
            </motion.div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STAGES 6, 7 & 8: SETTLED ANCIENT ILLUMINATED PARCHMENT CODEX INTERFACE   */}
        {/* The destination content physically lives within the opened tome!        */}
        {/* ======================================================================= */}
        {stage === 'settled' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="relative w-full h-full max-h-[86vh] flex flex-col shadow-[0_35px_80px_rgba(0,0,0,0.95)] border-2 border-amber-900/60 rounded-sm bg-[#0e0b09] overflow-hidden"
          >
            {/* Realistic Page Thickness Layers on Right & Bottom */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#73634e] via-[#bfb39d] to-transparent pointer-events-none z-40 hidden sm:block" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-[#594936] to-transparent pointer-events-none z-40" />

            {/* Bronze Corner Protectors */}
            <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-amber-500/80 pointer-events-none z-40" />
            <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-amber-500/80 pointer-events-none z-40" />
            <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-amber-500/80 pointer-events-none z-40" />
            <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-amber-500/80 pointer-events-none z-40" />

            {/* Central Book Spine Valley Shadow (Two-Page Folio Fold) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/40 via-black/80 to-black/40 pointer-events-none z-30 hidden md:block" />

            {/* Hanging Silk Ribbon Bookmark from Spine */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-[#8f2828] to-[#591616] border-x border-amber-500/40 shadow-lg pointer-events-none z-40 hidden md:block"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
              }}
            />

            {/* =================================================================== */}
            {/* TOME HEADER: Gilded Parchment Header with Golden Inscription        */}
            {/* =================================================================== */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-amber-900/50 bg-[#090705] relative z-30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-amber-500/50 bg-[#16100c] flex items-center justify-center text-amber-400 shadow-sm">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-[9px] font-mono tracking-[0.35em] text-amber-500 uppercase font-semibold">
                    LIBER FACTORUM · FOLIO MMXXVI
                  </div>
                  <h2 className="text-base sm:text-xl font-serif tracking-[0.18em] text-[#f4eedb] font-bold uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    The Quest Chronicle
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Inscribe Oath Action */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 border border-amber-500/60 hover:border-amber-300 px-3.5 py-1.5 text-[9px] font-serif tracking-[0.22em] text-amber-200 hover:text-amber-100 uppercase transition bg-[#17110c] hover:bg-amber-950/60 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">INSCRIBE OATH</span>
                  <span className="sm:hidden">INSCRIBE</span>
                  <kbd className="text-[8px] font-mono text-amber-400/70 pl-1 border-l border-amber-700/40">N</kbd>
                </button>

                {/* Close Book Button */}
                <button
                  onClick={onClose}
                  aria-label="Close Quest Chronicle"
                  className="p-1.5 text-amber-200/70 hover:text-amber-100 border border-amber-900/40 hover:border-amber-500/60 transition cursor-pointer bg-[#140f0c]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* TOME NAVIGATION RIBBONS & FILTER BAR                                */}
            {/* =================================================================== */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-2.5 bg-[#0b0806] border-b border-amber-900/40 text-[10px] font-serif tracking-[0.18em] relative z-20 overflow-x-auto">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`pb-0.5 uppercase transition cursor-pointer ${
                    filter === 'all'
                      ? 'text-amber-300 font-bold border-b-2 border-amber-500'
                      : 'text-amber-100/60 hover:text-amber-200'
                  }`}
                >
                  Active Decrees ({quests.filter((q) => !q.completed).length})
                </button>
                <button
                  onClick={() => setFilter('daily')}
                  className={`pb-0.5 uppercase transition cursor-pointer ${
                    filter === 'daily'
                      ? 'text-amber-300 font-bold border-b-2 border-amber-500'
                      : 'text-amber-100/60 hover:text-amber-200'
                  }`}
                >
                  Daily Vows
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`pb-0.5 uppercase transition cursor-pointer ${
                    filter === 'completed'
                      ? 'text-amber-300 font-bold border-b-2 border-amber-500'
                      : 'text-amber-100/60 hover:text-amber-200'
                  }`}
                >
                  Sealed Triumphs ({quests.filter((q) => q.completed).length})
                </button>
              </div>

              <div className="flex items-center gap-2 text-[9px] font-mono text-amber-500/80 hidden sm:flex">
                <Feather className="w-3 h-3 text-amber-500" />
                <span>Illuminated Parchment Codex</span>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 7. QUEST ENTRIES REVEAL THEMSELVES SEQUENTIALLY (Parchment Folio)   */}
            {/* =================================================================== */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-3 bg-[#0d0a08] relative z-20"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 50% 0%, rgba(217,119,6,0.06) 0%, transparent 70%), linear-gradient(180deg, #0d0a08 0%, #100c09 100%)',
              }}
            >
              {filteredQuests.length === 0 ? (
                <div className="text-center py-20 text-amber-200/50 font-serif space-y-2">
                  <p className="text-xs tracking-widest uppercase text-amber-300/80">
                    {filter === 'completed' ? 'No Triumphs Inscribed' : 'The Inscribed Folio is Silent'}
                  </p>
                  <p className="text-[11px] font-sans text-amber-200/50 max-w-sm mx-auto italic">
                    {filter === 'completed'
                      ? 'Seal active vows on your journal pages to log triumphant conquests.'
                      : 'Carve a new decree into the vellum using "Inscribe Oath" or hotkey N.'}
                  </p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                    },
                  }}
                  className="space-y-2.5 max-w-4xl mx-auto"
                >
                  {filteredQuests.map((quest) => {
                    const sigil = ATTRIBUTE_SIGILS[quest.attribute] || {
                      rune: '✦',
                      label: 'RITE',
                      text: 'text-amber-400',
                      bg: 'border-amber-500/30',
                    };
                    const isExpanded = expandedQuestId === quest.id;

                    const isBroken = Boolean(brokenQuestMap[quest.id]);
                    const breakStage = brokenQuestMap[quest.id];

                    return (
                      <motion.div
                        key={quest.id}
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
                                opacity: isBroken ? (breakStage === 'crumbling' ? 0.25 : 0.6) : 1,
                              }
                        }
                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        onClick={() => {
                          if (!isBroken) setExpandedQuestId(isExpanded ? null : quest.id);
                        }}
                        className={`p-3.5 sm:p-4 rounded-sm border transition-all select-none relative overflow-hidden group ${
                          isBroken
                            ? 'bg-[#050403] border-stone-800/40 filter grayscale pointer-events-none'
                            : quest.completed
                            ? 'opacity-70 bg-[#080604]/80 border-amber-950/40 hover:border-amber-900/60 cursor-pointer'
                            : 'bg-[#140f0c]/90 hover:bg-[#1a1410] border-amber-900/40 hover:border-amber-500/50 shadow-sm cursor-pointer'
                        }`}
                      >
                        {/* Faint Jagged Fracture Crack Line on Oath Broken */}
                        {isBroken && (
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
                            preserveAspectRatio="none"
                          >
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

                        {/* Faint Ash Flecks on Crumbling */}
                        {(breakStage === 'crumbling' || breakStage === 'collapsing') && (
                          <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
                            {[
                              { id: 1, x: '25%', delay: 0 },
                              { id: 2, x: '45%', delay: 0.06 },
                              { id: 3, x: '65%', delay: 0.12 },
                              { id: 4, x: '80%', delay: 0.05 },
                            ].map((ash) => (
                              <motion.div
                                key={ash.id}
                                initial={{ opacity: 0.6, y: 0, scale: 1 }}
                                animate={{
                                  opacity: 0,
                                  y: -32,
                                  x: ash.id % 2 === 0 ? 10 : -10,
                                  scale: 0.2,
                                }}
                                transition={{ duration: 0.45, delay: ash.delay, ease: 'easeOut' }}
                                style={{ left: ash.x, top: '42%' }}
                                className="absolute w-1.5 h-1.5 rounded-full bg-stone-500 shadow-sm"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4 relative z-10">
                          {/* Left: Sigil & Inscribed Title */}
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <div
                              className={`w-9 h-9 rounded-full border ${
                                isBroken ? 'border-stone-800 bg-black text-stone-600' : `${sigil.bg} bg-[#090705] ${sigil.text}`
                              } flex items-center justify-center font-serif text-sm flex-shrink-0 transition-transform shadow-inner`}
                            >
                              <span>{sigil.rune}</span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[8px] font-mono tracking-widest uppercase ${
                                    isBroken ? 'text-stone-500 font-semibold' : 'text-amber-500/80'
                                  }`}
                                >
                                  {isBroken ? 'OATH FRACTURED' : sigil.label}
                                </span>
                                {quest.is_daily && !isBroken && (
                                  <span className="text-[7px] font-mono tracking-wider px-1 py-0.2 bg-amber-950/60 text-amber-300 border border-amber-600/40 uppercase">
                                    DAILY
                                  </span>
                                )}
                              </div>
                              <h3
                                className={`text-xs sm:text-sm font-serif tracking-wider uppercase font-semibold transition-colors truncate ${
                                  isBroken
                                    ? 'line-through text-stone-600'
                                    : quest.completed
                                    ? 'line-through text-stone-500'
                                    : 'text-[#f5ebd7] group-hover:text-amber-200'
                                }`}
                              >
                                {quest.title}
                              </h3>
                            </div>
                          </div>

                          {/* Right: Gilded Rewards & Wax Seal Stamp */}
                          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-3 font-mono text-[9px]">
                              <span className={`flex items-center gap-1 ${isBroken ? 'text-stone-600' : 'text-amber-300 font-semibold'}`}>
                                <Sparkles className={`w-3 h-3 ${isBroken ? 'text-stone-700' : 'text-amber-500'}`} />
                                +{quest.xp_reward} XP
                              </span>
                              <span className={`flex items-center gap-1 ${isBroken ? 'text-stone-600' : 'text-yellow-300 font-semibold'}`}>
                                <Coins className={`w-3 h-3 ${isBroken ? 'text-stone-700' : 'text-amber-500'}`} />
                                +{quest.gold_reward} G
                              </span>
                            </div>

                            {/* Tactile Wax Seal Button */}
                            <button
                              onClick={(e) => handleSealClick(e, quest)}
                              disabled={quest.completed || isBroken}
                              aria-label={`Seal oath: ${quest.title}`}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-md ${
                                isBroken
                                  ? 'opacity-20 border-stone-800 bg-black cursor-not-allowed'
                                  : quest.completed
                                  ? 'bg-[#591616] text-amber-300 border-amber-600/60'
                                  : 'bg-[#1a110a] border-amber-600/50 text-amber-300 hover:border-amber-400 hover:bg-[#8f2828] hover:scale-110 active:scale-95 cursor-pointer'
                              }`}
                              title={quest.completed ? 'Oath Consecrated' : 'Affix Wax Seal'}
                            >
                              {quest.completed ? (
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                <span className="text-[10px] font-serif font-bold text-amber-300">✦</span>
                              )}
                            </button>

                            {/* Erase Inscription / Break Oath / Purge Triumph */}
                            <button
                              onClick={(e) => handleDeleteQuest(e, quest.id)}
                              disabled={isBroken}
                              className={`p-1.5 rounded transition-all cursor-pointer ${
                                quest.completed
                                  ? 'opacity-60 hover:opacity-100 text-stone-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50'
                                  : 'opacity-0 group-hover:opacity-100 text-stone-500 hover:text-amber-200 hover:bg-stone-900/40'
                              }`}
                              title={quest.completed ? "Purge Triumph from Folio" : "Fracture Oath (Break Inscription)"}
                              aria-label={quest.completed ? "Purge triumph" : "Break oath"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <span className="text-amber-500/60 text-[10px]">
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Inscription Lore */}
                        <AnimatePresence>
                          {isExpanded && quest.description && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 pt-2 text-[11px] text-[#e0d6c1] pl-3 border-l-2 border-amber-600/40 font-sans italic leading-relaxed bg-[#0a0806]/70 p-2.5 rounded-r"
                            >
                              <span className="text-[9px] font-serif uppercase tracking-widest text-amber-400 block mb-1 not-italic font-semibold">
                                Inscribed Covenant Decree:
                              </span>
                              "{quest.description}"
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* =================================================================== */}
            {/* TOME FOOTER: Ancient Monastic Colophon                              */}
            {/* =================================================================== */}
            <div className="px-5 sm:px-8 py-2.5 border-t border-amber-900/40 bg-[#090705] flex items-center justify-between text-[9px] font-serif tracking-[0.22em] text-amber-500/80 uppercase relative z-30">
              <span className="truncate pr-2">☽ What is inscribed into vellum is sovereign and eternal ☾</span>
              <button
                onClick={onClose}
                className="text-amber-300 hover:text-amber-100 uppercase transition cursor-pointer font-bold whitespace-nowrap"
              >
                Close Tome [ESC]
              </button>
            </div>
          </motion.div>
        )}
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
