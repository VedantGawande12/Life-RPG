export type AttributeType = 'Strength' | 'Intellect' | 'Charisma' | 'Creativity';

export type Difficulty = 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Epic';

export interface Quest {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  attribute: AttributeType;
  difficulty: Difficulty;
  xp_reward: number;
  gold_reward: number;
  completed: boolean;
  completed_at?: string | null;
  due_date?: string | null;
  streak_count: number;
  is_daily: boolean;
  created_at?: string;
}

export type QuestFilter = 'all' | 'daily' | 'Strength' | 'Intellect' | 'Charisma' | 'Creativity' | 'completed';
