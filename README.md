# ⚔️ Life RPG: The Last Sanctum

> **Transform your daily habits and personal trials into an ancient gothic dark-fantasy RPG adventure.**
> Built with **React 18**, **TypeScript**, **Three.js**, **GSAP**, **Framer Motion**, **Tailwind CSS**, and **Supabase**.

---

## 🌌 The Concept & Narrative

**Life RPG: The Last Sanctum** reimagines task and habit management through the aesthetic of high-stakes dark fantasy. Rather than checking off mundane to-do lists, the player becomes an awakened Champion bound to a sacred covenant. 

Every daily objective is an **Inscribed Oath**, personal growth manifests as **Essence (XP)** and **Gold (Ore)**, and long-term consistency feeds the **Living Flame**—a sacred hearth that burns stronger with every consecutive day of discipline.

The application combines tactile physical interactions (ancient parchment folios, brass wax seals, 3D animated treasure chests, and stone vault gates) with an authentic acoustic foley audio engine to make every action feel deliberate, weighty, and rewarding.

---

## ✨ Key Features & Interactive Systems

### 1. 📖 Ancient Physical Codex (Quest Chronicle)
- **3D Perspective Tome Opening**: Clicking the Codex or pressing <kbd>C</kbd> dims the sanctum and brings forth a heavy, dark-leather grimoire with weathered parchment edges and antique bronze corner brackets that swings open in true 3D perspective.
- **Tactile Page Flips**: Interactive left/right folio browsing (<kbd>←</kbd> / <kbd>→</kbd> or on-screen arrows) with authentic page-turning audio.
- **Folio Filter Decrees**: Switch between *All Decrees*, *Active Trials*, and *Sealed Triumphs* via tabs or number keys <kbd>1</kbd>–<kbd>3</kbd>.

### 2. 🛡️ Adventurer's Armory Chamber
- **Vaulted Chamber Reveal**: Pressing <kbd>S</kbd> or entering the Armory darkens the sanctuary and summons two massive stone and iron vault doors carved with glowing runes. The gates creak open with heavy metallic foley audio to reveal the glowing forge chamber inside.
- **Curated Equipment & Relics**: Purchase weapons, elixirs, titles, and UI themes across categories with number keys <kbd>1</kbd>–<kbd>5</kbd>.
- **Direct Backend Sync**: Purchases immediately award bonus XP, deduct Gold, and register the item directly to both the cloud Supabase database and the local cache.

### 3. 💎 Hero's Reliquary (3D Animated Vault Chest)
- **Interactive Three.js & GSAP Chest**: Pressing <kbd>I</kbd> opens the player's personal vault. A dark weathered oak and bronze treasure chest is rendered in real-time WebGL:
  - Phase 1: Heavy iron latch shakes and unlocks.
  - Phase 2: Chest lid springs open with recoil physics.
  - Phase 3: Interior warm light flares up as golden stardust particles drift upwards.
- **Equip & Filter Vault**: Equip weapons and cosmetic themes. Unspent items can be filtered by category (<kbd>1</kbd>–<kbd>5</kbd>).

### 4. ⚡ Tactile Multi-Stage Quest Completion
Completing an oath is a choreographed 10-stage physical ceremony:
1. **Mechanical Depression**: The decree seal physically depresses under cursor press.
2. **Rune Activation**: Golden radial illumination envelops the rune.
3. **Magical Completion Mark**: A golden slash draws across the decree parchment with a trailing sparkle sound.
4. **Ascending Essence & Ore**: Floating "+XP", "+Gold", and "+Attribute" text floaters rise from the task.
5. **Particle Trajectory**: Interactive canvas particles fly across the screen toward the Hero XP meter, Gold indicator, and Attribute constellation.
6. **Companion Sentinel Praise**: The cathedral sentinel companion reacts with encouraging lore.
7. **Consecrated Triumph**: The card settles into a sealed triumph with strike-through title and laurel accolade badge.
8. **Level-Up Orchestration**: If the completion triggers a level threshold, the animation gracefully halts duplicate celebrations and seamlessly launches the full-screen **Level-Up Ascendance Celebration** with choir fanfare.

### 5. 📜 Ancient Parchment Quest Inscription
- **Calligraphic Writing Surface**: Pressing <kbd>N</kbd> presents an aged parchment scroll with realistic burnt edges and ink wells.
- **Dynamic Inscription Sequence**: Submitting an oath triggers a dynamic calligraphic ritual:
  - Ink writing animation draws the title.
  - The attribute rune stamps into the parchment.
  - XP rewards materialize.
  - A heavy brass seal stamps hot red wax with a solid thud.
  - The parchment folds neatly and slides into the Quest Chronicle.

