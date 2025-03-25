import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';

// Atmospheric clouds
export const AtmosphericClouds = React.memo(({ isCut }) => {
  const cloudsRef = useRef();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isCut) {
      // Show clouds with a delay
      setTimeout(() => setVisible(true), 500);
    } else {
      setVisible(false);
    }
  }, [isCut]);
  
  useFrame(({ clock }) => {
    if (cloudsRef.current && visible) {
      // Gentle movement
      cloudsRef.current.position.y = 3 + Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });
  
  return visible ? (
    <group ref={cloudsRef} position={[0, 3, -5]}>
      <Cloud
        opacity={0.5}
        speed={0.4}
        width={10}
        depth={1.5}
        segments={20}
      />
    </group>
  ) : null;
}); 