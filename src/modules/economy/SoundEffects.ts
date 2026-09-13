/**
 * High-Fidelity Acoustic Sound Effects Engine:
 * Uses high-performance HTML5 Audio elements with instance pooling to play real
 * acoustic foley recordings directly from /sounds/*.mp3 with zero synthetic beeps.
 */

class SoundEngine {
  private audioPool: Map<string, HTMLAudioElement[]> = new Map();
  private maxPoolSize: number = 4;
  private hasPreloaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const preloadOnFirstInteraction = () => {
        this.preloadAll();
        window.removeEventListener('click', preloadOnFirstInteraction);
        window.removeEventListener('keydown', preloadOnFirstInteraction);
      };
      window.addEventListener('click', preloadOnFirstInteraction, { once: true, passive: true });
      window.addEventListener('keydown', preloadOnFirstInteraction, { once: true, passive: true });
    }
  }

  /**
   * Preload all audio assets into the browser's media cache
   */
  preloadAll() {
    if (this.hasPreloaded || typeof window === 'undefined') return;
    this.hasPreloaded = true;
    const coreSounds = [
      '/sounds/quest-complete.mp3',
      '/sounds/coin.mp3',
      '/sounds/level-up.mp3',
      '/sounds/book-open.mp3',
      '/sounds/page-turn.mp3',
      '/sounds/page-flutter.mp3',
      '/sounds/heavy-gate.mp3',
      '/sounds/rune-scribe.mp3',
      '/sounds/wax-stamp.mp3',
      '/sounds/oath-broken.mp3',
      '/sounds/chest-latch.mp3',
      '/sounds/chest-open.mp3',
      '/sounds/flint-ignition.mp3',
      '/sounds/ceremonial-flame.mp3',
    ];
    coreSounds.forEach((path) => this.getOrCreateAudio(path));
  }

  /**
   * Get an idle audio instance from the pool, or create a new one
   */
  private getOrCreateAudio(soundPath: string): HTMLAudioElement {
    if (!this.audioPool.has(soundPath)) {
      this.audioPool.set(soundPath, []);
    }
    const pool = this.audioPool.get(soundPath)!;

    // Find an audio element that is paused or ended
    const available = pool.find((a) => a.paused || a.ended);
    if (available) {
      return available;
    }

    // Create a new instance if pool limit not reached
    const audio = new Audio(soundPath);
    audio.preload = 'auto';
    if (pool.length < this.maxPoolSize) {
      pool.push(audio);
    }
    return audio;
  }

  /**
   * Play an acoustic audio recording with configurable volume and optional duration cutoff
   */
  private play(soundPath: string, volume: number = 0.5, maxDuration?: number) {
    if (typeof window === 'undefined') return;
    try {
      if (!this.hasPreloaded) {
        this.preloadAll();
      }

      const audio = this.getOrCreateAudio(soundPath);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[SoundEngine] play prevented for ${soundPath}:`, err);
        });
      }

      // If duration cutoff specified, fade or pause cleanly
      if (maxDuration && maxDuration > 0) {
        setTimeout(() => {
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
        }, maxDuration * 1000);
      }
    } catch (e) {
      console.warn(`[SoundEngine] error playing ${soundPath}:`, e);
    }
  }

  // =========================================================================
  // PUBLIC SOUND EFFECT TRIGGERS (100% Real Recorded Foley, Zero Synthetic Beeps)
  // =========================================================================

  // 1. Chime when quest is completed (winning chime)
  playQuestComplete() {
    this.play('/sounds/quest-complete.mp3', 0.55);
  }

  // 2. Coin sound when purchasing or earning gold (real clinking coins)
  playCoin() {
    this.play('/sounds/coin.mp3', 0.6);
  }

  // 3. Majestic choral fanfare when leveling up (cathedral choir & harp)
  playLevelUp() {
    this.play('/sounds/level-up.mp3', 0.7);
  }

  // 4. Subtle metallic latch release sound (heavy iron gate latch)
  playChestLatch() {
    this.play('/sounds/chest-latch.mp3', 0.6);
  }

  // 5. Chest lid opening + magical inner resonance shimmer (crystal shimmer)
  playChestOpen() {
    this.play('/sounds/chest-open.mp3', 0.6);
  }

  // 6. Ancient leather book unclasps and opens (trimmed to 2.0s)
  playBookOpen() {
    this.play('/sounds/book-open.mp3', 0.65, 2.0);
  }

  // 7. Parchment page turn (single turn 1.2s or rapid page flutter 1.5s)
  playPageTurn(fast: boolean = false) {
    const file = fast ? '/sounds/page-flutter.mp3' : '/sounds/page-turn.mp3';
    this.play(file, 0.55);
  }

  // 8. Massive stone & iron vault gate grinding open (heavy church door)
  playHeavyGateOpen() {
    this.play('/sounds/heavy-gate.mp3', 0.7);
  }

  // 9. Crisp magical mark drawn across parchment / stone (trimmed to 1.0s)
  playRuneScribe() {
    this.play('/sounds/rune-scribe.mp3', 0.55, 1.0);
  }

  // 10. Ascending XP absorption harmonics (trimmed to 0.8s)
  playXpAbsorb() {
    this.play('/sounds/rune-scribe.mp3', 0.4, 0.8);
  }

  // 11. Heavy brass matrix stamping onto hot sealing wax (wood/seal thud)
  playWaxStamp() {
    this.play('/sounds/wax-stamp.mp3', 0.7);
  }

  // 12. Somber, brittle fracture of a broken oath (brittle paper crumble)
  playOathBroken() {
    this.play('/sounds/oath-broken.mp3', 0.65);
  }

  // 13. Crisp flint strike and flame whoosh (flame whoosh)
  playFlintIgnition() {
    this.play('/sounds/flint-ignition.mp3', 0.6);
  }

  // 14. Major ceremonial cathedral fire swell & brass fanfare (grand fanfare)
  playCeremonialFlame() {
    this.play('/sounds/ceremonial-flame.mp3', 0.75);
  }
}

export const soundEngine = new SoundEngine();

export const playQuestCompleteSound = () => soundEngine.playQuestComplete();
export const playCoinSound = () => soundEngine.playCoin();
export const playLevelUpSound = () => soundEngine.playLevelUp();
export const playChestLatchSound = () => soundEngine.playChestLatch();
export const playChestOpenSound = () => soundEngine.playChestOpen();
export const playBookOpenSound = () => soundEngine.playBookOpen();
export const playPageTurnSound = (fast?: boolean) => soundEngine.playPageTurn(fast);
export const playHeavyGateOpenSound = () => soundEngine.playHeavyGateOpen();
export const playRuneScribeSound = () => soundEngine.playRuneScribe();
export const playXpAbsorbSound = () => soundEngine.playXpAbsorb();
export const playWaxStampSound = () => soundEngine.playWaxStamp();
export const playOathBrokenSound = () => soundEngine.playOathBroken();
export const playFlintIgnitionSound = () => soundEngine.playFlintIgnition();
export const playCeremonialFlameSound = () => soundEngine.playCeremonialFlame();