### 6. 🪦 Somber "Oath Broken" Quest Deletion
Deleting an oath avoids celebratory fire or standard modal alerts:
- The parchment immediately loses its warmth, turning cold charcoal grey.
- A delicate hairline fracture crack crawls across the parchment face.
- A faint broken covenant rune (`ᚼ`) surfaces with a soft brittle paper crumble sound.
- Cold ash cinders release and float away as the card collapses and the chronicle smoothly closes the gap.

### 7. 🔥 Living Flame Streak (Bonfire of Perpetual Vigil)
- Replaces static streak counters with a dynamic, living elemental flame situated in the Hero shrine and top navigation.
- Daily consistency intensifies the flame's core luminance and illuminates the ancient hearth rune beneath it.
- **Milestone Ignition Celebrations**:
  - **7 Days (Small Ignition)**: Sol Hearth Rune (`ᛊ`), flint-strike spark whoosh.
  - **14 Days (Ascendant Pyre)**: Blazing Path Rune (`ᚱ`), robust sanctum torch.
  - **30 Days (Perpetual Bonfire)**: Consecrated ceremonial bonfire ritual with deep harmonic choir.
  - **100 Days (Undying Sun)**: Pristine celestial white-gold legendary flame.
- An interactive **Bonfire Modal** lets players inspect streak tier multipliers and audition milestone ignitions using keys <kbd>1</kbd>–<kbd>4</kbd>.

### 8. 🌌 Atmospheric Cathedral Background & Particle Simulation
- Real-time 60 FPS HTML5 Canvas engine (`FallingSanctumParticles.tsx`).
- Simulates gentle downward-falling cathedral dust, sunbeam motes, and radiant embers drifting down from the vaulted ceilings with subtle sinusoidal sway.

---

## 🔊 High-Fidelity Acoustic Audio Engine

All sound effects have been migrated from synthetic oscillator sweeps to **14 authentic, high-quality recorded acoustic foley recordings** stored locally in `public/sounds/`:

| Sound Effect | File | Duration | Interaction |
| :--- | :--- | :--- | :--- |
| **Quest Complete** | `quest-complete.mp3` | 2.72s | Radiant crystal chime with deep resonance |
| **Coin Transaction** | `coin.mp3` | 1.10s | Heavy metal coins clinking in a pouch |
| **Level-Up Fanfare** | `level-up.mp3` | 3.06s | Sacred cathedral choir and harp arpeggios |
| **Armory Doors** | `heavy-gate.mp3` | 3.34s | Heavy stone grind and iron door creak |
| **Codex Tome Open** | `book-open.mp3` | 2.01s *(Trimmed)* | Tactile leather journal unclasped with page settle |
| **Page Turn Single** | `page-turn.mp3` | 1.20s *(Trimmed)* | Crisp dry parchment leaf turn |
| **Page Flutter** | `page-flutter.mp3` | 1.49s *(Trimmed)* | Rapid sequential parchment browsing |
| **Rune Inscription** | `rune-scribe.mp3` | 0.99s *(Trimmed)* | Atmospheric magical rune stroke & quill writing |
| **Wax Seal Stamp** | `wax-stamp.mp3` | 0.47s | Heavy weighted impact of brass seal on hot wax |
| **Oath Broken** | `oath-broken.mp3` | 1.38s | Brittle parchment crunch and somber dissolution |
| **Chest Latch** | `chest-latch.mp3` | 0.34s | Mechanical iron bolt snap and click |
| **Chest Open** | `chest-open.mp3` | 2.06s | Vault lid sliding open with crystal loot shimmer |
| **Flint Ignition** | `flint-ignition.mp3` | 3.24s | Crisp flame burst and air whoosh |
| **Ceremonial Flame** | `ceremonial-flame.mp3`| 5.46s | Resonant ceremonial brass fanfare |

