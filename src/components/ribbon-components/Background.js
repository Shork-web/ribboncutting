import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Seeded random function for consistent results
function seededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Create a single random instance for consistent generation
const rand = seededRandom(12345);

// Pre-generate all static data outside of the component
// Buildings data
const BUILDINGS_DATA = Array(15).fill().map((_, i) => {
  const x = (rand() - 0.5) * 30;
  const z = -15 - rand() * 10;
  const width = 1 + rand() * 2;
  const depth = 1 + rand() * 2;
  const height = 3 + rand() * 7;
  const colors = ['#d1d1e0', '#c2c2d6', '#9999cc', '#b3b3cc', '#e0e0eb'];
  const color = colors[Math.floor(rand() * colors.length)];
  
  // Determine if it's a residential or office building (affects window pattern)
  const isOfficeBuilding = rand() > 0.4;
  
  // Adjust window count based on building width
  const windowsPerFloor = Math.max(1, Math.floor(width * 1.5));
  const windowsPerSide = Math.max(1, Math.floor(depth * 1.5));
  
  // Calculate the max number of floors based on building height
  // Leave space for top and bottom of building
  const floorHeight = 0.8;
  const maxFloors = Math.max(1, Math.floor((height - 0.4) / floorHeight));
  
  // Calculate time-of-day lighting pattern (more lit windows at night)
  const litWindowProbability = 0.3; // Adjust based on day/night cycle
  
  const windows = [];
  
  // Add front windows - ensure they stay within building height
  for (let floor = 0; floor < maxFloors; floor++) {
    // Skip some floors randomly for visual variety
    if (rand() < 0.1) continue;
    
    // Calculate vertical position - ensure it's within building bounds
    const yPosition = floor * floorHeight + (floorHeight / 2);
    
    // Make sure window doesn't exceed building height
    if (yPosition >= height - 0.2) continue;
    
    for (let w = 0; w < windowsPerFloor; w++) {
      // Skip some windows randomly for more realistic appearance
      if (rand() < 0.15) continue;
      
      // Calculate window position with better spacing
      const windowSpacing = width / (windowsPerFloor + 1);
      const xPosition = (w + 1) * windowSpacing - width/2;
      
      // Determine if window is lit based on building type
      // Office buildings have a more regular pattern, residential more random
      let isLit;
      if (isOfficeBuilding) {
        // Office buildings tend to have floors entirely lit or unlit
        isLit = floor % 2 === 0 ? rand() > 0.5 : rand() > 0.8;
      } else {
        // Residential buildings have more random patterns
        isLit = rand() < litWindowProbability;
      }
      
      // Make windows appear on front side of building
      windows.push({
        side: 'front',
        floor,
        w,
        isLit,
        position: [
          xPosition,
          yPosition,
          depth/2 + 0.002 // Slightly in front of the building face
        ],
        rotation: [0, 0, 0],
        size: [width * 0.12, Math.min(0.25, floorHeight * 0.7)] // Ensure window height isn't too tall
      });
    }
  }
  
  // Add side windows (only if building is deep enough)
  if (depth > 1) {
    for (let floor = 0; floor < maxFloors; floor++) {
      // Skip some floors randomly for visual variety
      if (rand() < 0.1) continue;
      
      // Calculate vertical position - ensure it's within building bounds
      const yPosition = floor * floorHeight + (floorHeight / 2);
      
      // Make sure window doesn't exceed building height
      if (yPosition >= height - 0.2) continue;
      
      for (let w = 0; w < windowsPerSide; w++) {
        // Skip some windows randomly
        if (rand() < 0.15) continue;
        
        // Calculate window position with better spacing
        const windowSpacing = depth / (windowsPerSide + 1);
        const zPosition = (w + 1) * windowSpacing - depth/2;
        
        // Only add side windows if they would be visible to the camera (buildings on the right side)
        if (x > 0 && rand() < 0.7) {
          // Determine if window is lit based on building type
          let isLit;
          if (isOfficeBuilding) {
            // Maintain consistent lighting with front windows
            isLit = floor % 2 === 0 ? rand() > 0.5 : rand() > 0.8;
          } else {
            // Residential buildings have more random patterns
            isLit = rand() < litWindowProbability;
          }
          
          // Left side windows (visible when building is on the right of the scene)
          windows.push({
            side: 'left',
            floor,
            w,
            isLit,
            position: [
              -width/2 - 0.002, // Slightly out from the side
              yPosition,
              zPosition
            ],
            rotation: [0, -Math.PI/2, 0],
            size: [depth * 0.12, Math.min(0.25, floorHeight * 0.7)] // Ensure window height isn't too tall
          });
        }
        
        // Add right side windows (visible when building is on the left side)
        if (x < 0 && rand() < 0.7) {
          // Determine if window is lit based on building type
          let isLit;
          if (isOfficeBuilding) {
            // Maintain consistent lighting with front windows
            isLit = floor % 2 === 0 ? rand() > 0.5 : rand() > 0.8;
          } else {
            // Residential buildings have more random patterns
            isLit = rand() < litWindowProbability;
          }
          
          // Right side windows (visible when building is on the left of the scene)
          windows.push({
            side: 'right',
            floor,
            w,
            isLit,
            position: [
              width/2 + 0.002, // Slightly out from the side
              yPosition,
              zPosition
            ],
            rotation: [0, Math.PI/2, 0],
            size: [depth * 0.12, Math.min(0.25, floorHeight * 0.7)] // Ensure window height isn't too tall
          });
        }
      }
    }
  }
  
  return { x, z, width, height, depth, color, windows, isOfficeBuilding };
});

