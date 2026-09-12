export type ItemCategory = 'potion' | 'equipment' | 'title' | 'theme';
export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  cost: number;
  icon: string;
  stat_boost?: Record<string, number>;
  rarity: ItemRarity;
}

export interface InventoryItem {
  id: string;
  user_id?: string;
  item_id: string;
  item_data: ShopItem;
  equipped: boolean;
  purchased_at?: string;
}