- **Audio Pooling Architecture**: Implemented with native `HTMLAudioElement` pooling in [`SoundEffects.ts`](file:///src/modules/economy/SoundEffects.ts) to enable instant, zero-latency playback and parallel audio overlapping without browser `AudioContext` decoding hangs.

---

## ⌨️ Universal Keyboard Controls

Every modal, page, and drawer in Life RPG is fully operable without a mouse:

### Global Hotkeys
| Key | Action |
| :---: | :--- |
| <kbd>N</kbd> | Inscribe New Quest / Oath |
| <kbd>S</kbd> | Enter Adventurer's Armory (Weapons Chamber) |
| <kbd>I</kbd> | Open Hero's Reliquary (3D Inventory Vault) |
| <kbd>C</kbd> | Unseal Ancient Codex (Physical Journal) |
| <kbd>A</kbd> / <kbd>K</kbd> | Open Covenant Authentication (Sign In / Account) |
| <kbd>M</kbd> | Toggle SFX Mute / Unmute |
| <kbd>?</kbd> | Open Ancient Lexicon (Keyboard Navigation Guide) |
| <kbd>1</kbd> / <kbd>2</kbd> / <kbd>3</kbd> | Switch Mobile Chamber Views (Hero / Quests / Relics) |
| <kbd>Esc</kbd> | Dismiss any open modal, codex, armory, or drawer |

### Chamber-Specific Controls
- **Armory Chamber (<kbd>S</kbd>)**: Use <kbd>1</kbd>–<kbd>5</kbd> to switch shop categories (*All*, *Armaments*, *Elixirs*, *Relics*, *Cosmetics*).
- **Hero's Reliquary (<kbd>I</kbd>)**: Use <kbd>1</kbd>–<kbd>5</kbd> to filter inventory categories.
- **Physical Codex (<kbd>C</kbd>)**: Use <kbd>1</kbd>–<kbd>3</kbd> to switch tabs; <kbd>←</kbd> and <kbd>→</kbd> to flip pages with foley turn sounds.
- **Inscribe Quest (<kbd>N</kbd>)**: Input is auto-focused; press <kbd>Enter</kbd> to submit inscription.
- **Living Flame Modal**: Use <kbd>1</kbd>–<kbd>4</kbd> to audition streak tier milestones (7d, 14d, 30d, 100d).

---

## 🛠️ Technical Architecture & Stack

```
Life-RPG/
├── public/
│   ├── sounds/                 # 14 Acoustic foley MP3 audio files
│   └── sanctum-cathedral-bg.jpg # Ruined gothic cathedral environment backdrop
├── src/
│   ├── modules/
│   │   ├── core/               # GameStateContext, Supabase client, RPG math
│   │   │   ├── FallingSanctumParticles.tsx # 60 FPS HTML5 Canvas particle system
│   │   │   └── rpgEngine.ts    # Exponential progression curves & attribute math
│   │   ├── hero/               # Character card, dynamic avatar, XP meters
│   │   │   ├── AttributeConstellation.tsx # Interactive cardinal attribute nodes
│   │   │   ├── LevelUpCelebration.tsx     # Full-screen celestial ascendance
│   │   │   └── LivingFlameStreak.tsx      # Living flame shader & milestone preview
│   │   ├── quests/             # Codex, quest card, inscription parchment
│   │   │   ├── PhysicalCodexModal.tsx     # 3D perspective journal with page flips
│   │   │   ├── QuestCard.tsx              # Tactile 10-stage completion & break sequence
│   │   │   ├── QuestModal.tsx             # Calligraphic parchment inscription form
│   │   │   └── useKeyboardShortcuts.ts    # Global hotkey listener
│   │   └── economy/            # Navbar, armory shop, inventory vault, audio
│   │       ├── InventoryDrawer.tsx        # Three.js + GSAP 3D chest & item reliquary
│   │       ├── ShopModal.tsx              # Stone & iron gate chamber entry
│   │       ├── AuthModal.tsx              # Supabase email/password covenant login
│   │       └── SoundEffects.ts            # High-fidelity HTML5 Audio pool engine
│   ├── types/                  # Shared TypeScript data contracts
│   ├── App.tsx                 # Root coordinator, global keyboard bindings
│   └── main.tsx                # Entry point
```

### Key Libraries & Roles
- **React 18 & TypeScript**: Robust declarative UI architecture with strict static typing (`noUnusedLocals: true`).
- **Three.js**: Real-time WebGL rendering of the 3D treasure chest in the Reliquary vault.
- **GSAP (GreenSock)**: Micro-timed animation sequences (spring-loaded chest opening, recoil physics, lighting flares).
- **Framer Motion**: Smooth layout reorganization, parchment folding, modal entrances, and component springs.
- **Tailwind CSS**: Dark fantasy HSL color palette, gold/amber glowing borders, and atmospheric typography.
- **Supabase PostgreSQL & Auth**:
  - Cloud database persistence across `profiles`, `inventory`, and `quests` tables.
  - Optimistic client-side cache backed by `localStorage` for zero-latency UI and offline playability.
  - Email/Password session management and Row-Level Security (RLS).

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/VedantGawande12/Life-RPG.git
cd Life-RPG
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If left blank or unconfigured, the application functions in instant offline local persistence mode using `localStorage`!)*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates a verified, type-checked production bundle in `dist/`.

---

## 📜 License
MIT License. Created by [Vedant Gawande](https://github.com/VedantGawande12).