// Plants data 
const PLANTS_DATA = Array(6).fill().map((_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const offset = Math.floor(i / 2) - 1;
  
  const leaves = Array(12).fill().map((_, leafIndex) => {
    const angle = (leafIndex / 12) * Math.PI * 2;
    return {
      angle,
      radius: 0.2 + rand() * 0.1,
      height: 0.3 + rand() * 0.5,
      rotX: rand() * 0.3 - 0.15,
      rotZ: rand() * 0.3 - 0.15,
      color: rand() > 0.3 ? '#2d5c2d' : '#1e3d1e'
    };
  });
  
  return { side, offset, leaves };
});

// Tree data
const TREE_DATA = Array(10).fill().map((_, i) => {
  const x = (rand() - 0.5) * 20;
  const z = (rand() * 15) - 5;
  const size = 0.5 + rand() * 0.7;
  const isTree = rand() > 0.6;
  const bushColor = rand() > 0.5 ? '#2e8b57' : '#228b22';
  
  return { x, z, size, isTree, bushColor };
}).filter(({ x, z }) => !(Math.abs(x) < 4 && z > -2 && z < 4)); // Filter out items in the ribbon area

// Background with buildings and plants component
export const Background = React.memo(() => {
  console.log("Background component rendered");

  // Create buildings based on pre-generated data
  const buildings = useMemo(() => {
    console.log("Creating buildings");
    return BUILDINGS_DATA.map((building, i) => (
      <group key={`building-${i}`} position={[building.x, building.height/2, building.z]}>
          <mesh castShadow receiveShadow>
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
        
        {building.windows.map((window, j) => (
          <mesh 
            key={`window-${i}-${j}-${window.side}`} 
            position={window.position}
            rotation={window.rotation}
          >
            <planeGeometry args={window.size} />
            <meshStandardMaterial 
              color={window.isLit ? '#ffff99' : '#222233'} 
              emissive={window.isLit ? '#ffff99' : '#000000'}
              emissiveIntensity={window.isLit ? 0.5 : 0}
            />
          </mesh>
        ))}
        </group>
    ));
  }, []); // Empty dependency array ensures this only runs once
  
  // Create plants based on pre-generated data
  const plants = useMemo(() => {
    console.log("Creating plants");
    const plantElements = [
      // Ground
      <mesh 
        key="grass" 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.49, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#386e36" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    ];
    
    // Add potted plants based on pre-generated data
    PLANTS_DATA.forEach((plant, i) => {
      plantElements.push(
        <group key={`plant-${i}`} position={[plant.side * (3 + plant.offset * 0.8), -0.5, 2 + plant.offset * 0.5]}>
          {/* Pot */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#a06235" roughness={0.7} />
          </mesh>
          
          {/* Plant leaves */}
          {plant.leaves.map((leaf, leafIndex) => (
              <mesh 
                key={`leaf-${i}-${leafIndex}`}
                position={[
                Math.sin(leaf.angle) * leaf.radius,
                0.4 + leaf.height/2,
                Math.cos(leaf.angle) * leaf.radius
                ]}
                rotation={[
                leaf.rotX,
                leaf.angle + Math.PI,
                Math.PI/2 + leaf.rotZ
                ]}
                castShadow
              >
              <planeGeometry args={[leaf.height, 0.2]} />
                <meshStandardMaterial 
                color={leaf.color} 
                  side={THREE.DoubleSide}
                />
              </mesh>
          ))}
        </group>
      );
    });
    
    // Add trees/bushes based on pre-generated data
    TREE_DATA.forEach(({ x, z, size, isTree, bushColor }, i) => {
      if (isTree) {
        plantElements.push(
          <group key={`tree-${i}`} position={[x, -0.5, z]}>
            <mesh position={[0, size * 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.15, size * 1.6, 8]} />
              <meshStandardMaterial color="#5c4033" roughness={0.9} />
            </mesh>
            
            <mesh position={[0, size * 1.8, 0]} castShadow>
              <coneGeometry args={[size * 0.7, size * 2, 8]} />
              <meshStandardMaterial color="#1e6e1e" roughness={0.8} />
            </mesh>
          </group>
        );
      } else {
        plantElements.push(
          <mesh 
            key={`bush-${i}`} 
            position={[x, size * 0.5 - 0.5, z]} 
            castShadow
          >
            <sphereGeometry args={[size, 16, 12]} />
            <meshStandardMaterial 
              color={bushColor} 
              roughness={0.8} 
            />
          </mesh>
        );
      }
    });
    
    return plantElements;
  }, []); // Empty dependency array ensures this only runs once
  
  // Create sky gradient with direct texture creation
  const skyTexture = useMemo(() => {
    console.log("Creating sky texture");
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
  }, []); // Empty dependency array ensures this only runs once
  
  const sky = useMemo(() => {
    console.log("Creating sky");
    return (
      <mesh position={[0, 0, -30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial map={skyTexture} />
      </mesh>
    );
  }, [skyTexture]);
  
  // Wrap all elements in a single memoized group
  return useMemo(() => {
    console.log("Creating final background group");
  return (
    <group>
      {sky}
      {buildings}
      {plants}
    </group>
  );
  }, [sky, buildings, plants]);
}); 