import React, { useMemo } from 'react';
import * as THREE from 'three';

// Enhanced Ribbon stand component with more details
export const RibbonStand = React.memo(({ position = [0, 0, 0], height = 1.6 }) => {
  const baseSize = { width: 0.8, height: 0.2, depth: 0.8 };
  const poleRadius = 0.08;
  const topCapSize = { radius: 0.15, height: 0.1 };
  
  // Create wood texture for the pole
  const woodTexture = useMemo(() => {
    const woodTextureCanvas = document.createElement('canvas');
    woodTextureCanvas.width = 512;
    woodTextureCanvas.height = 512;
    const ctx = woodTextureCanvas.getContext('2d');
    
    // Fill with base wood color
    ctx.fillStyle = '#cd8c52';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add wood grain
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(101, 67, 33, ${Math.random() * 0.15})`;
      ctx.lineWidth = Math.random() * 6 + 1;
      const xStart = 0;
      const xEnd = 512;
      const y = Math.random() * 512;
      ctx.moveTo(xStart, y);
      ctx.lineTo(xEnd, y + (Math.random() * 20 - 10));
      ctx.stroke();
    }
    
    // Add some wood knots
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 20 + 5;
      
      const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grd.addColorStop(0, '#5d4037');
      grd.addColorStop(0.7, '#8d6e63');
      grd.addColorStop(1, '#cd8c52');
      
      ctx.beginPath();
      ctx.fillStyle = grd;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(woodTextureCanvas);
  }, []);
  
  // Material with envMapIntensity properly set
  const marbleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "#f0f0f0",
      metalness: 0.1,
      roughness: 0.2
    });
    material.envMapIntensity = 0.5;
    return material;
  }, []);
  
  // Calculate the adjusted vertical position so the base sits on the floor at y=-0.5
  const adjustedY = position[1] - 0.5;
  
  return (
    <group position={[position[0], adjustedY, position[2]]}>
      {/* Base (marble-like) */}
      <mesh position={[0, baseSize.height/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseSize.width, baseSize.height, baseSize.depth]} />
        <primitive object={marbleMaterial} />
      </mesh>
      
      {/* Pole */}
      <mesh position={[0, baseSize.height + height/2, 0]} castShadow>
        <cylinderGeometry args={[poleRadius, poleRadius, height, 16]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Top cap */}
      <mesh position={[0, baseSize.height + height, 0]} castShadow>
        <cylinderGeometry args={[topCapSize.radius, topCapSize.radius, topCapSize.height, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Decorative ring 1 */}
      <mesh position={[0, baseSize.height + height * 0.8, 0]} castShadow>
        <torusGeometry args={[poleRadius * 1.5, poleRadius * 0.3, 16, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Decorative ring 2 */}
      <mesh position={[0, baseSize.height + height * 0.2, 0]} castShadow>
        <torusGeometry args={[poleRadius * 1.5, poleRadius * 0.3, 16, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}); 