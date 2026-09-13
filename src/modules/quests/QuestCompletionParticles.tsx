import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCoinSound, playXpAbsorbSound } from '../economy/SoundEffects';

export interface CompletionParticleEvent {
  id: string;
  startX: number;
  startY: number;
  xpReward: number;
  goldReward: number;
  attribute: string;
  willLevelUp: boolean;
  onXpArrival?: () => void;
  onFinished?: () => void;
}

interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  type: 'xp' | 'gold' | 'attribute';
  color: string;
  glow: string;
  delay: number;
  duration: number;
}

const ATTRIBUTE_COLORS: Record<string, { color: string; glow: string }> = {
  Strength: { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' },
  Intellect: { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.8)' },
  Charisma: { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.8)' },
  Creativity: { color: '#34d399', glow: 'rgba(52, 211, 153, 0.8)' },
};

export const QuestCompletionParticles: React.FC = () => {
  const [particles, setParticles] = useState<FlyingParticle[]>([]);

  const spawnParticles = useCallback((event: CompletionParticleEvent) => {
    // 1. Locate Target Positions
    const xpMeterEl = document.getElementById('hero-xp-meter');
    const goldCounterEl = document.getElementById('navbar-gold-counter');
    const attrNodeEl = document.getElementById(`attr-${event.attribute.toLowerCase()}`);

    const xpRect = xpMeterEl ? xpMeterEl.getBoundingClientRect() : null;
    const goldRect = goldCounterEl ? goldCounterEl.getBoundingClientRect() : null;
    const attrRect = attrNodeEl ? attrNodeEl.getBoundingClientRect() : null;

    // Fallback coordinates if elements are currently off-screen (e.g., mobile layout)
    const xpTarget = xpRect
      ? { x: xpRect.left + xpRect.width / 2, y: xpRect.top + xpRect.height / 2 }
      : { x: window.innerWidth * 0.25, y: window.innerHeight * 0.45 };

    const goldTarget = goldRect
      ? { x: goldRect.left + goldRect.width / 2, y: goldRect.top + goldRect.height / 2 }
      : { x: window.innerWidth * 0.8, y: 30 };

    const attrTarget = attrRect
      ? { x: attrRect.left + attrRect.width / 2, y: attrRect.top + attrRect.height / 2 }
      : { x: window.innerWidth * 0.25, y: window.innerHeight * 0.6 };

    const newParticles: FlyingParticle[] = [];
    const timestamp = Date.now();

    // Spawn 8 XP Particles
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: `xp-${timestamp}-${i}`,
        startX: event.startX + (Math.random() * 30 - 15),
        startY: event.startY + (Math.random() * 20 - 10),
        targetX: xpTarget.x,
        targetY: xpTarget.y,
        type: 'xp',
        color: i % 2 === 0 ? '#f59e0b' : '#38bdf8',
        glow: 'rgba(245, 158, 11, 0.9)',
        delay: i * 0.05,
        duration: 0.65 + i * 0.04,
      });
    }

    // If willLevelUp is TRUE: do not spawn gold/attribute celebratory cascades
    if (!event.willLevelUp) {
      // Spawn 6 Gold Coins
      for (let i = 0; i < 6; i++) {
        newParticles.push({
          id: `gold-${timestamp}-${i}`,
          startX: event.startX + (Math.random() * 24 - 12),
          startY: event.startY + (Math.random() * 20 - 10),
          targetX: goldTarget.x,
          targetY: goldTarget.y,
          type: 'gold',
          color: '#fbbf24',
          glow: 'rgba(251, 191, 36, 0.9)',
          delay: 0.15 + i * 0.05,
          duration: 0.75 + i * 0.04,
        });
      }

      // Spawn 5 Attribute Rune Wisps
      const attrConfig = ATTRIBUTE_COLORS[event.attribute] || {
        color: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.8)',
      };

      for (let i = 0; i < 5; i++) {
        newParticles.push({
          id: `attr-${timestamp}-${i}`,
          startX: event.startX + (Math.random() * 24 - 12),
          startY: event.startY + (Math.random() * 20 - 10),
          targetX: attrTarget.x,
          targetY: attrTarget.y,
          type: 'attribute',
          color: attrConfig.color,
          glow: attrConfig.glow,
          delay: 0.2 + i * 0.05,
          duration: 0.7 + i * 0.04,
        });
      }
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Trigger XP arrival when the majority of XP particles hit
    setTimeout(() => {
      playXpAbsorbSound();
      if (xpMeterEl) {
        xpMeterEl.classList.add('scale-[1.03]');
        setTimeout(() => xpMeterEl.classList.remove('scale-[1.03]'), 300);
      }
      if (event.onXpArrival) {
        event.onXpArrival();
      }
    }, 720);

    // If NOT level up, trigger gold and attribute arrival
    if (!event.willLevelUp) {
      setTimeout(() => {
        playCoinSound();
        if (goldCounterEl) {
          goldCounterEl.classList.add('scale-125', 'text-yellow-200');
          setTimeout(() => goldCounterEl.classList.remove('scale-125', 'text-yellow-200'), 350);
        }
      }, 850);

      setTimeout(() => {
        // Trigger Character/Companion Reaction!
        window.dispatchEvent(
          new CustomEvent('hero-soul-reaction', {
            detail: { attribute: event.attribute },
          })
        );
      }, 920);

      setTimeout(() => {
        if (event.onFinished) {
          event.onFinished();
        }
      }, 1100);
    }

    // Clean up particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !p.id.startsWith(`xp-${timestamp}`) && !p.id.startsWith(`gold-${timestamp}`) && !p.id.startsWith(`attr-${timestamp}`)));
    }, 1600);
  }, []);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<CompletionParticleEvent>;
      if (customEvent.detail) {
        spawnParticles(customEvent.detail);
      }
    };

    window.addEventListener('trigger-quest-particles', handleTrigger);
    return () => window.removeEventListener('trigger-quest-particles', handleTrigger);
  }, [spawnParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          // Midpoint control point for natural quadratic arc trajectory
          const midX = (p.startX + p.targetX) / 2 + (p.startX > p.targetX ? 40 : -40);
          const midY = Math.min(p.startY, p.targetY) - (p.type === 'gold' ? 80 : 40);

          return (
            <motion.div
              key={p.id}
              initial={{
                x: p.startX,
                y: p.startY,
                scale: 0.6,
                opacity: 0,
              }}
              animate={{
                x: [p.startX, midX, p.targetX],
                y: [p.startY, midY, p.targetY],
                scale: [0.6, 1.4, 0.2],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                position: 'absolute',
                width: p.type === 'gold' ? '10px' : '8px',
                height: p.type === 'gold' ? '10px' : '8px',
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 12px ${p.glow}`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
