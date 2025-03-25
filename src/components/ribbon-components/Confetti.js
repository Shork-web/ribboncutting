import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

// Confetti component
export const Confetti = React.memo(({ isCut }) => {
  const confettiCount = 100;
  const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  const [confetti, setConfetti] = useState([]);
  const groupRef = useRef();
  
  // Initialize or clear confetti based on isCut state
  useEffect(() => {
    if (isCut) {
      // Create confetti pieces
      const newConfetti = [];
      for (let i = 0; i < confettiCount; i++) {
        newConfetti.push({
          position: [0, 1, 0],
          scale: [Math.random() * 0.1 + 0.05, Math.random() * 0.1 + 0.05, 0.01],
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          velocity: [
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.2 + 0.1,
            (Math.random() - 0.5) * 0.2
          ],
          rotationVelocity: [
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
          ],
          lifetime: 0,
          maxLifetime: Math.random() * 3 + 2
        });
      }
      setConfetti(newConfetti);
    } else {
      setConfetti([]);
    }
  }, [isCut]);
  
  // Animation frame update for confetti
  useFrame((state, delta) => {
    // Safety check - only proceed if we have a valid ref and pieces to animate
    if (!isCut || !groupRef.current || confetti.length === 0) {
      return;
    }
    
    // Update confetti physics
    setConfetti(prev => {
      if (!prev || prev.length === 0) return [];
      
      return prev.map(piece => {
        if (!piece) return null;
        
        // Update position
        const newPosition = [...piece.position];
        newPosition[0] += piece.velocity[0];
        newPosition[1] += piece.velocity[1];
        newPosition[2] += piece.velocity[2];
        
        // Apply gravity
        const newVelocity = [...piece.velocity];
        newVelocity[1] -= 0.005;
        
        // Update rotation
        const newRotation = [...piece.rotation];
        newRotation[0] += piece.rotationVelocity[0];
        newRotation[1] += piece.rotationVelocity[1];
        newRotation[2] += piece.rotationVelocity[2];
        
        // Update lifetime
        const newLifetime = piece.lifetime + delta;
        
        return {
          ...piece,
          position: newPosition,
          velocity: newVelocity,
          rotation: newRotation,
          lifetime: newLifetime
        };
      }).filter(piece => piece && piece.lifetime < piece.maxLifetime);
    });
  });
  
  return (
    <group ref={groupRef}>
      {confetti.map((piece, i) => (
        <mesh
          key={i}
          position={piece.position}
          rotation={piece.rotation}
          scale={piece.scale}
        >
          <boxGeometry />
          <meshStandardMaterial
            color={piece.color}
            emissive={piece.color}
            emissiveIntensity={0.5}
            transparent={true}
            opacity={1 - (piece.lifetime / piece.maxLifetime)}
          />
        </mesh>
      ))}
    </group>
  );
}); 