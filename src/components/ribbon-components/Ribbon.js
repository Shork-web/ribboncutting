import React, { useState, useEffect } from 'react';
import { Sparkles, Text } from '@react-three/drei';
import { RibbonStand } from './RibbonStand';
import { RibbonSegment } from './RibbonSegment';
import { Scissors } from './Scissors';

// Main ribbon component
export const Ribbon = React.memo(({ width, color, isCut }) => {
  const segmentHeight = 0.8;
  const segmentDepth = 0.05;
  const standHeight = 1.6;
  const [showCutPieces, setShowCutPieces] = useState(false);
  const [showWholeRibbon, setShowWholeRibbon] = useState(true);
  
  // Handle the transition between whole ribbon and cut pieces
  useEffect(() => {
    if (isCut && !showCutPieces) {
      // Short delay before showing cut pieces to sync with scissors cutting action
      const timer = setTimeout(() => {
        setShowCutPieces(true);
        // Brief overlap where both are visible for smoother transition
        setTimeout(() => {
          setShowWholeRibbon(false);
        }, 50);
      }, 400); // Timed to match the scissors cutting through point
      
      return () => clearTimeout(timer);
    } else if (!isCut && showCutPieces) {
      // Reset when going back to uncut state
      setShowWholeRibbon(true);
      setShowCutPieces(false);
    }
  }, [isCut, showCutPieces]);
  
  return (
    <group>
      {/* Left stand */}
      <RibbonStand 
        position={[-width/2, 0, 0]} 
        height={standHeight}
      />
      
      {/* Right stand */}
      <RibbonStand 
        position={[width/2, 0, 0]} 
        height={standHeight}
      />
      
      {/* Complete ribbon when not cut or during transition */}
      {showWholeRibbon && (
        <RibbonSegment 
          position={[0, standHeight - segmentHeight/2 - 0.5, 0]} 
          width={width - 0.2}
          height={segmentHeight}
          depth={segmentDepth}
          color={color}
          isCut={false}
        />
      )}
      
      {/* Cut ribbon pieces */}
      {showCutPieces && (
        <>
          {/* Left ribbon segment */}
          <RibbonSegment 
            position={[-width/4, standHeight - segmentHeight/2 - 0.5, 0]} 
            width={width/2 - 0.1}
            height={segmentHeight}
            depth={segmentDepth}
            color={color}
            isCut={true}
            dropDirection={[-1, -1, 0]}
            rotationOnDrop={[-0.2, 0, -0.5]}
          />
          
          {/* Right ribbon segment */}
          <RibbonSegment 
            position={[width/4, standHeight - segmentHeight/2 - 0.5, 0]} 
            width={width/2 - 0.1}
            height={segmentHeight}
            depth={segmentDepth}
            color={color}
            isCut={true}
            dropDirection={[1, -1, 0]}
            rotationOnDrop={[0.2, 0, 0.5]}
          />
        </>
      )}
      
      {/* Scissors */}
      <Scissors 
        position={[0, standHeight - 0.8, 0.2]} 
        size={0.6}
        isCut={isCut}
      />
      
      {/* Celebration effects */}
      {showCutPieces && (
        <>
          <Sparkles 
            count={40} 
            scale={[width * 1.5, 1, 1]} 
            position={[0, standHeight - 0.5, 0]} 
            size={6}
            speed={0.3}
            opacity={0.7}
            color={color}
          />
          <Sparkles 
            count={100} 
            scale={[width, 2, 2]} 
            position={[0, standHeight - 1, 0]} 
            size={3}
            speed={0.5}
            color="white"
          />
          
          <group position={[0, standHeight + 1, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.5}
              color="black"
              font="/fonts/Inter-Bold.woff"
              anchorX="center"
              anchorY="middle"
            >
              Grand Opening!
            </Text>
            
            <group position={[-1.5, -0.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
            
            <group position={[1.5, -0.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </>
      )}
    </group>
  );
}); 