import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { createRibbonGeometry } from './utils/createRibbonGeometry';

// Enhanced Ribbon segment component
export const RibbonSegment = React.memo(({
  position = [0, 0, 0],
  width = 2,
  height = 0.8,
  depth = 0.05,
  color = "#ff0000",
  isCut = false,
  dropDirection = [0, -1, 0],
  rotationOnDrop = [0, 0, 0]
}) => {
  console.log("RibbonSegment rendered, isCut:", isCut);
  const [isDetached, setIsDetached] = useState(false);
  const meshRef = useRef();
  
  // Physics ref for the ribbon segment - remove the onReady callback
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position,
    args: [width, height, depth],
    type: isCut ? 'dynamic' : 'static',
    allowSleep: true,
    sleepSpeedLimit: 0.1,
    sleepTimeLimit: 1
  }), useRef(null), [isCut]);
  
  // Handle cutting effect
  useEffect(() => {
    console.log("RibbonSegment effect running, isCut:", isCut, "isDetached:", isDetached);
    if (isCut && !isDetached && api) {
      console.log("Applying physics to ribbon segment");
      // Safety checks before calling methods
      if (api.mass && typeof api.mass.set === 'function') {
        api.mass.set(1);
      }
      
      if (api.type && typeof api.type.set === 'function') {
        api.type.set('dynamic');
      }
      
      // Apply impulse and torque after a small delay
      const timer = setTimeout(() => {
        console.log("Applying forces to ribbon segment");
        if (api.applyLocalForce && typeof api.applyLocalForce === 'function') {
          api.applyLocalForce(
            [dropDirection[0] * 30, dropDirection[1] * 50, dropDirection[2] * 10], 
            [0, 0, 0]
          );
        }
        
        if (api.applyTorque && typeof api.applyTorque === 'function') {
          api.applyTorque([
            rotationOnDrop[0] * 5,
            rotationOnDrop[1] * 5,
            rotationOnDrop[2] * 5
          ]);
        }
        
        setIsDetached(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isCut, isDetached, api, dropDirection, rotationOnDrop]);
  
  // Create satin-like texture using useMemo to avoid recreation on every render
  const texture = useMemo(() => {
    const ribbonTexture = document.createElement('canvas');
    ribbonTexture.width = 256;
    ribbonTexture.height = 256;
    const ctx = ribbonTexture.getContext('2d');
    
    // Create a gradient background
    const grd = ctx.createLinearGradient(0, 0, 256, 256);
    const baseColor = new THREE.Color(color);
    const lighterColor = new THREE.Color(color).multiplyScalar(1.2);
    
    grd.addColorStop(0, baseColor.getStyle());
    grd.addColorStop(0.5, lighterColor.getStyle());
    grd.addColorStop(1, baseColor.getStyle());
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 256);
    
    // Add satin-like pattern
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.moveTo(0, i * 15);
      ctx.lineTo(256, i * 15);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(ribbonTexture);
  }, [color]);
  
  // Use memoized geometry to avoid recreation on every render
  const geometry = useMemo(() => createRibbonGeometry(width, height, depth), [width, height, depth]);
  
  // Create material using useMemo
  const ribbonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      map: texture,
      envMapIntensity: 0.5
    });
  }, [color, texture]);
  
  return (
    <mesh
      ref={physicsRef}
      castShadow
      receiveShadow
      userData={{ type: 'ribbon' }}
    >
      <primitive 
        object={geometry} 
        attach="geometry" 
      />
      <primitive 
        object={ribbonMaterial} 
        attach="material" 
      />
    </mesh>
  );
}); 