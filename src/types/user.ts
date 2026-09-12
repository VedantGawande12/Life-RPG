export interface Attributes {
  strength: number;
  intellect: number;
  charisma: number;
  creativity: number;
}

export type AttributeKey = keyof Attributes;

export interface CharacterProfile {
  id: string;
  username: string;
  avatar_url?: string;
  title: string;
  level: number;
  xp: number;
  gold: number;
  streak: number;
  last_active_date: string;
  stats: Attributes;
  equipped_theme: string;
  equipped_badge: string;
  created_at?: string;
  updated_at?: string;
}
