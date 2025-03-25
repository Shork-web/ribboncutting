import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Redesigned scissors component with realistic details and materials
export const Scissors = React.memo(({ position = [0, 0, 0], size = 1, isCut = false }) => {
  console.log("Scissors component rendered, isCut:", isCut);
  const groupRef = useRef();
  const bladeLeftRef = useRef();
  const bladeRightRef = useRef();
  const handleLeftRef = useRef();
  const handleRightRef = useRef();
  
  // Base position
  const adjustedPosition = [position[0], position[1], position[2]];
  
  const [animationProgress, setAnimationProgress] = useState(0);
  const [cutComplete, setCutComplete] = useState(false);
  // Positioned behind pointing toward ribbon
  const [initialRotation] = useState(() => new THREE.Euler(0.1, Math.PI/2, Math.PI/2));
  const [cutTriggered, setCutTriggered] = useState(false);
  
  // Animation effect - detect when to start cutting
  useEffect(() => {
    console.log("Scissors effect running, isCut:", isCut, "cutTriggered:", cutTriggered);
    if (isCut && !cutTriggered) {
      console.log("Starting cut animation");
      setCutTriggered(true);
      setCutComplete(false);
      setAnimationProgress(0);
    } else if (!isCut) {
      console.log("Resetting cut animation");
      setCutTriggered(false);
      setCutComplete(false);
      setAnimationProgress(0);
    }
  }, [isCut, cutTriggered]);
  
  // Improved scissors animation with realistic cutting motion
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    if (cutTriggered && !cutComplete) {
      // Progress the animation with a smoother easing
      setAnimationProgress(prev => {
        // Use easeInOutCubic for more natural motion
        const newProgress = prev + delta * (
          prev < 0.4 ? 0.6 : // slower start
          prev < 0.7 ? 1.0 : // faster middle
          0.8             // slower end
        );
        
        if (newProgress >= 1) {
          console.log("Cut animation complete");
          setCutComplete(true);
          return 1;
        }
        return newProgress;
      });
      
      // Enhanced animation stages for realistic cutting
      if (animationProgress < 0.15) {
        // Positioning phase - move scissors to the ribbon
        if (groupRef.current) {
          // Smooth approach to the ribbon
          const approachEase = easeOutQuad(animationProgress / 0.15);
          groupRef.current.position.z = adjustedPosition[2] + approachEase * 1.6;
          groupRef.current.rotation.y = initialRotation.y + approachEase * 0.1;
        }
        
        // Begin opening the scissors for the cut
        if (bladeLeftRef.current && bladeRightRef.current) {
          const openingFactor = easeInOutQuad(animationProgress / 0.15);
          bladeLeftRef.current.rotation.z = -0.5 * openingFactor;
          bladeRightRef.current.rotation.z = 0.5 * openingFactor;
        }
      }
      else if (animationProgress < 0.65) {
        // Cutting phase - gradual closure around the ribbon
        if (bladeLeftRef.current && bladeRightRef.current) {
          // Map 0.15-0.65 range to 0-1 for closing motion
          const closingProgress = (animationProgress - 0.15) / 0.5;
          
          // Use cubic easing for more natural scissors closing motion
          const easedClosing = easeInOutCubic(closingProgress);
          
          // Add subtle acceleration at the moment of cutting
          const cuttingAccent = closingProgress > 0.7 && closingProgress < 0.9 
            ? Math.sin((closingProgress - 0.7) * Math.PI * 5) * 0.04 
            : 0;
          
          // Apply more natural closing motion
          bladeLeftRef.current.rotation.z = -0.5 + (0.5 + 0.3) * easedClosing + cuttingAccent;
          bladeRightRef.current.rotation.z = 0.5 - (0.5 + 0.3) * easedClosing - cuttingAccent;
          
          // Add subtle resistance shake as the scissors cut through
          if (closingProgress > 0.6 && closingProgress < 0.9) {
            const shake = Math.sin(state.clock.elapsedTime * 45) * 0.006 * (0.9 - closingProgress);
            groupRef.current.position.y = adjustedPosition[1] + shake;
            groupRef.current.position.z = adjustedPosition[2] + 1.6 + shake * 2;
            
            // Add slight rotation shake
            groupRef.current.rotation.x = initialRotation.x + shake * 2;
          }
        }
      }
      else if (animationProgress < 0.8) {
        // Snip complete - improved subtle bounce after cutting through
        if (groupRef.current) {
          const bounceFactor = (animationProgress - 0.65) / 0.15;
          const bounce = Math.sin(bounceFactor * Math.PI) * 0.05;
          groupRef.current.position.y = adjustedPosition[1] + bounce;
          groupRef.current.rotation.x = initialRotation.x + bounce * 0.5;
        }
        
        // Keep blades closed after cut with slight relaxation
        if (bladeLeftRef.current && bladeRightRef.current) {
          const relaxFactor = easeOutQuad((animationProgress - 0.65) / 0.15) * 0.08;
          bladeLeftRef.current.rotation.z = -0.2 + relaxFactor;
          bladeRightRef.current.rotation.z = 0.2 - relaxFactor;
        }
      } 
      else {
        // Retreat phase - smoother pullback after cutting
        const retreatFactor = easeInOutQuad((animationProgress - 0.8) / 0.2);
        
        // More natural movement back
        if (groupRef.current) {
          groupRef.current.position.y = adjustedPosition[1] + retreatFactor * 0.1;
          groupRef.current.position.z = adjustedPosition[2] + 1.6 - retreatFactor * 1.8;
          groupRef.current.rotation.x = initialRotation.x * (1 - retreatFactor) + 0.05 * retreatFactor;
        }
        
        // Smoother scissors opening after cut
        if (bladeLeftRef.current && bladeRightRef.current) {
          const openingFactor = easeOutCubic(retreatFactor);
          bladeLeftRef.current.rotation.z = -0.2 + 0.2 * openingFactor;
          bladeRightRef.current.rotation.z = 0.2 - 0.2 * openingFactor;
        }
      }
    } else if (!cutTriggered) {
      // Reset blade position only, not the entire scissors position
      if (groupRef.current) {
        // Don't reset the group position - keep current view angle
        // groupRef.current.position.set(adjustedPosition[0], adjustedPosition[1], adjustedPosition[2]);
        
        // Only reset rotation if needed
        if (Math.abs(groupRef.current.rotation.y - initialRotation.y) > 0.5 ||
            Math.abs(groupRef.current.rotation.z - initialRotation.z) > 0.5) {
          groupRef.current.rotation.copy(initialRotation);
        }
      }
      
      if (bladeLeftRef.current && bladeRightRef.current) {
        bladeLeftRef.current.rotation.z = 0;
        bladeRightRef.current.rotation.z = 0;
      }
    }
    
    // Add gentle hovering motion when not cutting or after completion
    if ((!cutTriggered || cutComplete) && groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.z = adjustedPosition[2] + Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
      groupRef.current.position.y = adjustedPosition[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      
      // Gentle rotation to suggest anticipation
      if (!cutTriggered) {
        const anticipation = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
        groupRef.current.rotation.y = initialRotation.y + anticipation;
        groupRef.current.rotation.z = initialRotation.z + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
        
        // Subtle opening and closing while hovering
        if (bladeLeftRef.current && bladeRightRef.current) {
          const breathingFactor = (Math.sin(state.clock.elapsedTime * 0.5) + 1) * 0.5 * 0.15;
          bladeLeftRef.current.rotation.z = -breathingFactor;
          bladeRightRef.current.rotation.z = breathingFactor;
        }
      }
    }
  });
  
  // Easing functions for smoother animation
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }
  
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  // Metallic material for blades
  const bladeMaterial = new THREE.MeshStandardMaterial({
    color: '#C0C0C0',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0,
    side: THREE.DoubleSide
  });
  
  // Plastic material for handles
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: '#2A2A2A',
    metalness: 0.1,
    roughness: 0.8,
    side: THREE.DoubleSide
  });
  
  // Metal accent material
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: '#A0A0A0',
    metalness: 0.85,
    roughness: 0.2,
    side: THREE.DoubleSide
  });
  
  // Blade edge material
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: '#E0E0E0',
    metalness: 1.0,
    roughness: 0.05,
    side: THREE.DoubleSide
  });
  
  return (
    <group 
      ref={groupRef} 
      position={[adjustedPosition[0], adjustedPosition[1], adjustedPosition[2]]}
      rotation={initialRotation}
    >
      {/* Left blade assembly */}
      <group ref={bladeLeftRef}>
        {/* Main blade body - tapered and with better shape */}
        <mesh position={[-0.02 * size, 0.42 * size, 0]} castShadow>
          <planeGeometry args={[0.08 * size, 0.9 * size]} />
          <meshStandardMaterial {...bladeMaterial} />
        </mesh>
        
        {/* Blade edge */}
        <mesh position={[-0.03 * size, 0.42 * size, 0.0005 * size]} castShadow>
          <planeGeometry args={[0.03 * size, 0.85 * size]} />
          <meshStandardMaterial {...edgeMaterial} />
        </mesh>
        
        {/* Blade reinforcement */}
        <mesh position={[-0.05 * size, 0.25 * size, 0.001 * size]} castShadow>
          <boxGeometry args={[0.03 * size, 0.5 * size, 0.005 * size]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>
        
        {/* Connect blade to handle */}
        <mesh position={[-0.09 * size, -0.05 * size, 0]} castShadow>
          <boxGeometry args={[0.1 * size, 0.2 * size, 0.02 * size]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>
      </group>
      
      {/* Right blade assembly */}
      <group ref={bladeRightRef}>
        {/* Main blade body - tapered and with better shape */}
        <mesh position={[0.02 * size, 0.42 * size, 0]} castShadow>
          <planeGeometry args={[0.08 * size, 0.9 * size]} />
          <meshStandardMaterial {...bladeMaterial} />
        </mesh>
        
        {/* Blade edge */}
        <mesh position={[0.03 * size, 0.42 * size, 0.0005 * size]} castShadow>
          <planeGeometry args={[0.03 * size, 0.85 * size]} />
          <meshStandardMaterial {...edgeMaterial} />
        </mesh>
        
        {/* Blade reinforcement */}
        <mesh position={[0.05 * size, 0.25 * size, 0.001 * size]} castShadow>
          <boxGeometry args={[0.03 * size, 0.5 * size, 0.005 * size]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>
        
        {/* Connect blade to handle */}
        <mesh position={[0.09 * size, -0.05 * size, 0]} castShadow>
          <boxGeometry args={[0.1 * size, 0.2 * size, 0.02 * size]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>
      </group>
      
      {/* Center pivot */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035 * size, 0.035 * size, 0.025 * size, 20]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>
      
      {/* Center pivot cap - top */}
      <mesh position={[0, 0, 0.015 * size]} castShadow>
        <cylinderGeometry args={[0.02 * size, 0.02 * size, 0.006 * size, 12]} />
        <meshStandardMaterial color="#777777" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Center pivot cap - bottom */}
      <mesh position={[0, 0, -0.015 * size]} castShadow>
        <cylinderGeometry args={[0.02 * size, 0.02 * size, 0.006 * size, 12]} />
        <meshStandardMaterial color="#777777" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Left handle */}
      <group ref={handleLeftRef}>
        {/* Handle stem with improved taper */}
        <mesh position={[-0.15 * size, -0.35 * size, 0]} castShadow>
          <cylinderGeometry args={[0.05 * size, 0.07 * size, 0.7 * size, 16]} />
          <meshStandardMaterial {...handleMaterial} />
        </mesh>
        
        {/* Handle ring */}
        <mesh position={[-0.15 * size, -0.75 * size, 0]} castShadow>
          <torusGeometry args={[0.15 * size, 0.04 * size, 20, 36]} />
          <meshStandardMaterial {...handleMaterial} />
        </mesh>
        
        {/* Handle finger insert - more ergonomic */}
        <mesh position={[-0.15 * size, -0.75 * size, 0]} castShadow>
          <torusGeometry args={[0.15 * size, 0.028 * size, 20, 36]} />
          <meshStandardMaterial color="#202020" metalness={0.05} roughness={0.9} />
        </mesh>
        
        {/* Handle metal accent ring */}
        <mesh position={[-0.15 * size, -0.68 * size, 0]} castShadow rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.07 * size, 0.01 * size, 8, 16]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>
      </group>
      
      {/* Right handle */}
      <group ref={handleRightRef}>
        {/* Handle stem with improved taper */}
        <mesh position={[0.15 * size, -0.35 * size, 0]} castShadow>
          <cylinderGeometry args={[0.05 * size, 0.07 * size, 0.7 * size, 16]} />
          <meshStandardMaterial {...handleMaterial} />
        </mesh>
        
        {/* Handle ring */}
        <mesh position={[0.15 * size, -0.75 * size, 0]} castShadow>
          <torusGeometry args={[0.15 * size, 0.04 * size, 20, 36]} />
          <meshStandardMaterial {...handleMaterial} />
        </mesh>
        
        {/* Handle finger insert - more ergonomic */}
        <mesh position={[0.15 * size, -0.75 * size, 0]} castShadow>
          <torusGeometry args={[0.15 * size, 0.028 * size, 20, 36]} />
          <meshStandardMaterial color="#202020" metalness={0.05} roughness={0.9} />
        </mesh>
        
        {/* Handle metal accent ring */}
        <mesh position={[0.15 * size, -0.68 * size, 0]} castShadow rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.07 * size, 0.01 * size, 8, 16]} />
          <meshStandardMaterial {...accentMaterial} />
        </mesh>
      </group>
    </group>
  );
}); 