-- ==============================================================================
-- LIFE RPG: DEFAULT SHOP ITEMS & SEED DATA
-- ==============================================================================

INSERT INTO public.shop_items (id, name, description, category, cost, icon, stat_boost, rarity)
VALUES
    -- Potions & Consumables
    ('item_xp_potion_small', 'Elixir of Clarity', 'Instant rush of insight. Grants +50 XP immediately.', 'potion', 30, 'FlaskConical', '{"xp": 50}', 'Common'),
    ('item_streak_shield', 'Aegis of Continuity', 'Protects your streak from resetting if you miss a day.', 'potion', 80, 'Shield', '{"streak_freeze": 1}', 'Rare'),
    ('item_focus_draught', 'Cyber Focus Draught', 'Turbocharges focus. Grants +100 XP immediately.', 'potion', 60, 'Zap', '{"xp": 100}', 'Rare'),
    
    -- Gear & Relics
    ('item_iron_dumbbell', 'Gauntlets of Iron Will', 'Hardens resolve. +5 Strength permanently.', 'equipment', 120, 'Dumbbell', '{"strength": 5}', 'Rare'),
    ('item_crystal_codex', 'Tome of Clean Architecture', 'Enhances logic and patterns. +5 Intellect permanently.', 'equipment', 120, 'BookOpen', '{"intellect": 5}', 'Rare'),
    ('item_silver_pendant', 'Amulet of Eloquence', 'Boosts vocal presence and confidence. +5 Charisma permanently.', 'equipment', 120, 'Sparkles', '{"charisma": 5}', 'Rare'),
    ('item_golden_quill', 'Quill of Infinite Muse', 'Unlocks boundless creative visions. +5 Creativity permanently.', 'equipment', 120, 'Feather', '{"creativity": 5}', 'Rare'),

    -- Titles & Badges
    ('title_syntax_knight', 'Title: Syntax Knight', 'Showcases code mastery in your hero profile.', 'title', 50, 'Crown', '{}', 'Common'),
    ('title_zen_warrior', 'Title: Zen Warrior', 'Demonstrates disciplined habit consistency.', 'title', 100, 'Award', '{}', 'Rare'),
    ('title_grandmaster', 'Title: Grandmaster of Reality', 'Prestige badge for elite achievers.', 'title', 300, 'Trophy', '{}', 'Legendary'),

    -- Visual Aura Themes
    ('theme_cyberpunk', 'Theme: Neon Cyberpunk', 'Bathes your HUD in vivid cyan and magenta holograms.', 'theme', 150, 'Palette', '{"theme": "cyberpunk"}', 'Epic'),
    ('theme_solar_gold', 'Theme: Solar Luminary', 'Infuses your HUD with radiant golden aura.', 'theme', 200, 'Sun', '{"theme": "solar_gold"}', 'Epic')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    cost = EXCLUDED.cost,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    stat_boost = EXCLUDED.stat_boost,
    rarity = EXCLUDED.rarity;
