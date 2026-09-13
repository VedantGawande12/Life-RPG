/**
 * Synthesized Web Audio API sound effects:
 * Zero external mp3/wav files required, zero load latency, instant tactile response!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Chime when task is completed
  playQuestComplete() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  // Coin sound when purchasing or earning gold
  playCoin() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Silent fail
    }
  }

  // Fanfare when leveling up
  playLevelUp() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // Silent fail
    }
  }
  // Subtle metallic latch release sound
  playChestLatch() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Click 1: Lock pin tumbler
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Click 2: Heavy bronze hasp snap (25ms later)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(800, now + 0.025);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.09);
      gain2.gain.setValueAtTime(0.35, now + 0.025);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.025);
      osc2.stop(now + 0.1);
    } catch {
      // Silent fail
    }
  }

  // Chest lid opening + magical inner resonance shimmer
  playChestOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy wooden creak / low thud
      const creakOsc = ctx.createOscillator();
      const creakGain = ctx.createGain();
      creakOsc.type = 'sawtooth';
      creakOsc.frequency.setValueAtTime(110, now);
      creakOsc.frequency.linearRampToValueAtTime(160, now + 0.25);
      creakGain.gain.setValueAtTime(0.12, now);
      creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      creakOsc.connect(creakGain);
      creakGain.connect(ctx.destination);
      creakOsc.start(now);
      creakOsc.stop(now + 0.35);

      // Warm magical celestial chord emerging (D4, F#4, A4, C#5)
      const chord = [293.66, 369.99, 440.0, 554.37];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const noteStart = now + 0.1 + idx * 0.06;
        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.6);
      });
    } catch {
      // Silent fail
    }
  }

  // Ancient leather book unclasps and opens
  playBookOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Deep leather creak
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.3);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Bronze clasp click
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(1200, now);
      click.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.05);
    } catch {
      // Silent fail
    }
  }

  // Rapid tactile parchment page flutter
  playPageTurn() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 4 rapid page flutter ticks
      [0, 0.05, 0.11, 0.18].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320 + idx * 40, now + offset);
        osc.frequency.exponentialRampToValueAtTime(120, now + offset + 0.04);
        gain.gain.setValueAtTime(0.08, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.04);
      });
    } catch {
      // Silent fail
    }
  }

  // Massive stone & iron vault gate grinding open + forge chamber resonance
  playHeavyGateOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Heavy iron lock counterweight clank
      const boltOsc = ctx.createOscillator();
      const boltGain = ctx.createGain();
      boltOsc.type = 'triangle';
      boltOsc.frequency.setValueAtTime(450, now);
      boltOsc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      boltGain.gain.setValueAtTime(0.35, now);
      boltGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      boltOsc.connect(boltGain);
      boltGain.connect(ctx.destination);
      boltOsc.start(now);
      boltOsc.stop(now + 0.15);

      // 2. Heavy stone scraping rumble (modulated sawtooth)
      const stoneOsc = ctx.createOscillator();
      const stoneGain = ctx.createGain();
      stoneOsc.type = 'sawtooth';
      stoneOsc.frequency.setValueAtTime(75, now + 0.05);
      stoneOsc.frequency.linearRampToValueAtTime(55, now + 0.7);
      stoneGain.gain.setValueAtTime(0.001, now);
      stoneGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      stoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      stoneOsc.connect(stoneGain);
      stoneGain.connect(ctx.destination);
      stoneOsc.start(now + 0.05);
      stoneOsc.stop(now + 0.75);

      // 3. Warm forge chamber resonance / low brass drone
      [110, 164.81, 220].forEach((freq, idx) => {
        const forgeOsc = ctx.createOscillator();
        const forgeGain = ctx.createGain();
        forgeOsc.type = 'sine';
        forgeOsc.frequency.value = freq;
        const noteStart = now + 0.2 + idx * 0.05;
        forgeGain.gain.setValueAtTime(0.12, noteStart);
        forgeGain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.9);
        forgeOsc.connect(forgeGain);
        forgeGain.connect(ctx.destination);
        forgeOsc.start(noteStart);
        forgeOsc.stop(noteStart + 0.9);
      });
    } catch {
      // Silent fail
    }
  }

  // Crisp magical mark drawn across parchment / stone
  playRuneScribe() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sparkling high-frequency chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Silent fail
    }
  }

  // Ascending XP absorption harmonics
  playXpAbsorb() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const noteStart = now + idx * 0.04;
        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    } catch {
      // Silent fail
    }
  }

  // Heavy brass matrix stamping onto hot sealing wax
  playWaxStamp() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy low thud (110Hz to 40Hz)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(140, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      thudGain.gain.setValueAtTime(0.35, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.15);

      // Sizzle / wax friction crunch
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'sawtooth';
      click.frequency.setValueAtTime(650, now + 0.02);
      click.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      clickGain.gain.setValueAtTime(0.15, now + 0.02);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now + 0.02);
      click.stop(now + 0.09);
    } catch {
      // Silent fail
    }
  }

  // Somber, brittle fracture of a broken oath
  playOathBroken() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Desolate, hollow low drone (somber, melancholic)
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(95, now);
      drone.frequency.exponentialRampToValueAtTime(45, now + 0.5);
      droneGain.gain.setValueAtTime(0.18, now);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      drone.connect(droneGain);
      droneGain.connect(ctx.destination);
      drone.start(now);
      drone.stop(now + 0.55);

      // 2. Subtle brittle dry parchment crack / fracture tick
      [0.03, 0.08, 0.14].forEach((offset, idx) => {
        const snap = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snap.type = 'sawtooth';
        snap.frequency.setValueAtTime(280 - idx * 40, now + offset);
        snap.frequency.exponentialRampToValueAtTime(70, now + offset + 0.035);
        snapGain.gain.setValueAtTime(0.06, now + offset);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.035);
        snap.connect(snapGain);
        snapGain.connect(ctx.destination);
        snap.start(now + offset);
        snap.stop(now + offset + 0.035);
      });
    } catch {
      // Silent fail
    }
  }

  // Crisp flint strike and flame whoosh
  playFlintIgnition() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Flint metallic spark
      const spark = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      spark.type = 'triangle';
      spark.frequency.setValueAtTime(1800, now);
      spark.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      sparkGain.gain.setValueAtTime(0.3, now);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      spark.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      spark.start(now);
      spark.stop(now + 0.06);

      // Fire whoosh swell
      const whoosh = ctx.createOscillator();
      const whooshGain = ctx.createGain();
      whoosh.type = 'sawtooth';
      whoosh.frequency.setValueAtTime(120, now + 0.04);
      whoosh.frequency.linearRampToValueAtTime(240, now + 0.2);
      whooshGain.gain.setValueAtTime(0.001, now + 0.04);
      whooshGain.gain.linearRampToValueAtTime(0.2, now + 0.12);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      whoosh.connect(whooshGain);
      whooshGain.connect(ctx.destination);
      whoosh.start(now + 0.04);
      whoosh.stop(now + 0.35);
    } catch {
      // Silent fail
    }
  }

  // Major ceremonial cathedral fire swell & deep chord
  playCeremonialFlame() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Warm celestial fire chord
      [146.83, 220.0, 293.66, 440.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const noteStart = now + idx * 0.06;
        gain.gain.setValueAtTime(0.16, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.85);
      });
    } catch {
      // Silent fail
    }
  }
}

export const soundEngine = new SoundEngine();

export const playQuestCompleteSound = () => soundEngine.playQuestComplete();
export const playCoinSound = () => soundEngine.playCoin();
export const playLevelUpSound = () => soundEngine.playLevelUp();
export const playChestLatchSound = () => soundEngine.playChestLatch();
export const playChestOpenSound = () => soundEngine.playChestOpen();
export const playBookOpenSound = () => soundEngine.playBookOpen();
export const playPageTurnSound = () => soundEngine.playPageTurn();
export const playHeavyGateOpenSound = () => soundEngine.playHeavyGateOpen();
export const playRuneScribeSound = () => soundEngine.playRuneScribe();
export const playXpAbsorbSound = () => soundEngine.playXpAbsorb();
export const playWaxStampSound = () => soundEngine.playWaxStamp();
export const playOathBrokenSound = () => soundEngine.playOathBroken();
export const playFlintIgnitionSound = () => soundEngine.playFlintIgnition();
export const playCeremonialFlameSound = () => soundEngine.playCeremonialFlame();
