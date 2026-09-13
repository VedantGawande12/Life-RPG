import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle, Sparkles, Coins, Feather, Check } from 'lucide-react';
import { AttributeType, Difficulty, Quest } from '../../types';
import { playRuneScribeSound, playWaxStampSound, playPageTurnSound } from '../economy/SoundEffects';
import { useGameState } from '../core/GameStateContext';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quest: Omit<Quest, 'id' | 'streak_count' | 'completed'>) => Promise<void>;
}

const ATTRIBUTES: { type: AttributeType; rune: string; label: string; rite: string; color: string; border: string }[] = [
  { type: 'Strength', rune: '⚔', label: 'WAR RITE', rite: 'Strength', color: 'text-red-400', border: 'border-red-500/50' },
  { type: 'Intellect', rune: '👁', label: 'OCCULT RITE', rite: 'Intellect', color: 'text-sky-400', border: 'border-sky-500/50' },
  { type: 'Charisma', rune: '👑', label: 'IMPERIAL RITE', rite: 'Charisma', color: 'text-purple-400', border: 'border-purple-500/50' },
  { type: 'Creativity', rune: '⚗', label: 'ALCHEMICAL RITE', rite: 'Creativity', color: 'text-emerald-400', border: 'border-emerald-500/50' },
];

const DIFFICULTY_PRESETS: { diff: Difficulty; xp: number; gold: number }[] = [
  { diff: 'Trivial', xp: 25, gold: 5 },
  { diff: 'Easy', xp: 50, gold: 10 },
  { diff: 'Medium', xp: 100, gold: 25 },
  { diff: 'Hard', xp: 250, gold: 60 },
  { diff: 'Epic', xp: 500, gold: 150 },
];

