import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CharacterProfile, 
  Quest, 
  ShopItem, 
  InventoryItem, 
  LevelUpEvent,
  AttributeKey 
} from '../../types';
import { INITIAL_PROFILE, SEED_QUESTS, SHOP_ITEMS } from './initialData';
import { getXpRequiredForLevel, calculateStreak } from './rpgEngine';
import { supabase, isSupabaseConfigured } from './supabaseClient';

interface GameStateContextType {
  profile: CharacterProfile;
  quests: Quest[];
  inventory: InventoryItem[];
  shopItems: ShopItem[];
  isLoading: boolean;
  activeLevelUp: LevelUpEvent | null;
  dismissLevelUp: () => void;
  addQuest: (questData: Omit<Quest, 'id' | 'streak_count' | 'completed'>) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  buyItem: (item: ShopItem) => boolean;
  equipItem: (inventoryId: string) => void;
  allocateStatPoint: (attr: AttributeKey) => boolean;
  isMuted: boolean;
  toggleMute: () => void;
  isSupabaseActive: boolean;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

const STORAGE_KEYS = {
  PROFILE: 'liferpg_profile',
  QUESTS: 'liferpg_quests',
  INVENTORY: 'liferpg_inventory',
  SOUND_MUTED: 'liferpg_muted',
};

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CharacterProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return saved ? JSON.parse(saved) : SEED_QUESTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [shopItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [isLoading] = useState<boolean>(false);
  const [activeLevelUp, setActiveLevelUp] = useState<LevelUpEvent | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  });

  // Save to local storage for instant persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(isMuted));
  }, [isMuted]);

  const toggleMute = () => setIsMuted(prev => !prev);
  const dismissLevelUp = () => setActiveLevelUp(null);

  // Sync state from Supabase when authenticated
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchUserData = async (userId: string) => {
      setIsLoading(true);
      try {
        // Fetch Profile
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileData && !profileErr) {
          setProfile({
            id: profileData.id,
            username: profileData.username,
            title: profileData.title,
            level: profileData.level,
            xp: profileData.xp,
            gold: profileData.gold,
            streak: profileData.streak,
            last_active_date: profileData.last_active_date,
            stats: {
              strength: profileData.strength ?? 10,
              intellect: profileData.intellect ?? 10,
              charisma: profileData.charisma ?? 10,
              creativity: profileData.creativity ?? 10,
            },
            stat_points: profileData.stat_points ?? 0,
            equipped_theme: profileData.equipped_theme ?? 'dark_fantasy',
            equipped_badge: profileData.equipped_badge ?? 'Novice',
          });
        }

        // Fetch Quests
        const { data: questData, error: questErr } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (questData && !questErr) {
          setQuests(questData as Quest[]);
        }

        // Fetch Inventory
        const { data: invData, error: invErr } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', userId);

        if (invData && !invErr) {
          setInventory(invData as InventoryItem[]);
        }
      } catch (err) {
        console.warn('Error fetching Supabase user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Optimistic Quest Addition
  const addQuest = useCallback(async (questData: Omit<Quest, 'id' | 'streak_count' | 'completed'>) => {
    const tempId = 'quest_' + Date.now();
    const newQuest: Quest = {
      ...questData,
      id: tempId,
      completed: false,
      streak_count: 0,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setQuests(prev => [newQuest, ...prev]);

    // Async sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: inserted, error } = await supabase
            .from('quests')
            .insert([{
              user_id: user.id,
              title: newQuest.title,
              description: newQuest.description,
              attribute: newQuest.attribute,
              difficulty: newQuest.difficulty,
              xp_reward: newQuest.xp_reward,
              gold_reward: newQuest.gold_reward,
              is_daily: newQuest.is_daily,
            }])
            .select('*')
            .single();

          if (inserted && !error) {
            setQuests(prev => prev.map(q => q.id === tempId ? (inserted as Quest) : q));
          } else if (error) {
            console.error('Supabase quest insert error:', error);
          }
        }
      } catch (err) {
        console.warn('Supabase sync warning (addQuest):', err);
      }
    }
  }, []);

  // Optimistic Quest Completion & RPG Progression Loop
  const completeQuest = useCallback(async (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || quest.completed) return;

    let updatedProfile = profile;

    // 1. Mark quest completed optimistically
    setQuests(prev => prev.map(q => 
      q.id === id 
        ? { ...q, completed: true, completed_at: new Date().toISOString(), streak_count: q.streak_count + 1 }
        : q
    ));

    // 2. Calculate new progression stats
    setProfile(prev => {
      const { newStreak, todayFormatted } = calculateStreak(prev.last_active_date, prev.streak);
      let newXp = prev.xp + quest.xp_reward;
      const newGold = prev.gold + quest.gold_reward;
      let newLevel = prev.level;
      let didLevelUp = false;

      // Non-linear leveling loop
      let needed = getXpRequiredForLevel(newLevel);
      while (newXp >= needed) {
        newXp -= needed;
        newLevel += 1;
        didLevelUp = true;
        needed = getXpRequiredForLevel(newLevel);
      }

      // Attribute Stat Boost (+2 in the relevant attribute)
      const newStats = { ...prev.stats };
      const attrKey = quest.attribute.toLowerCase() as keyof typeof newStats;
      if (attrKey in newStats) {
        newStats[attrKey] += 2;
      }

      if (didLevelUp) {
        setActiveLevelUp({
          newLevel,
          bonusStatPoints: 2,
        });
      }

      updatedProfile = {
        ...prev,
        xp: newXp,
        gold: newGold,
        level: newLevel,
        streak: newStreak,
        last_active_date: todayFormatted,
        stats: newStats,
        stat_points: didLevelUp ? (prev.stat_points || 0) + 2 : (prev.stat_points || 0),
      };
      return updatedProfile;
    });

    // 3. Supabase RPC & Profile sync
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (id.startsWith('quest_')) {
            await supabase.from('quests').update({
              completed: true,
              completed_at: new Date().toISOString(),
            }).eq('user_id', user.id).eq('title', quest.title);
          } else {
            await supabase.rpc('complete_quest', { quest_id: id }).catch(async () => {
              await supabase.from('quests').update({
                completed: true,
                completed_at: new Date().toISOString(),
              }).eq('id', id);
            });
          }

          await supabase.from('profiles').update({
            xp: updatedProfile.xp,
            gold: updatedProfile.gold,
            level: updatedProfile.level,
            streak: updatedProfile.streak,
            strength: updatedProfile.stats.strength,
            intellect: updatedProfile.stats.intellect,
            charisma: updatedProfile.stats.charisma,
            creativity: updatedProfile.stats.creativity,
            stat_points: updatedProfile.stat_points ?? 0,
            last_active_date: updatedProfile.last_active_date,
            updated_at: new Date().toISOString(),
          }).eq('id', user.id);
        }
      } catch (err) {
        console.warn('Supabase complete_quest warning:', err);
      }
    }
  }, [quests, profile]);

  // Delete Quest
  const deleteQuest = useCallback(async (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('quests').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
  }, []);

  // Purchase item in shop
  const buyItem = useCallback((item: ShopItem): boolean => {
    if (profile.gold < item.cost) {
      return false;
    }

    setProfile(prev => ({
      ...prev,
      gold: prev.gold - item.cost,
      xp: item.category === 'potion' && item.stat_boost?.xp 
        ? prev.xp + item.stat_boost.xp 
        : prev.xp,
      stats: {
        ...prev.stats,
        strength: prev.stats.strength + (item.stat_boost?.strength || 0),
        intellect: prev.stats.intellect + (item.stat_boost?.intellect || 0),
        charisma: prev.stats.charisma + (item.stat_boost?.charisma || 0),
        creativity: prev.stats.creativity + (item.stat_boost?.creativity || 0),
      }
    }));

    const newInventoryItem: InventoryItem = {
      id: 'inv_' + Date.now(),
      item_id: item.id,
      item_data: item,
      equipped: false,
      purchased_at: new Date().toISOString(),
    };

    setInventory(prev => [newInventoryItem, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from('inventory').insert([{
            user_id: user.id,
            item_id: item.id,
            item_data: item,
            equipped: false,
          }]);
          supabase.from('profiles').update({
            gold: profile.gold - item.cost,
            strength: profile.stats.strength + (item.stat_boost?.strength || 0),
            intellect: profile.stats.intellect + (item.stat_boost?.intellect || 0),
            charisma: profile.stats.charisma + (item.stat_boost?.charisma || 0),
            creativity: profile.stats.creativity + (item.stat_boost?.creativity || 0),
          }).eq('id', user.id);
        }
      });
    }

    return true;
  }, [profile.gold, profile.stats]);

  // Equip item
  const equipItem = useCallback((inventoryId: string) => {
    setInventory(prev => prev.map(inv => {
      if (inv.id === inventoryId) {
        const willEquip = !inv.equipped;
        if (willEquip && inv.item_data.category === 'title') {
          setProfile(p => ({ ...p, title: inv.item_data.name.replace('Title: ', '') }));
        } else if (willEquip && inv.item_data.category === 'theme') {
          setProfile(p => ({ ...p, equipped_theme: inv.item_data.id }));
        }
        return { ...inv, equipped: willEquip };
      }
      return inv;
    }));
  }, []);

  // Allocate stat point
  const allocateStatPoint = useCallback((attr: AttributeKey): boolean => {
    if (!profile.stat_points || profile.stat_points <= 0) return false;
    setProfile(prev => ({
      ...prev,
      stat_points: (prev.stat_points || 1) - 1,
      stats: {
        ...prev.stats,
        [attr]: prev.stats[attr] + 1,
      },
    }));
    return true;
  }, [profile.stat_points]);

  return (
    <GameStateContext.Provider value={{
      profile,
      quests,
      inventory,
      shopItems,
      isLoading,
      activeLevelUp,
      dismissLevelUp,
      addQuest,
      completeQuest,
      deleteQuest,
      buyItem,
      equipItem,
      allocateStatPoint,
      isMuted,
      toggleMute,
      isSupabaseActive: isSupabaseConfigured,
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
