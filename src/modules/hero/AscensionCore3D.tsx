import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Attributes } from '../../types';

interface AscensionCore3DProps {
  stats: Attributes;
  level: number;
}

export const AscensionCore3D: React.FC<AscensionCore3DProps> = ({ stats, level }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Determine dominant stat color with restrained dark fantasy hues
  const dominantStat = Object.entries(stats).reduce(
    (max, [stat, val]) => (val > max.val ? { stat, val } : max),
    { stat: 'intellect', val: 0 }
  ).stat;

  // Restrained gothic jewel tones
  const colorMap: Record<string, { hex: number; wire: number }> = {
    strength: { hex: 0x8f2828, wire: 0x6e1f1f },
    intellect: { hex: 0x254b79, wire: 0x1d3a5e },
    charisma: { hex: 0x58366d, wire: 0x432953 },
    creativity: { hex: 0x1e5941, wire: 0x174533 },
  };

  const coreColors = colorMap[dominantStat] || { hex: 0x8a6230, wire: 0x5c462b };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 140;
    const height = mount.clientHeight || 140;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 5.4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Inner Obsidian Arcane Core (Octahedron)
    const innerGeometry = new THREE.OctahedronGeometry(1.0, 0);
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: coreColors.hex,
      emissive: coreColors.hex,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.85,
      reflectivity: 0.8,
      clearcoat: 0.8,
    });
    const innerCrystal = new THREE.Mesh(innerGeometry, innerMaterial);
    group.add(innerCrystal);

    // 2. Outer Forged Bronze Astrolabe Ring (Torus & Icosahedron Wireframe)
    const outerGeometry = new THREE.IcosahedronGeometry(1.45, 0);
    const outerWireframe = new THREE.WireframeGeometry(outerGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8a6230,
      transparent: true,
      opacity: 0.5,
      linewidth: 1,
    });
    const outerShield = new THREE.LineSegments(outerWireframe, lineMaterial);
    group.add(outerShield);

    // 3. Orbiting Ember Motifs
    const emberCount = 60;
    const emberGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.6;
      const phi = (Math.random() - 0.5) * 0.9;
      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta);
    }
    emberGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const emberMaterial = new THREE.PointsMaterial({
      color: 0xc59b27,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeometry, emberMaterial);
    group.add(embers);

    // Atmospheric Warm Point Lights
    const ambientLight = new THREE.AmbientLight(0xdcd7cc, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(coreColors.hex, 2.0, 30);
    pointLight1.position.set(2, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8a6230, 1.2, 30);
    pointLight2.position.set(-2, -2, -2);
    scene.add(pointLight2);

    // Mouse Tracking for Interactive 3D Parallax Tilt
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 1.2;
      targetRotationX = y * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Dignified slow rotation
      innerCrystal.rotation.x += delta * 0.25;
      innerCrystal.rotation.y += delta * 0.35;

      outerShield.rotation.x -= delta * 0.18;
      outerShield.rotation.y -= delta * 0.22;

      embers.rotation.y += delta * 0.2;
      embers.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15;

      // Subtle breathing pulse
      const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.025;
      innerCrystal.scale.set(pulse, pulse, pulse);

      // Smooth mouse damping tilt
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.06;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [coreColors, level]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        ref={mountRef}
        className="w-24 h-24 sm:w-28 sm:h-28 cursor-grab active:cursor-grabbing relative z-10"
        title="Interactive 3D Arcane Astrolabe (Hover to inspect)"
      />
      <div className="text-[9px] font-serif tracking-[0.2em] text-sanctum-ash uppercase -mt-1 text-center">
        <span>SOUL RELIC</span>
      </div>
    </div>
  );
};
