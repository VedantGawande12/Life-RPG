# Implementation Plan: Life RPG (4-Agent Collaborative Architecture)

Build **"Life RPG"**, a full-stack gamified task tracker web application for a 24-hour hackathon, designed for seamless parallel execution across **4 team members / agent sessions** with zero file overlap or merge conflicts.

The git repository is already initialized with remote:
`https://github.com/VedantGawande12/Life-RPG.git`
*(Note: As requested, the AI will never commit or push; all git commits and pushes will be managed directly by you).*

---

## Architecture & Work Stream Separation

To allow 4 independent agents/developers to work simultaneously without collisions, the codebase is partitioned into **4 decoupled domains** communicating through strict shared TypeScript contracts in `src/types/`:

```
Life-RPG/
├── .env.example
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
│
├── supabase/                          [STREAM 1: Backend & Core Engine]
│   ├── schema.sql
│   ├── seed.sql
│   └── rpc.sql
│
└── src/
    ├── types/                         [SHARED CONTRACTS - All Streams]
    │   ├── user.ts
    │   ├── quest.ts
    │   ├── economy.ts
    │   └── events.ts
    │
    ├── modules/
    │   ├── core/                      [STREAM 1: Backend & Core Engine]
    │   │   ├── supabaseClient.ts
    │   │   ├── rpgEngine.ts           (Non-linear math, streak formulas)
    │   │   ├── initialData.ts         (Seeded tasks & offline fallback data)
    │   │   └── GameStateContext.tsx   (Unified reactive state & Supabase sync)
    │   │
    │   ├── hero/                      [STREAM 2: Hero Profile & Character HUD]
    │   │   ├── HeroCard.tsx
    │   │   ├── AttributeBar.tsx       (STR, INT, CHA, CRE visual gauges)
    │   │   ├── LevelProgress.tsx      (XP bar with spring micro-interactions)
    │   │   ├── LevelUpCelebration.tsx (Confetti fanfare + stat selection overlay)
    │   │   └── HeroAvatar.tsx
    │   │
    │   ├── quests/                    [STREAM 3: Quest Board & Interactions]
    │   │   ├── QuestBoard.tsx         (Board view, filter tabs, skeleton loader)
    │   │   ├── QuestCard.tsx          (Spring checkbox, particle burst, badges)
    │   │   ├── QuestModal.tsx         (Create/edit quest with client validation)
    │   │   └── useKeyboardShortcuts.ts('N' for new quest, space/enter to complete)
    │   │
    │   └── economy/                   [STREAM 4: Shop, Inventory & App Shell]
    │       ├── ShopModal.tsx          (Item catalog: potions, equipment, themes)
    │       ├── InventoryDrawer.tsx    (Owned items, equip/unequip mechanics)
    │       ├── Navbar.tsx             (Streak flame, gold counter, sound toggle)
    │       ├── AuthModal.tsx          (Supabase Auth + Instant Guest demo mode)
    │       └── SoundEffects.ts        (Web Audio API synthesizer chimes)
    │
    ├── App.tsx                        (Root orchestrator assembling the 4 modules)
    └── index.css                      (Tailwind base + RPG HUD styling)
```

---

## Shared Type Contracts (`src/types/`)

Before feature implementation, Agent 1 defines the contracts so Agents 2, 3, and 4 have exact typings:
- **`user.ts`**: `CharacterProfile`, `Attributes { strength, intellect, charisma, creativity }`
- **`quest.ts`**: `Quest`, `AttributeType`, `Difficulty ('Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Epic')`
- **`economy.ts`**: `ShopItem`, `InventoryItem`, `ItemCategory`, `ItemRarity`
- **`events.ts`**: `LevelUpEvent`, `QuestCompletePayload`, `PurchasePayload`

---

## 4-Agent Work Stream Breakdown

### 🛡️ Agent 1: Backend, Database Schema & Progression Engine (`modules/core`)
**Scope & Deliverables:**
1. **Supabase SQL (`supabase/schema.sql`, `supabase/seed.sql`)**:
   - `profiles` table with RLS (`auth.uid() = id`), automatic profile creation trigger on signup.
   - `quests` table with RLS, CRUD operations, pre-seeded hackathon tasks:
     - *"Complete strength training"* (Strength)
     - *"1 hour of React coding"* (Intellect)
     - *"English conversation practice"* (Charisma)
     - *"Practice acoustic guitar"* (Creativity)
   - `shop_items` catalog and `inventory` tables with RLS.
2. **RPG Progression Math (`modules/core/rpgEngine.ts`)**:
   - Non-linear XP formula: $\text{XP}_{\text{required}} = \lfloor 100 \times \text{Level}^{1.6} \rfloor$
   - Daily streak algorithm: verifies consecutive calendar days; grants streak multiplier.
   - Reward calculator for quest difficulties.
3. **State Management (`modules/core/GameStateContext.tsx`)**:
   - Optimistic UI state updates for immediate UI response.
   - Transparent sync to Supabase if credentials are provided, or zero-config local storage demo fallback.

---

