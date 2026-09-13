import { 
  getXpRequiredForLevel, 
  calculateLevelProgress, 
  getDifficultyRewards, 
  calculateStreakMultiplier,
  getRankTitleForLevel 
} from '../rpgEngine';

// Quick verification assertion runner
export function runRpgEngineVerification() {
  console.log('Running RPG Engine Verification Tests...');

  // 1. XP Curve Tests
  const xpLevel1 = getXpRequiredForLevel(1);
  const xpLevel2 = getXpRequiredForLevel(2);
  const xpLevel5 = getXpRequiredForLevel(5);
  
  if (xpLevel1 !== 100) throw new Error(`Level 1 XP should be 100, got ${xpLevel1}`);
  if (xpLevel2 !== 303) throw new Error(`Level 2 XP should be 303, got ${xpLevel2}`);
  if (xpLevel5 !== 1313) throw new Error(`Level 5 XP should be 1313, got ${xpLevel5}`);

  // 2. Level Progress % Tests
  const progress0 = calculateLevelProgress(0, 1);
  const progress50 = calculateLevelProgress(50, 1);
  const progress100 = calculateLevelProgress(100, 1);
  
  if (progress0 !== 0) throw new Error(`Progress 0 should be 0, got ${progress0}`);
  if (progress50 !== 50) throw new Error(`Progress 50 should be 50, got ${progress50}`);
  if (progress100 !== 100) throw new Error(`Progress 100 should be 100, got ${progress100}`);

  // 3. Difficulty Rewards Tests
  const easy = getDifficultyRewards('Easy');
  const hard = getDifficultyRewards('Hard');
  const epic = getDifficultyRewards('Epic');

  if (easy.xp !== 25 || easy.gold !== 15) throw new Error('Easy rewards mismatch');
  if (hard.xp !== 50 || hard.gold !== 40) throw new Error('Hard rewards mismatch');
  if (epic.xp !== 80 || epic.gold !== 70) throw new Error('Epic rewards mismatch');

  // 4. Streak Multiplier Tests
  const mult1 = calculateStreakMultiplier(1);
  const mult5 = calculateStreakMultiplier(5);
  const mult20 = calculateStreakMultiplier(20);

  if (mult1 !== 1.0) throw new Error(`Streak 1 mult should be 1.0, got ${mult1}`);
  if (mult5 !== 1.2) throw new Error(`Streak 5 mult should be 1.2, got ${mult5}`);
  if (mult20 !== 1.95) throw new Error(`Streak 20 mult should be 1.95, got ${mult20}`);

  // 5. Rank Titles
  if (getRankTitleForLevel(1) !== 'Novice Adventurer') throw new Error('Rank title L1 mismatch');
  if (getRankTitleForLevel(10) !== 'Elite Vanguard') throw new Error('Rank title L10 mismatch');
  if (getRankTitleForLevel(30) !== 'Grand Cyber-Mage') throw new Error('Rank title L30 mismatch');

  console.log('✅ All RPG Engine Verification Tests Passed!');
  return true;
}

// Auto-run if executed directly
runRpgEngineVerification();
