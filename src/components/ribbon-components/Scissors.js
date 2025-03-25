import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Scissors component with improved cutting animation
export const Scissors = React.memo(({ position = [0, 0, 0], size = 1, isCut = false }) => {
  const groupRef = useRef();
  const bladeLeftRef = useRef();
  const bladeRightRef = useRef();
  const handleLeftRef = useRef();
  const handleRightRef = useRef();
  
  // Adjust initial position to be lower (closer to the ribbon)
  const lowerPosition = [position[0], position[1] - 0.6, position[2]];
  
  const [animationProgress, setAnimationProgress] = useState(0);
  const [cutComplete, setCutComplete] = useState(false);
  const [initialRotation] = useState(() => new THREE.Euler(0.2, 0, 0));
  const [cutTriggered, setCutTriggered] = useState(false);
  
  // Animation effect - detect when to start cutting
  useEffect(() => {
    if (isCut && !cutTriggered) {
      // Start new cut animation
      setCutTriggered(true);
      setCutComplete(false);
      setAnimationProgress(0);
    } else if (!isCut) {
      // Reset when returning to uncut state
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
          groupRef.current.position.z = lowerPosition[2] + approachEase * 0.2;
          groupRef.current.rotation.x = initialRotation.x + approachEase * 0.1;
        }
        
        // Begin opening the scissors for the cut - with smoother motion
        if (bladeLeftRef.current && bladeRightRef.current) {
          const openingFactor = easeInOutQuad(animationProgress / 0.15);
          bladeLeftRef.current.rotation.z = -0.4 * openingFactor;
          bladeRightRef.current.rotation.z = 0.4 * openingFactor;
        }
      } 
      else if (animationProgress < 0.65) {
        // Cutting phase - gradual closure around the ribbon with improved easing
        if (bladeLeftRef.current && bladeRightRef.current) {
          // Map 0.15-0.65 range to 0-1 for closing motion
          const closingProgress = (animationProgress - 0.15) / 0.5;
          
          // Use cubic easing for more natural scissors closing motion
          const easedClosing = easeInOutCubic(closingProgress);
          
          // Add subtle acceleration at the moment of cutting (around 70-80% closed)
          const cuttingAccent = closingProgress > 0.7 && closingProgress < 0.9 
            ? Math.sin((closingProgress - 0.7) * Math.PI * 5) * 0.03 
            : 0;
          
          // Apply more natural closing motion
          bladeLeftRef.current.rotation.z = -0.4 + (0.4 + 0.3) * easedClosing + cuttingAccent;
          bladeRightRef.current.rotation.z = 0.4 - (0.4 + 0.3) * easedClosing - cuttingAccent;
          
          // Add subtle resistance shake as the scissors cut through
          if (closingProgress > 0.6 && closingProgress < 0.9) {
            const shake = Math.sin(state.clock.elapsedTime * 40) * 0.005 * (0.9 - closingProgress);
            groupRef.current.position.y = lowerPosition[1] + shake;
            groupRef.current.position.x = shake * 2;
          }
        }
      } 
      else if (animationProgress < 0.8) {
        // Snip complete - improved subtle bounce after cutting through
        if (groupRef.current) {
          const bounceFactor = (animationProgress - 0.65) / 0.15;
          const bounce = Math.sin(bounceFactor * Math.PI) * 0.04;
          groupRef.current.position.y = lowerPosition[1] + bounce;
        }
        
        // Keep blades closed after cut with slight relaxation
        if (bladeLeftRef.current && bladeRightRef.current) {
          const relaxFactor = easeOutQuad((animationProgress - 0.65) / 0.15) * 0.05;
          bladeLeftRef.current.rotation.z = -0.3 + relaxFactor;
          bladeRightRef.current.rotation.z = 0.3 - relaxFactor;
        }
      } 
      else {
        // Retreat phase - smoother pullback after cutting
        const retreatFactor = easeInOutQuad((animationProgress - 0.8) / 0.2);
        
        // More natural movement back and up
        if (groupRef.current) {
          groupRef.current.position.y = lowerPosition[1] + retreatFactor * 0.4;
          groupRef.current.position.z = lowerPosition[2] + 0.2 - retreatFactor * 0.3;
        }
        
        // Smoother scissors opening after cut
        if (bladeLeftRef.current && bladeRightRef.current) {
          const openingFactor = easeOutCubic(retreatFactor);
          bladeLeftRef.current.rotation.z = -0.3 + 0.3 * openingFactor;
          bladeRightRef.current.rotation.z = 0.3 - 0.3 * openingFactor;
        }
      }
    } else if (!cutTriggered) {
      // Reset position - with safety checks
      if (groupRef.current) {
        groupRef.current.position.set(lowerPosition[0], lowerPosition[1], lowerPosition[2]);
        groupRef.current.rotation.copy(initialRotation);
      }
      
      if (bladeLeftRef.current && bladeRightRef.current) {
        bladeLeftRef.current.rotation.z = 0;
        bladeRightRef.current.rotation.z = 0;
      }
    }
    
    // Add gentle hovering motion when not cutting or after completion
    if ((!cutTriggered || cutComplete) && groupRef.current) {
      // More subtle floating motion
      groupRef.current.position.y = lowerPosition[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
      // Gentle rotation to suggest anticipation
      if (!cutTriggered) {
        const anticipation = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
        groupRef.current.rotation.z = initialRotation.z + anticipation;
        
        // Subtle opening and closing while hovering
        if (bladeLeftRef.current && bladeRightRef.current) {
          const breathingFactor = (Math.sin(state.clock.elapsedTime * 0.5) + 1) * 0.5 * 0.1;
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
  
  return (
    <group 
      ref={groupRef} 
      position={[lowerPosition[0], lowerPosition[1], lowerPosition[2]]}
      rotation={initialRotation}
    >
      {/* Left blade */}
      <group ref={bladeLeftRef}>
        <mesh position={[-0.04 * size, 0.4 * size, 0]} castShadow>
          <planeGeometry args={[0.08 * size, 0.9 * size]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Blade edge highlight */}
        <mesh position={[-0.025 * size, 0.4 * size, 0.001 * size]} castShadow>
          <planeGeometry args={[0.01 * size, 0.85 * size]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Right blade */}
      <group ref={bladeRightRef}>
        <mesh position={[0.04 * size, 0.4 * size, 0]} castShadow>
          <planeGeometry args={[0.08 * size, 0.9 * size]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Blade edge highlight */}
        <mesh position={[0.025 * size, 0.4 * size, 0.001 * size]} castShadow>
          <planeGeometry args={[0.01 * size, 0.85 * size]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Pivot */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03 * size, 0.03 * size, 0.02 * size, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Left handle */}
      <group ref={handleLeftRef}>
        <mesh position={[-0.15 * size, -0.4 * size, 0]} castShadow>
          <cylinderGeometry args={[0.05 * size, 0.07 * size, 0.8 * size, 16]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        
        {/* Handle loop */}
        <mesh position={[-0.15 * size, -0.8 * size, 0]} castShadow>
          <torusGeometry args={[0.15 * size, 0.03 * size, 16, 32]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        
        {/* Connect blade to handle */}
        <mesh position={[-0.09 * size, -0.05 * size, 0]} castShadow>
          <boxGeometry args={[0.1 * size, 0.2 * size, 0.02 * size]} />
          <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Right handle */}
      <group ref={handleRightRef}>
        <mesh position={[0.15 * size, -0.4 * size, 0]} castShadow>
          <cylinderGeometry args={[0.05 * size, 0.07 * size, 0.8 * size, 16]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        
        {/* Handle loop */}
        <mesh position={[0.15 * size, -0.8 * size, 0]} castShadow>
          <torusGeometry args={[0.15 * size, 0.03 * size, 16, 32]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        
        {/* Connect blade to handle */}
        <mesh position={[0.09 * size, -0.05 * size, 0]} castShadow>
          <boxGeometry args={[0.1 * size, 0.2 * size, 0.02 * size]} />
          <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Add a small screw detail */}
      <mesh position={[0, 0, 0.012 * size]} castShadow>
        <cylinderGeometry args={[0.01 * size, 0.01 * size, 0.005 * size, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}); 