import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { GradientTexture } from './utils/GradientTexture';

// Background with buildings and plants component
export const Background = React.memo(() => {
  // Create buildings in the background
  const buildings = useMemo(() => {
    const buildingGroups = [];
    
    // Create a skyline of various buildings
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = -15 - Math.random() * 10;
      const width = 1 + Math.random() * 2;
      const depth = 1 + Math.random() * 2;
      const height = 3 + Math.random() * 7;
      
      // Different colors for buildings
      const colors = ['#d1d1e0', '#c2c2d6', '#9999cc', '#b3b3cc', '#e0e0eb'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Add windows to buildings
      const windows = [];
      const windowsPerFloor = Math.floor(2 + Math.random() * 3);
      const floors = Math.floor(height / 0.8);
      
      for (let floor = 0; floor < floors; floor++) {
        for (let w = 0; w < windowsPerFloor; w++) {
          windows.push(
            <mesh 
              key={`window-${floor}-${w}`} 
              position={[
                (w / windowsPerFloor - 0.5 + 0.5/windowsPerFloor) * width * 0.9,
                floor * 0.8 + 0.4,
                depth/2 + 0.01
              ]}
            >
              <planeGeometry args={[0.2, 0.3]} />
              <meshStandardMaterial 
                color={Math.random() > 0.7 ? '#ffff99' : '#222233'} 
                emissive={Math.random() > 0.7 ? '#ffff99' : '#000000'}
                emissiveIntensity={Math.random() > 0.7 ? 0.5 : 0}
              />
            </mesh>
          );
        }
      }
      
      buildingGroups.push(
        <group key={i} position={[x, height/2, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {windows}
        </group>
      );
    }
    
    return buildingGroups;
  }, []);
  
  // Create plants and landscaping
  const plants = useMemo(() => {
    const plantElements = [];
    
    // Create a ground area with grass - adjust to match floor position
    plantElements.push(
      <mesh 
        key="grass" 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.49, 0]}  // Keep this just slightly above floor to prevent z-fighting
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#386e36" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    );
    
    // Add potted plants near the ribbon - adjust height to place on floor
    for (let i = 0; i < 6; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const offset = Math.floor(i / 2) - 1;
      
      plantElements.push(
        <group key={`plant-${i}`} position={[side * (3 + offset * 0.8), -0.5, 2 + offset * 0.5]}>
          {/* Pot */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#a06235" roughness={0.7} />
          </mesh>
          
          {/* Plant leaves - no need to change these as they're relative to the group */}
          {[...Array(12)].map((_, leafIndex) => {
            const angle = (leafIndex / 12) * Math.PI * 2;
            const radius = 0.2 + Math.random() * 0.1;
            const height = 0.3 + Math.random() * 0.5;
            
            return (
              <mesh 
                key={`leaf-${i}-${leafIndex}`}
                position={[
                  Math.sin(angle) * radius,
                  0.4 + height/2,
                  Math.cos(angle) * radius
                ]}
                rotation={[
                  Math.random() * 0.3 - 0.15,
                  angle + Math.PI,
                  Math.PI/2 + (Math.random() * 0.3 - 0.15)
                ]}
                castShadow
              >
                <planeGeometry args={[height, 0.2]} />
                <meshStandardMaterial 
                  color={Math.random() > 0.3 ? '#2d5c2d' : '#1e3d1e'} 
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </group>
      );
    }
    
    // Add decorative bushes and small trees - adjust to place on floor
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() * 15) - 5; // Keep in front of buildings but behind ribbon area
      const size = 0.5 + Math.random() * 0.7;
      
      // Only place bushes away from the center where the ribbon is
      if (Math.abs(x) < 4 && z > -2 && z < 4) continue;
      
      // Tree (trunk + foliage) - adjust y position
      if (Math.random() > 0.6) {
        plantElements.push(
          <group key={`tree-${i}`} position={[x, -0.5, z]}>
            {/* Trunk */}
            <mesh position={[0, size * 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.15, size * 1.6, 8]} />
              <meshStandardMaterial color="#5c4033" roughness={0.9} />
            </mesh>
            
            {/* Foliage */}
            <mesh position={[0, size * 1.8, 0]} castShadow>
              <coneGeometry args={[size * 0.7, size * 2, 8]} />
              <meshStandardMaterial color="#1e6e1e" roughness={0.8} />
            </mesh>
          </group>
        );
      } 
      // Bush - adjust y position
      else {
        plantElements.push(
          <mesh 
            key={`bush-${i}`} 
            position={[x, size * 0.5 - 0.5, z]} 
            castShadow
          >
            <sphereGeometry args={[size, 16, 12]} />
            <meshStandardMaterial 
              color={Math.random() > 0.5 ? '#2e8b57' : '#228b22'} 
              roughness={0.8} 
            />
          </mesh>
        );
      }
    }
    
    return plantElements;
  }, []);
  
  // Create sky gradient with direct texture creation
  const skyTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 1024);
    
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(0.5, '#b0e0e6');
    gradient.addColorStop(1, '#f0f8ff');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 1024);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, []);
  
  const sky = useMemo(() => {
    return (
      <mesh position={[0, 0, -30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial map={skyTexture} />
      </mesh>
    );
  }, [skyTexture]);
  
  return (
    <group>
      {sky}
      {buildings}
      {plants}
    </group>
  );
}); 