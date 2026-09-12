-- ==============================================================================
-- LIFE RPG: SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & CHARACTER PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL DEFAULT 'Hero of Light',
    avatar_url TEXT DEFAULT '',
    title TEXT NOT NULL DEFAULT 'Novice Adventurer',
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    gold INTEGER NOT NULL DEFAULT 50 CHECK (gold >= 0),
    streak INTEGER NOT NULL DEFAULT 1 CHECK (streak >= 0),
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Core RPG Attributes
    strength INTEGER NOT NULL DEFAULT 10 CHECK (strength >= 0),
    intellect INTEGER NOT NULL DEFAULT 10 CHECK (intellect >= 0),
    charisma INTEGER NOT NULL DEFAULT 10 CHECK (charisma >= 0),
    creativity INTEGER NOT NULL DEFAULT 10 CHECK (creativity >= 0),
    
    -- Customization
    equipped_theme TEXT NOT NULL DEFAULT 'dark_fantasy',
    equipped_badge TEXT NOT NULL DEFAULT 'Novice',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. QUESTS (TASKS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    description TEXT DEFAULT '',
    attribute TEXT NOT NULL CHECK (attribute IN ('Strength', 'Intellect', 'Charisma', 'Creativity')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Trivial', 'Easy', 'Medium', 'Hard', 'Epic')),
    xp_reward INTEGER NOT NULL CHECK (xp_reward >= 0),
    gold_reward INTEGER NOT NULL CHECK (gold_reward >= 0),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    streak_count INTEGER NOT NULL DEFAULT 0 CHECK (streak_count >= 0),
    is_daily BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Index for querying quests by user and status
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON public.quests(user_id, completed);

-- Enable RLS on quests
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quests" 
    ON public.quests FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests" 
    ON public.quests FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests" 
    ON public.quests FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quests" 
    ON public.quests FOR DELETE 
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. SHOP ITEMS (ARMORY CATALOG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shop_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('potion', 'equipment', 'title', 'theme')),
    cost INTEGER NOT NULL CHECK (cost >= 0),
    icon TEXT NOT NULL,
    stat_boost JSONB DEFAULT '{}'::JSONB,
    rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS on shop_items (Publicly viewable by any authenticated user)
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop items" 
    ON public.shop_items FOR SELECT 
    TO authenticated, anon
    USING (true);

-- ------------------------------------------------------------------------------
-- 4. USER INVENTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
    item_data JSONB NOT NULL,
    equipped BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS on inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory" 
    ON public.inventory FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory" 
    ON public.inventory FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory" 
    ON public.inventory FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory" 
    ON public.inventory FOR DELETE 
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. TRIGGER: AUTO-CREATE PROFILE & SEED 4 REAL-WORLD TASKS ON USER SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Insert character profile
    INSERT INTO public.profiles (id, username, title, level, xp, gold, streak, strength, intellect, charisma, creativity)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'Adventurer'),
        'Novice Adventurer',
        1,
        0,
        50,
        1,
        10,
        10,
        10,
        10
    );

    -- 2. Seed 4 real-world gamified tasks mandated by Life RPG Hackathon:
    INSERT INTO public.quests (user_id, title, description, attribute, difficulty, xp_reward, gold_reward, is_daily)
    VALUES 
        (NEW.id, 'Complete strength training', 'Build physical fortitude and discipline at the gym.', 'Strength', 'Medium', 35, 25, TRUE),
        (NEW.id, '1 hour of React coding', 'Master the arcane arts of full-stack interface engineering.', 'Intellect', 'Hard', 50, 40, TRUE),
        (NEW.id, 'English conversation practice', 'Hone social articulation and international dialogue.', 'Charisma', 'Medium', 30, 20, TRUE),
        (NEW.id, 'Practice acoustic guitar', 'Channel musical expression and fingerstyle melody.', 'Creativity', 'Easy', 25, 15, TRUE);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Bind trigger to auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 6. RPC: ATOMIC QUEST COMPLETION & PROGRESSION ENGINE
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_quest(quest_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_quest RECORD;
    v_profile RECORD;
    v_new_xp INT;
    v_new_gold INT;
    v_new_level INT;
    v_xp_for_next INT;
    v_leveled_up BOOLEAN := FALSE;
    v_new_streak INT;
    v_today DATE := CURRENT_DATE;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Select quest
    SELECT * INTO v_quest FROM public.quests WHERE id = quest_id AND user_id = v_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quest not found or unauthorized';
    END IF;

    IF v_quest.completed THEN
        RAISE EXCEPTION 'Quest is already completed';
    END IF;

    -- Mark quest completed
    UPDATE public.quests 
    SET completed = TRUE, completed_at = NOW(), streak_count = streak_count + 1
    WHERE id = quest_id;

    -- Select profile
    SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

    -- Calculate streak
    IF v_profile.last_active_date = v_today THEN
        v_new_streak := v_profile.streak;
    ELSIF v_profile.last_active_date = v_today - INTERVAL '1 day' THEN
        v_new_streak := v_profile.streak + 1;
    ELSE
        v_new_streak := 1;
    END IF;

    -- Calculate new XP and Gold
    v_new_xp := v_profile.xp + v_quest.xp_reward;
    v_new_gold := v_profile.gold + v_quest.gold_reward;
    v_new_level := v_profile.level;

    -- Non-linear leveling loop: XP needed for level L = floor(100 * (L ^ 1.6))
    LOOP
        v_xp_for_next := FLOOR(100 * POWER(v_new_level, 1.6));
        IF v_new_xp >= v_xp_for_next THEN
            v_new_xp := v_new_xp - v_xp_for_next;
            v_new_level := v_new_level + 1;
            v_leveled_up := TRUE;
        ELSE
            EXIT;
        END IF;
    END LOOP;

    -- Update profile stats according to quest attribute
    UPDATE public.profiles
    SET 
        xp = v_new_xp,
        gold = v_new_gold,
        level = v_new_level,
        streak = v_new_streak,
        last_active_date = v_today,
        strength = CASE WHEN v_quest.attribute = 'Strength' THEN strength + 2 ELSE strength END,
        intellect = CASE WHEN v_quest.attribute = 'Intellect' THEN intellect + 2 ELSE intellect END,
        charisma = CASE WHEN v_quest.attribute = 'Charisma' THEN charisma + 2 ELSE charisma END,
        creativity = CASE WHEN v_quest.attribute = 'Creativity' THEN creativity + 2 ELSE creativity END,
        updated_at = NOW()
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'leveled_up', v_leveled_up,
        'new_level', v_new_level,
        'new_xp', v_new_xp,
        'new_gold', v_new_gold,
        'new_streak', v_new_streak
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