### ⚔️ Agent 2: Hero Profile, Character HUD & Level-Up (`modules/hero`)
**Scope & Deliverables:**
1. **Hero Character Card (`HeroCard.tsx`, `HeroAvatar.tsx`)**:
   - Hero name, class title (e.g., "Novice Adventurer", "Grand Cyber-Mage"), dynamic avatar with glow.
   - Level indicator with animated Framer Motion entrance.
2. **XP Progression Bar (`LevelProgress.tsx`)**:
   - Current XP / Required XP with dynamic fill bar and numeric percentage indicator.
3. **Attributes Panel (`AttributeBar.tsx`)**:
   - Visual gauge bars and icons for **Strength**, **Intellect**, **Charisma**, **Creativity**.
   - Dynamic stat increase tooltips and level indicators.
4. **Celebratory Level-Up Overlay (`LevelUpCelebration.tsx`)**:
   - Full-screen modal triggered on level up with celebratory spring animation, fanfare audio cue, particle burst (`canvas-confetti`), and celebratory congratulatory dialog.

---

### 📜 Agent 3: Quest Board, Tactile Tasks & Shortcuts (`modules/quests`)
**Scope & Deliverables:**
1. **Quest Board (`QuestBoard.tsx`)**:
   - Filtering system: All Quests, Daily Habits, Strength, Intellect, Charisma, Creativity, Completed.
   - Empty state illustration and loading skeletons for async states.
2. **Tactile Quest Card (`QuestCard.tsx`)**:
   - Spring-physics animated checkbox micro-interactions.
   - Attribute badge with themed colors, XP and Gold reward pills.
   - Confetti burst localized to checkbox completion.
   - Edit, delete, and streak counter badge for daily tasks.
3. **Create/Edit Quest Modal (`QuestModal.tsx`)**:
   - Client-side validation: strictly prevents empty titles with visual shaking/alert feedback.
   - Attribute selector (STR, INT, CHA, CRE) and Difficulty selector (Trivial to Epic) with real-time preview of XP & Gold rewards.
4. **Keyboard Accessibility (`useKeyboardShortcuts.ts`)**:
   - `N`: Quick-open new quest modal.
   - `Space` / `Enter`: Mark focused quest complete.
   - `Esc`: Close open modals.
   - `Tab` / Shift+Tab: Full accessible focus outline rings across all interactive elements.

---

### 🪙 Agent 4: In-Game Economy, Shop, Inventory & Shell (`modules/economy`)
**Scope & Deliverables:**
1. **Navigation Bar (`Navbar.tsx`)**:
   - Gold coin counter with pulsing coin animation when gold is earned.
   - Active daily streak flame with color glow reflecting streak count.
   - Audio SFX toggle and keyboard shortcut cheat-sheet trigger.
2. **Virtual Shop & Armory (`ShopModal.tsx`)**:
   - Catalog: Health/XP Potions, Streak Freeze Shields, RPG Equipment, Titles, and UI Themes.
   - Gold balance check: prevents purchases if insufficient gold with tactile shake animation.
3. **Inventory System (`InventoryDrawer.tsx`)**:
   - Displays owned items with category filters.
   - "Equip" / "Unequip" functionality for titles, badges, and visual themes.
4. **Authentication & Landing (`AuthModal.tsx`)**:
   - Supabase Auth (Sign Up / Log In).
   - "Guest Demo Mode" button to explore immediately with pre-seeded data without requiring initial signup.
5. **Tactile Web Audio Synthesizer (`SoundEffects.ts`)**:
   - Lightweight Web Audio API synthesis for quest completion chimes, gold coin pickup, and level-up fanfare (no external MP3 asset dependency).

---

## Integration Plan (Root Orchestrator)

Once the 4 modules are complete, `App.tsx` brings them together seamlessly:
- Wraps application in `GameStateProvider` and `AuthProvider`.
- Renders `Navbar`, responsive 2-column or 3-column dashboard grid (`HeroCard` on left/top, `QuestBoard` in center/main, quick stats and shop triggers).
- Mounts global modals (`QuestModal`, `ShopModal`, `LevelUpCelebration`, `AuthModal`).

---

## Verification Plan

### Automated Tests & Bundler Checks
- Verify zero TypeScript or linting errors: `npm run build`.
- Verify clean bundle output and production readiness for Vercel.

### Multi-Agent Integration Tests
1. **Database & Persistence**:
   - Validate `supabase/schema.sql` syntax and RLS policies.
   - Test data persistence across browser reloads.
2. **Progression & Leveling**:
   - Verify non-linear leveling math correctly advances levels when XP passes the threshold.
   - Verify celebratory Level-Up modal and particle fireworks appear.
3. **Validation & Edge Cases**:
   - Verify empty task creation is blocked with client-side feedback.
   - Verify optimistic UI updates: checking a task instantly animates and updates state before database round-trip finishes.
4. **Economy & Streaks**:
   - Verify Gold earned from tasks allows buying shop items, and items appear in inventory.
   - Verify daily streak updates on completion.
5. **Accessibility**:
   - Test full keyboard navigation: `Tab`, `N`, `Space`, `Enter`, `Escape`.
