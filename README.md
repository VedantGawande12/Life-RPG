# ⚔️ Life RPG - Gamified Habit & Task Progression

> **Turn your mundane real-world tasks into an engaging RPG leveling adventure.**
> Built for hackathons: React, Tailwind CSS, Framer Motion, and Supabase.

---

## 🌟 Features Overview

- **🛡️ Hero Character HUD**: Real-time Level progression, dynamic XP bar, and 4 core RPG attributes:
  - 🔴 **Strength**: Physical vitality & workout consistency
  - 🔵 **Intellect**: Deep work, coding & analytical mastery
  - 🟣 **Charisma**: Communication, speech & articulation
  - 🟢 **Creativity**: Artistic pursuits, design & music
- **📈 Non-Linear Progression Engine**: Progression scales exponentially ($XP = \lfloor 100 \times \text{Level}^{1.6} \rfloor$) ensuring higher levels reflect true real-world dedication.
- **📜 Tactile Quest Board**:
  - Pre-seeded with hackathon tasks (*Strength training*, *React coding*, *English conversation*, *Acoustic guitar*).
  - Spring-physics interactive checkboxes with localized confetti particle explosions (`canvas-confetti`).
  - Strict client-side validation preventing empty quest submissions.
  - Keyboard shortcuts (`N` for new quest, `S` for shop, `Esc` to dismiss).
- **🪙 In-App Economy & Hero Vault**:
  - Earn Gold on every completed quest.
  - The Armory Shop: Consumable potions, streak shields, equipment relics, titles, and UI themes.
  - Equipable vault inventory.
- **🔥 Daily Activity Streak**: Consecutive day activity tracker with streak preservation.
- **⚡ Turnkey Resilience**: Seamlessly operates in zero-config **Demo Mode** with instant local state persistence, or connects to **Supabase** with Row Level Security (RLS) when keys are provided.

---

## 👥 4-Stream Collaborative Architecture

The codebase is partitioned into 4 decoupled modular domains so teammates / AI agents can build in parallel without merge conflicts:

| Stream | Domain | Location | Key Deliverables |
|---|---|---|---|
| **Stream 1** | **Backend & Core Engine** | `supabase/`, `src/modules/core/` | Database schema, RLS, triggers, seed SQL, non-linear progression math, optimistic state sync |
| **Stream 2** | **Hero Profile & HUD** | `src/modules/hero/` | Character card, dynamic avatar, XP progress bar, attribute meters, level-up celebration modal |
| **Stream 3** | **Quest Board & Tasks** | `src/modules/quests/` | Quest log filtering, tactile spring quest card, empty state, validation modal, keyboard shortcuts |
| **Stream 4** | **Economy, Shop & Shell** | `src/modules/economy/` | Daily streak navbar, armory shop modal, inventory vault, synthesized Web Audio SFX, Supabase auth |
| **Shared** | **Type Contracts** | `src/types/` | Shared TypeScript contracts (`user.ts`, `quest.ts`, `economy.ts`, `events.ts`) |

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/VedantGawande12/Life-RPG.git
cd Life-RPG
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and Anon Key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If left blank or unconfigured, the application runs automatically in full interactive Demo Mode with zero crashes!)*

### 3. Database Setup (Supabase)
1. In your [Supabase Dashboard](https://supabase.com), open the **SQL Editor**.
2. Run the contents of [`supabase/schema.sql`](file:///supabase/schema.sql).
3. Run the contents of [`supabase/seed.sql`](file:///supabase/seed.sql).

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Vercel Deployment
```bash
npm run build
```
Deploy instantly to **Vercel** with zero extra configuration needed!

---

## ⌨️ Keyboard Navigation

- <kbd>N</kbd>: Open Forge New Quest modal
- <kbd>S</kbd>: Open Armory Shop
- <kbd>Esc</kbd>: Close active modal / celebration dialog
- <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>: Complete keyboard focus navigation

---

## 📂 Project Structure

```
Life-RPG/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── supabase/
│   ├── schema.sql              # Profiles, quests, shop, inventory, triggers, RLS
│   └── seed.sql                # Seed shop items & equipment
└── src/
    ├── types/                  # Shared domain contracts
    │   ├── user.ts
    │   ├── quest.ts
    │   ├── economy.ts
    │   ├── events.ts
    │   └── index.ts
    ├── modules/
    │   ├── core/               # Progression math, state context, Supabase client
    │   ├── hero/               # Hero HUD, XP bar, attribute meters, Level-Up modal
    │   ├── quests/             # Quest board, tactile card, validation modal, shortcuts
    │   └── economy/            # Navbar, armory shop, inventory vault, Web Audio SFX
    ├── App.tsx                 # Root application orchestrator
    ├── main.tsx                # Entry point
    └── index.css               # Tailwind directives & custom RPG styling
```
