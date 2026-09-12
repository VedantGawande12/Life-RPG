import { Difficulty, AttributeType, Attributes } from '../../types';

/**
 * Non-linear RPG XP curve:
 * Each subsequent level requires progressively more XP than the last.
 * Formula: floor(100 * (level ^ 1.6))
 */
export function getXpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.6));
}

/**
 * Calculate level progress percentage (0 to 100)
 */
export function calculateLevelProgress(xp: number, level: number): number {
  const needed = getXpRequiredForLevel(level);
  if (needed <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((xp / needed) * 100)));
}

/**
 * Calculate streak update based on last completed activity date
 */
export function calculateStreak(lastActiveDate: string | null, currentStreak: number): {
  newStreak: number;
  todayFormatted: string;
} {
  const now = new Date();
  const todayFormatted = now.toISOString().split('T')[0];

  if (!lastActiveDate) {
    return { newStreak: 1, todayFormatted };
  }

  if (lastActiveDate === todayFormatted) {
    // Already completed something today; streak maintained
    return { newStreak: currentStreak, todayFormatted };
  }

  const lastDate = new Date(lastActiveDate);
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, todayFormatted };
  } else {
    // Broken streak
    return { newStreak: 1, todayFormatted };
  }
}

/**
 * Rewards according to difficulty level
 */
export function getDifficultyRewards(difficulty: Difficulty): { xp: number; gold: number } {
  switch (difficulty) {
    case 'Trivial':
      return { xp: 15, gold: 10 };
    case 'Easy':
      return { xp: 25, gold: 15 };
    case 'Medium':
      return { xp: 35, gold: 25 };
    case 'Hard':
      return { xp: 50, gold: 40 };
    case 'Epic':
      return { xp: 80, gold: 70 };
    default:
      return { xp: 25, gold: 15 };
  }
}

/**
 * Get color associated with RPG Attribute
 */
export function getAttributeColor(attribute: AttributeType): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (attribute) {
    case 'Strength':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        glow: 'shadow-glow-strength',
      };
    case 'Intellect':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        glow: 'shadow-glow-intellect',
      };
    case 'Charisma':
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        glow: 'shadow-glow-charisma',
      };
    case 'Creativity':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-glow-creativity',
      };
  }
}

/**
 * Calculate streak reward multiplier (1.0x up to 2.0x max for 20+ streak days)
 */
export function calculateStreakMultiplier(streak: number): number {
  if (streak <= 1) return 1.0;
  // +5% bonus per consecutive day, max 100% bonus (+1.0)
  const bonus = Math.min(1.0, (streak - 1) * 0.05);
  return Number((1.0 + bonus).toFixed(2));
}

/**
 * Get class rank title based on character level
 */
export function getRankTitleForLevel(level: number): string {
  if (level >= 30) return 'Grand Cyber-Mage';
  if (level >= 20) return 'Arch-Paladin of Order';
  if (level >= 15) return 'Master Codeblade';
  if (level >= 10) return 'Elite Vanguard';
  if (level >= 5) return 'Apprentice Adventurer';
  return 'Novice Adventurer';
}

