import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Shield, Dumbbell, BookOpen, Crown, Palette, Package } from 'lucide-react';
import { useGameState } from '../core/GameStateContext';
import { playChestLatchSound, playChestOpenSound } from './SoundEffects';

interface InventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  FlaskConical: Sparkles,
  Shield: Shield,
  Dumbbell: Dumbbell,
  BookOpen: BookOpen,
  Crown: Crown,
  Palette: Palette,
};

const RARITY_STYLES: Record<string, { border: string; text: string; glow: string }> = {
  Legendary: { border: 'border-amber-500/70', text: 'text-amber-300', glow: 'shadow-rune-gold' },
  Epic: { border: 'border-purple-500/60', text: 'text-purple-300', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]' },
  Rare: { border: 'border-sky-500/50', text: 'text-sky-300', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.2)]' },
  Common: { border: 'border-white/10', text: 'text-slate-300', glow: '' },
};

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({ isOpen, onClose }) => {
  const { inventory, equipItem, isMuted } = useGameState();
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [chestOpened, setChestOpened] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;
    const categories = ['all', 'title', 'equipment', 'potion', 'theme'];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (categories[idx]) {
          setActiveCategory(categories[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setChestOpened(false);
      return;
    }

    // Safety fallback: Ensure chest opens and displays items even if WebGL is delayed/unavailable
    const fallbackTimer = setTimeout(() => {
      setChestOpened(true);
    }, 850);

    // Phase 1: Metallic Latch Sound
    if (!isMuted) {
      playChestLatchSound();
    }

    const mount = canvasMountRef.current;
    if (!mount) {
      setChestOpened(true);
      return () => clearTimeout(fallbackTimer);
    }

    const width = mount.clientWidth || 420;
    const height = mount.clientHeight || 240;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let animationFrameId: number = 0;
    let tl: gsap.core.Timeline | null = null;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 2.2, 5.2);
      camera.lookAt(0, 0.3, 0);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init fallback:', e);
      setChestOpened(true);
      return () => clearTimeout(fallbackTimer);
    }

    // Master Chest Assembly Group
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, -0.2, 0);
    scene.add(chestGroup);

    // ==========================================
    // 1. CHEST BASE (Dark Weathered Wood & Bronze)
    // ==========================================
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x16110b, // Deep aged charcoal oak
      roughness: 0.85,
      metalness: 0.12,
    });

    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a6230, // Weathered antique bronze
      roughness: 0.38,
      metalness: 0.82,
    });

    const ironLockMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d4452,
      roughness: 0.45,
      metalness: 0.9,
    });

    const runeGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xe2bc49,
      transparent: true,
      opacity: 0.7,
    });

    // Main base body
    const baseWidth = 2.4;
    const baseHeight = 1.0;
    const baseDepth = 1.5;
    const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const baseMesh = new THREE.Mesh(baseGeo, woodMaterial);
    chestGroup.add(baseMesh);

    // Bronze Corner Brackets (4 corners)
    const bracketWidth = 0.15;
    const cornerPositions = [
      { x: -baseWidth / 2 + bracketWidth / 2, z: -baseDepth / 2 + bracketWidth / 2 },
      { x: baseWidth / 2 - bracketWidth / 2, z: -baseDepth / 2 + bracketWidth / 2 },
      { x: -baseWidth / 2 + bracketWidth / 2, z: baseDepth / 2 - bracketWidth / 2 },
      { x: baseWidth / 2 - bracketWidth / 2, z: baseDepth / 2 - bracketWidth / 2 },
    ];

    cornerPositions.forEach((pos) => {
      const cornerGeo = new THREE.BoxGeometry(bracketWidth * 1.5, baseHeight + 0.02, bracketWidth * 1.5);
      const cornerMesh = new THREE.Mesh(cornerGeo, bronzeMaterial);
      cornerMesh.position.set(pos.x, 0, pos.z);
      chestGroup.add(cornerMesh);
    });

    // Bronze Horizontal Rim Belt
    const rimGeo = new THREE.BoxGeometry(baseWidth + 0.04, 0.12, baseDepth + 0.04);
    const rimMesh = new THREE.Mesh(rimGeo, bronzeMaterial);
    rimMesh.position.set(0, baseHeight / 2 - 0.06, 0);
    chestGroup.add(rimMesh);

    // Front Lock Escutcheon Plate
    const lockPlateGeo = new THREE.BoxGeometry(0.35, 0.4, 0.06);
    const lockPlate = new THREE.Mesh(lockPlateGeo, bronzeMaterial);
    lockPlate.position.set(0, 0.1, baseDepth / 2 + 0.02);
    chestGroup.add(lockPlate);

    const keyholeGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.08, 8);
    const keyhole = new THREE.Mesh(keyholeGeo, ironLockMaterial);
    keyhole.rotation.x = Math.PI / 2;
    keyhole.position.set(0, 0.1, baseDepth / 2 + 0.06);
    chestGroup.add(keyhole);

    // Magical Seam Rune Inscriptions on Base
    const runeSeamGeo = new THREE.BoxGeometry(baseWidth * 0.8, 0.02, 0.02);
    const runeSeam = new THREE.Mesh(runeSeamGeo, runeGlowMaterial);
    runeSeam.position.set(0, -0.15, baseDepth / 2 + 0.02);
    chestGroup.add(runeSeam);

    // ==========================================
    // 2. CHEST LID (Pivots from back-top hinge)
    // ==========================================
    const lidGroup = new THREE.Group();
    // Set pivot origin at top back edge
    lidGroup.position.set(0, baseHeight / 2, -baseDepth / 2);
    chestGroup.add(lidGroup);

    // Lid Box Offset so it covers the base
    const lidHeight = 0.55;
    const lidGeo = new THREE.BoxGeometry(baseWidth + 0.06, lidHeight, baseDepth + 0.06);
    const lidMesh = new THREE.Mesh(lidGeo, woodMaterial);
    // Position center relative to back hinge
    lidMesh.position.set(0, lidHeight / 2, baseDepth / 2);
    lidGroup.add(lidMesh);

    // Bronze Rib Arches across Lid
    const ribGeo = new THREE.BoxGeometry(0.12, lidHeight + 0.03, baseDepth + 0.08);
    [-0.7, 0, 0.7].forEach((xOffset) => {
      const rib = new THREE.Mesh(ribGeo, bronzeMaterial);
      rib.position.set(xOffset, lidHeight / 2, baseDepth / 2);
      lidGroup.add(rib);
    });

    // Front Hasp Clasp hanging down from lid
    const haspGeo = new THREE.BoxGeometry(0.18, 0.35, 0.05);
    const haspMesh = new THREE.Mesh(haspGeo, bronzeMaterial);
    haspMesh.position.set(0, -0.05, baseDepth + 0.04);
    lidGroup.add(haspMesh);

    // ==========================================
    // 3. WARM MAGICAL RADIANCE & PARTICLES
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xdcd7cc, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecd0, 0.9);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Warm Interior Magical PointLight (Starts dark, flares open!)
    const interiorLight = new THREE.PointLight(0xffa726, 0.0, 6);
    interiorLight.position.set(0, 0.2, 0);
    chestGroup.add(interiorLight);

    // Rising Golden Stardust Particle System
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { y: number; theta: number; radius: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.8;
      particlePositions[i * 3 + 1] = Math.random() * 0.4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.1;
      particleVelocities.push({
        y: 0.8 + Math.random() * 1.2,
        theta: Math.random() * Math.PI * 2,
        radius: 0.2 + Math.random() * 0.8,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd54f,
      size: 0.06,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    chestGroup.add(particleSystem);

    // ==========================================
    // 4. TIMELINE SEQUENCING (800ms - 1200ms)
    // ==========================================
    tl = gsap.timeline();

    // 0ms: Subtle Initial Latch Shake
    tl.to(haspMesh.rotation, {
      x: 0.3,
      duration: 0.12,
      ease: 'power2.out',
      onComplete: () => {
        if (!isMuted) playChestOpenSound();
      }
    }, 0.15);

    // 180ms: Spring Lid Opening (Recoil back physics!)
    tl.to(lidGroup.rotation, {
      x: -Math.PI * 0.62, // Swings open ~112 degrees
      duration: 0.65,
      ease: 'back.out(1.4)',
    }, 0.22);

    // Interior Warm Light Flares Up
    tl.to(interiorLight, {
      intensity: 5.0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.28);

    // Particle Alpha Flares Up
    tl.to(particleMat, {
      opacity: 0.85,
      duration: 0.4,
      ease: 'power1.out',
    }, 0.3);

    // Camera Subtly Pushes Toward Chest
    tl.to(camera.position, {
      z: 4.4,
      y: 1.8,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.22);

    // 750ms: Trigger UI Item Emergence from Chest!
    tl.add(() => {
      setChestOpened(true);
    }, 0.72);

    // Animation Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Animate floating stardust particles
      if (particleMat.opacity > 0.05) {
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleVelocities[i].y * delta;
          if (positions[i * 3 + 1] > 2.5) {
            positions[i * 3 + 1] = 0.2;
            positions[i * 3] = (Math.random() - 0.5) * 1.8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1.1;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // Gentle chest idle breathing
      chestGroup.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.03;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      clearTimeout(fallbackTimer);
      if (tl) tl.kill();
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      baseGeo.dispose();
      lidGeo.dispose();
      woodMaterial.dispose();
      bronzeMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isOpen, isMuted]);

  if (!isOpen) return null;

  const filteredInventory = inventory.filter(
    (inv) => inv && inv.item_data && (activeCategory === 'all' || inv.item_data.category === activeCategory)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none">
      {/* Background Vignette Aura */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 via-transparent to-black pointer-events-none" />

      {/* Main Chest & Reliquary Vault Container */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#070a10]/95 border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vault-title"
      >
        {/* Intaglio Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 relative z-20 bg-[#040609]">
          <div>
            <div className="text-[9px] font-mono tracking-[0.3em] text-amber-500/90 uppercase font-semibold">
              SANCTUARY RELIQUARY · PHYSICAL VAULT
            </div>
            <h2 id="vault-title" className="text-lg sm:text-2xl font-serif tracking-widest text-slate-100 font-bold uppercase">
              The Hero's Chest
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono tracking-wider text-sanctum-ash hidden sm:block">
              <span>{inventory.length} RELICS INSCRIBED</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Seal Chest and Dismiss"
              className="p-1.5 text-slate-400 hover:text-amber-200 border border-transparent hover:border-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D Physical Treasure Chest Stage (Top Anchor)             */}
        {/* ========================================================= */}
        <div className="relative w-full h-48 sm:h-56 bg-gradient-to-b from-[#030508] to-[#080c14] border-b border-white/[0.08] flex items-center justify-center overflow-hidden">
          {/* Three.js Canvas Container */}
          <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Magical Flare Burst behind chest */}
          <div
            className={`absolute w-72 h-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none transition-opacity duration-700 ${
              chestOpened ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Chest Label Inscription */}
          <div className="absolute bottom-2 left-6 text-[9px] font-serif tracking-[0.25em] text-sanctum-ash uppercase pointer-events-none">
            <span>CHEST OF THE WANING SENTINEL</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Category Filters Bar                                      */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#05080e] border-b border-white/[0.06] text-[10px] font-serif tracking-wider overflow-x-auto">
          {['all', 'title', 'equipment', 'potion', 'theme'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 uppercase transition cursor-pointer border ${
                activeCategory === cat
                  ? 'border-amber-500/80 text-amber-300 font-bold bg-amber-950/40 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Inscribed Relics' : cat}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* Staggered Item Emergence / Relic Rows                     */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#05070c]">
          <AnimatePresence>
            {!chestOpened ? (
              <div className="text-center py-12 text-slate-500 font-serif text-xs tracking-widest uppercase animate-pulse">
                Unsealing the Ancient Lock...
              </div>
            ) : filteredInventory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 text-slate-400 font-serif space-y-2"
              >
                <Package className="w-10 h-10 mx-auto opacity-30 text-amber-500 mb-2" />
                <p className="text-xs tracking-widest uppercase text-slate-300 font-bold">
                  The Chest Cavity is Empty
                </p>
                <p className="text-[11px] font-sans text-slate-500 max-w-sm mx-auto">
                  Acquire relics, continuity shields, and grand titles in the Merchant's Armory to store them within your physical vault.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {filteredInventory.map((inv) => {
                  const item = inv.item_data;
                  const Icon = ICON_MAP[item.icon] || Sparkles;
                  const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.Common;
                  const canEquip = item.category === 'title' || item.category === 'theme' || item.category === 'equipment';

                  return (
                    <motion.div
                      key={inv.id}
                      variants={{
                        hidden: { opacity: 0, y: 35, scale: 0.95 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: 'spring',
                            damping: 18,
                            stiffness: 220,
                          },
                        },
                      }}
                      className={`p-3.5 bg-[#070b12] border transition-all duration-300 flex items-center justify-between gap-3.5 group hover:border-amber-500/40 ${
                        inv.equipped ? 'border-amber-500/80 shadow-rune-gold' : rarityStyle.border
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Relic Icon Medallion */}
                        <div
                          className={`w-10 h-10 bg-black/80 border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                            rarityStyle.border
                          } ${rarityStyle.text}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Relic Metadata */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-serif tracking-wider text-slate-100 uppercase font-bold truncate">
                              {item.name}
                            </h4>
                            <span
                              className={`text-[8px] font-mono tracking-widest px-1.5 py-0.2 border uppercase ${rarityStyle.border} ${rarityStyle.text}`}
                            >
                              {item.rarity}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 font-sans leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Attunement Action */}
                      {canEquip && (
                        <button
                          onClick={() => equipItem(inv.id)}
                          className={`px-3.5 py-1.5 text-[9px] font-serif tracking-[0.2em] uppercase transition cursor-pointer border flex-shrink-0 ${
                            inv.equipped
                              ? 'border-amber-500 text-amber-200 bg-amber-950/50 shadow-sm'
                              : 'border-white/15 text-slate-400 hover:text-slate-100 hover:border-white/40 bg-black/40'
                          }`}
                        >
                          {inv.equipped ? (
                            <span className="flex items-center gap-1 font-bold">
                              <Check className="w-3 h-3 text-amber-400" /> Attuned
                            </span>
                          ) : (
                            <span>Attune</span>
                          )}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Footer Note */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#030508] flex items-center justify-between text-[9px] font-serif tracking-[0.2em] text-sanctum-ash uppercase">
          <span>Relics remain preserved indefinitely within the sanctum</span>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-200 uppercase transition cursor-pointer font-bold"
          >
            Close Vault [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
