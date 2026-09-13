import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayPhase: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  glow: boolean;
}

export const FallingSanctumParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Curated Sanctum particle color palette (cathedral dust, golden motes, cool sacred ash)
    const particleColors = [
      '245, 158, 11',   // Amber gold
      '251, 191, 36',   // Radiant sunbeam yellow
      '253, 186, 116',  // Warm orange ember
      '226, 232, 240',  // Ethereal silver dust
      '214, 211, 209',  // Cool stone ash
      '254, 243, 199',  // Pale ivory motes
    ];

    const PARTICLE_COUNT = 65;
    const particles: Particle[] = [];

    // Initialize particles scattered throughout the screen
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorRgb = particleColors[Math.floor(Math.random() * particleColors.length)];
      const isGlow = Math.random() > 0.6;
      const radius = isGlow ? Math.random() * 1.6 + 1.0 : Math.random() * 1.4 + 0.6;
      const baseAlpha = Math.random() * 0.45 + 0.2;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        speedY: Math.random() * 0.75 + 0.35, // Downward velocity
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayAmplitude: Math.random() * 1.5 + 0.5,
        swayPhase: Math.random() * Math.PI * 2,
        baseAlpha,
        alpha: baseAlpha,
        color: colorRgb,
        glow: isGlow,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Downward vertical motion
        p.y += p.speedY;

        // Subtle horizontal sway
        p.x += Math.sin(time * p.swaySpeed + p.swayPhase) * (p.swayAmplitude * 0.4);

        // Gentle breathing alpha pulsation
        p.alpha = p.baseAlpha + Math.sin(time + p.swayPhase) * 0.12;

        // Recycle particle when it drifts past the bottom
        if (p.y > height + 15) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        // Recycle if it drifts off horizontal bounds
        if (p.x < -15) p.x = width + 10;
        if (p.x > width + 15) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${p.color}, ${Math.min(1, p.alpha * 1.2)})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.08, p.alpha)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
    />
  );
};