export const QuestModal: React.FC<QuestModalProps> = ({ isOpen, onClose, onSave }) => {
  const { isMuted } = useGameState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState<AttributeType>('Intellect');
  const [xpReward, setXpReward] = useState<number>(100);
  const [isDaily, setIsDaily] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 7-Stage Submission Progression:
  // 'editing'
  // -> 'ink-writing' (1. Ink appears + 2. Title written onto parchment)
  // -> 'rune-stamped' (3. Attribute rune stamps onto page)
  // -> 'xp-revealed' (4. XP reward appears)
  // -> 'wax-sealed' (5. Wax seal closes inscription)
  // -> 'folding' (6. Parchment folds/slides into Chronicle)
  // -> 'completed' (7. New quest appears in quest list)
  const [submitStage, setSubmitStage] = useState<
    'editing' | 'ink-writing' | 'rune-stamped' | 'xp-revealed' | 'wax-sealed' | 'folding' | 'completed'
  >('editing');

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setAttribute('Intellect');
      setXpReward(100);
      setIsDaily(true);
      setErrorMessage('');
      setSubmitStage('editing');
      setTimeout(() => titleInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && submitStage === 'editing') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, submitStage]);

  if (!isOpen) return null;

  const currentSigil = ATTRIBUTES.find((a) => a.type === attribute) || ATTRIBUTES[1];
  const goldReward = Math.max(5, Math.floor(xpReward * 0.25));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Oath inscription cannot be void. Name your sacred decree.');
      titleInputRef.current?.focus();
      return;
    }

    // Begin the 7-Step Inscription Animation Sequence
    setSubmitStage('ink-writing');
    if (!isMuted) {
      playRuneScribeSound();
    }

    // Step 3: Attribute rune stamps onto page (280ms)
    setTimeout(() => {
      setSubmitStage('rune-stamped');
      if (!isMuted) {
        playRuneScribeSound();
      }
    }, 280);

    // Step 4: XP reward appears (460ms)
    setTimeout(() => {
      setSubmitStage('xp-revealed');
    }, 460);

    // Step 5: Wax seal closes the inscription (640ms)
    setTimeout(() => {
      setSubmitStage('wax-sealed');
      if (!isMuted) {
        playWaxStampSound();
      }
    }, 640);

    // Step 6: Parchment folds/slides into the Quest Chronicle (900ms)
    setTimeout(() => {
      setSubmitStage('folding');
      if (!isMuted) {
        playPageTurnSound();
      }
    }, 920);

    // Step 7: New quest saved and appears in quest list (1260ms)
    setTimeout(async () => {
      try {
        await onSave({
          title: trimmedTitle,
          description: description.trim(),
          attribute,
          difficulty: xpReward >= 400 ? 'Epic' : xpReward >= 200 ? 'Hard' : xpReward >= 100 ? 'Medium' : 'Easy',
          xp_reward: xpReward,
          gold_reward: goldReward,
          is_daily: isDaily,
        });
        setSubmitStage('completed');
        onClose();
      } catch {
        setErrorMessage('Failed to bind inscription to the Chronicle.');
        setSubmitStage('editing');
      }
    }, 1260);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-hidden">
      {/* Background Radial Sanctuary Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 via-transparent to-black pointer-events-none" />

      {/* ========================================================================= */}
      {/* THE ANCIENT PARCHMENT INSCRIPTION SURFACE                                 */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={
          submitStage === 'folding'
            ? { scaleY: 0.18, rotateX: 55, y: 220, opacity: 0 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: submitStage === 'folding' ? 0.45 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-xl bg-[#14100c] border-2 border-amber-900/70 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] rounded-sm text-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inscribe-decree-title"
      >
        {/* Worn Parchment Texture & Gilded Margins */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(245,158,11,0.08) 0%, transparent 60%), linear-gradient(180deg, #18130e 0%, #0e0a07 100%)',
          }}
        />

        {/* Four Cast-Bronze Heavy Corner Weights */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-500/80 pointer-events-none z-30" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-500/80 pointer-events-none z-30" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-500/80 pointer-events-none z-30" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-500/80 pointer-events-none z-30" />

        {/* Parchment Deckled Edge Shadow Borders */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent pointer-events-none" />

        {/* ======================================================================= */}
        {/* PARCHMENT HEADER                                                        */}
        {/* ======================================================================= */}
        <div className="flex items-center justify-between pb-3.5 border-b border-amber-900/50 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-[#0c0906] flex items-center justify-center text-amber-400 shadow-sm">
              <Feather className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-[0.35em] text-amber-500 uppercase font-semibold">
                RITUAL OF INSCRIPTION · FOLIO SACRA
              </div>
              <h2
                id="inscribe-decree-title"
                className="text-lg sm:text-2xl font-serif tracking-[0.14em] text-[#f4eedb] font-bold uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                Inscribe Sacred Decree
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitStage !== 'editing'}
            aria-label="Dismiss inscription"
            className="p-1.5 text-amber-200/60 hover:text-amber-100 border border-transparent hover:border-amber-500/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-serif tracking-wider uppercase flex items-center gap-2 relative z-20 shadow-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* ACCESSIBLE, KEYBOARD-FRIENDLY INSCRIPTION FORM                         */}
        {/* ======================================================================= */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 relative z-20">
          {/* 1. Quest Name / Trial Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="quest-title-input"
                className="text-[9px] font-serif tracking-[0.22em] text-amber-300 uppercase font-bold"
              >
                Covenant Oath Title <span className="text-amber-400">*</span>
              </label>
              <span className="text-[8px] font-mono text-amber-500/60 uppercase">Max 100 runes</span>
            </div>
            <input
              id="quest-title-input"
              ref={titleInputRef}
              type="text"
              required
              disabled={submitStage !== 'editing'}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. Master the architecture of the arcane core"
              className="w-full px-3.5 py-2.5 bg-[#0a0705] border border-amber-900/60 text-[#f5ebd7] placeholder-stone-600 text-xs sm:text-sm font-serif tracking-wider focus:outline-none focus:border-amber-400 transition shadow-inner"
              maxLength={100}
            />
          </div>

          {/* 2. Inscribed Lore & Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="quest-desc-input"
                className="text-[9px] font-serif tracking-[0.22em] text-amber-300/90 uppercase font-bold"
              >
                Inscribed Lore & Covenant Criteria <span className="text-stone-500 font-sans font-normal">(optional)</span>
              </label>
              <span className="text-[8px] font-mono text-amber-500/60 uppercase">Ruled Lines</span>
            </div>
            <textarea
              id="quest-desc-input"
              disabled={submitStage !== 'editing'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the immutable conditions required to seal this decree..."
              rows={2}
              className="w-full px-3.5 py-2 bg-[#0a0705] border border-amber-900/60 text-[#e6ddc8] placeholder-stone-600 text-xs font-sans leading-relaxed focus:outline-none focus:border-amber-400 transition resize-none shadow-inner"
              maxLength={250}
            />
          </div>

          {/* 3. Target Discipline Attribute Selection */}
          <div>
            <label className="block text-[9px] font-serif tracking-[0.22em] text-amber-300 uppercase mb-1.5 font-bold">
              Target Discipline (Sacred Rite)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ATTRIBUTES.map((attr) => {
                const isSelected = attribute === attr.type;
                return (
                  <button
                    key={attr.type}
                    type="button"
                    disabled={submitStage !== 'editing'}
                    onClick={() => setAttribute(attr.type)}
                    className={`flex items-center gap-2 p-2.5 border text-[10px] font-serif tracking-wider uppercase transition cursor-pointer ${
                      isSelected
                        ? `${attr.border} bg-amber-950/60 text-amber-100 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]`
                        : 'border-amber-950/40 bg-[#090604] text-stone-400 hover:text-stone-200 hover:border-amber-900/60'
                    }`}
                  >
                    <span className={`text-base font-bold ${attr.color}`}>{attr.rune}</span>
                    <span className="truncate">{attr.rite}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. XP Reward & Severity Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="xp-reward-input"
                className="text-[9px] font-serif tracking-[0.22em] text-amber-300 uppercase font-bold"
              >
                Triumph Bounty (XP & Gold)
              </label>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />+{xpReward} XP
                </span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />+{goldReward} G
                </span>
              </div>
            </div>

            {/* Quick Difficulty Preset Ribbons */}
            <div className="grid grid-cols-5 gap-1 mb-2 bg-[#090604] border border-amber-950/60 p-1">
              {DIFFICULTY_PRESETS.map((preset) => (
                <button
                  key={preset.diff}
                  type="button"
                  disabled={submitStage !== 'editing'}
                  onClick={() => setXpReward(preset.xp)}
                  className={`py-1 text-[9px] font-serif tracking-wider uppercase transition cursor-pointer text-center ${
                    xpReward === preset.xp
                      ? 'bg-amber-950/80 border border-amber-500/70 text-amber-200 font-bold shadow-sm'
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {preset.diff}
                </button>
              ))}
            </div>

            {/* Custom XP Reward Stepper / Slider */}
            <div className="flex items-center gap-3">
              <input
                id="xp-reward-input"
                type="range"
                min="20"
                max="600"
                step="10"
                disabled={submitStage !== 'editing'}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="flex-1 accent-amber-500 h-1 bg-stone-800 rounded cursor-pointer"
              />
              <span className="font-mono text-xs text-amber-400 w-14 text-right font-bold">
                {xpReward} XP
              </span>
            </div>
          </div>

          {/* Daily Habit Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isDaily}
              disabled={submitStage !== 'editing'}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="rounded-none border-amber-700/50 bg-[#090604] text-amber-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[10px] text-stone-300 font-serif tracking-wider uppercase">
              Consecrated Daily Vow (Maintains Bonfire Vigil Streak)
            </span>
          </label>

          {/* ===================================================================== */}
          {/* ACTION BUTTONS & PREVIEW                                              */}
          {/* ===================================================================== */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-900/50">
            <button
              type="button"
              onClick={onClose}
              disabled={submitStage !== 'editing'}
              className="px-4 py-2 text-[9px] font-serif tracking-[0.2em] text-stone-400 hover:text-stone-200 uppercase transition cursor-pointer"
            >
              Cancel [ESC]
            </button>

            <button
              type="submit"
              disabled={submitStage !== 'editing'}
              className="px-6 py-2.5 text-[9px] font-serif tracking-[0.25em] uppercase transition cursor-pointer border border-amber-500/80 text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 flex items-center gap-2 shadow-rune-gold active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>{submitStage === 'editing' ? 'INSCRIBE DECREE [ENTER]' : 'SEALING BINDING...'}</span>
            </button>
          </div>
        </form>

        {/* ======================================================================= */}
        {/* 1 - 5. INK, RUNE, XP & WAX SEAL SUBMISSION OVERLAY                      */}
        {/* Animated directly on top of the parchment when submitted                */}
        {/* ======================================================================= */}
        <AnimatePresence>
          {submitStage !== 'editing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#120d09]/95 z-40 flex flex-col items-center justify-center p-8 text-center"
            >
              {/* 1. Animated Wet Ink Calligraphy Stroke */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6 shadow-rune-gold"
              />

              {/* 2. Quest Title Written in Gold Leaf Typography */}
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-1 max-w-md"
              >
                <span className="text-[9px] font-mono tracking-[0.3em] text-amber-500 uppercase font-semibold">
                  DECREE INSCRIBED
                </span>
                <h3 className="text-lg sm:text-xl font-serif tracking-widest text-[#f5ebd7] font-bold uppercase">
                  "{title}"
                </h3>
              </motion.div>

              {/* 3 & 4. Attribute Rune Stamps Down + XP Bounty Appears */}
              {(submitStage === 'rune-stamped' ||
                submitStage === 'xp-revealed' ||
                submitStage === 'wax-sealed' ||
                submitStage === 'folding') && (
                <motion.div
                  initial={{ scale: 2.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="mt-6 flex items-center justify-center gap-6"
                >
                  {/* Stamped Attribute Rune Badge */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 ${currentSigil.border} bg-[#070503] flex items-center justify-center text-xl font-serif ${currentSigil.color} shadow-rune-gold`}
                  >
                    <span>{currentSigil.rune}</span>
                  </div>

                  {/* 4. XP Bounty Revealed */}
                  {(submitStage === 'xp-revealed' ||
                    submitStage === 'wax-sealed' ||
                    submitStage === 'folding') && (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-sm text-amber-300 font-bold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>+{xpReward} XP BOUNTY</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* 5. Crimson Wax Seal Drops Down and Closes Inscription */}
              {(submitStage === 'wax-sealed' || submitStage === 'folding') && (
                <motion.div
                  initial={{ scale: 3.5, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                  className="mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#591616] via-[#8f2828] to-[#591616] border-2 border-amber-500/70 flex items-center justify-center shadow-[0_0_25px_rgba(143,40,40,0.8)]"
                >
                  <div className="w-10 h-10 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-300 font-serif text-sm">
                    <Check className="w-6 h-6 text-amber-200 stroke-[3]" />
                  </div>
                </motion.div>
              )}

              {/* Status Note */}
              <div className="mt-6 text-[9px] font-serif tracking-[0.25em] text-amber-400/80 uppercase">
                <span>Binding to the Eternal Chronicle...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
