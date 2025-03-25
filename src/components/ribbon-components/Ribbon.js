import React, { useState, useEffect } from 'react';
import { Sparkles, Text } from '@react-three/drei';
import { RibbonStand } from './RibbonStand';
import { RibbonSegment } from './RibbonSegment';
import { Scissors } from './Scissors';

// Main ribbon component
export const Ribbon = React.memo(({ width, color, isCut }) => {
  console.log("Ribbon component rendered, isCut:", isCut);
  const segmentHeight = 0.8;
  const segmentDepth = 0.05;
  const standHeight = 1.6;
  const [showCutPieces, setShowCutPieces] = useState(false);
  const [showWholeRibbon, setShowWholeRibbon] = useState(true);
  
  // Memoize ribbon segments props to prevent unnecessary re-renders
  const wholeRibbonProps = React.useMemo(() => ({
    position: [0, standHeight - segmentHeight/2 - 0.5, 0],
    width: width - 0.2,
    height: segmentHeight,
    depth: segmentDepth,
    color: color,
    isCut: false
  }), [width, color, standHeight, segmentHeight, segmentDepth]);
  
  const leftSegmentProps = React.useMemo(() => ({
    position: [-width/4, standHeight - segmentHeight/2 - 0.5, 0],
    width: width/2 - 0.1,
    height: segmentHeight,
    depth: segmentDepth,
    color: color,
    isCut: true,
    dropDirection: [-1, -1, 0],
    rotationOnDrop: [-0.2, 0, -0.5]
  }), [width, color, standHeight, segmentHeight, segmentDepth]);
  
  const rightSegmentProps = React.useMemo(() => ({
    position: [width/4, standHeight - segmentHeight/2 - 0.5, 0],
    width: width/2 - 0.1,
    height: segmentHeight,
    depth: segmentDepth,
    color: color,
    isCut: true,
    dropDirection: [1, -1, 0],
    rotationOnDrop: [0.2, 0, 0.5]
  }), [width, color, standHeight, segmentHeight, segmentDepth]);
  
  // Handle the transition between whole ribbon and cut pieces
  useEffect(() => {
    console.log("Ribbon effect running, isCut:", isCut, "showCutPieces:", showCutPieces);
    if (isCut && !showCutPieces) {
      console.log("Starting ribbon cut transition");
      // Single timeout for the transition
      const timer = setTimeout(() => {
        setShowWholeRibbon(false);
        setShowCutPieces(true);
      }, 400); // Timed to match the scissors cutting through point
      
      return () => clearTimeout(timer);
    } else if (!isCut && showCutPieces) {
      console.log("Resetting ribbon state");
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
        <RibbonSegment {...wholeRibbonProps} />
      )}
      
      {/* Cut ribbon pieces */}
      {showCutPieces && (
        <>
          {/* Left ribbon segment */}
          <RibbonSegment {...leftSegmentProps} />
          
          {/* Right ribbon segment */}
          <RibbonSegment {...rightSegmentProps} />
        </>
      )}
      
      {/* Scissors - repositioned extremely far back from the banner */}
      <Scissors 
        position={[0, standHeight - 1.0, -2.5]} 
        size={2.0}
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
        </>
      )}
    </group>
  );
}); 