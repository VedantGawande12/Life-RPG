import { CharacterProfile } from './user';
import { Quest } from './quest';
import { ShopItem } from './economy';

export interface LevelUpEvent {
  newLevel: number;
  unlockedTitle?: string;
  bonusStatPoints?: number;
}

export interface QuestCompleteResult {
  quest: Quest;
  profile: CharacterProfile;
  leveledUp: boolean;
  newLevel?: number;
  xpEarned: number;
  goldEarned: number;
}

export interface PurchaseResult {
  item: ShopItem;
  remainingGold: number;
}
