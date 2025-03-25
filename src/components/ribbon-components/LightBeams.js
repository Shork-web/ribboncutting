import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';

// Light beams that appear when the ribbon is cut
export const LightBeams = React.memo(({ isCut }) => {
  const beamsRef = useRef();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isCut) {
      // Show beams with a slight delay
      setTimeout(() => setVisible(true), 200);
    } else {
      setVisible(false);
    }
  }, [isCut]);
  
  useFrame(({ clock }) => {
    if (beamsRef.current && visible) {
      // Rotate the beams slowly
      beamsRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });
  
  return visible ? (
    <group ref={beamsRef}>
      <SpotLight
        position={[-5, 5, 0]}
        angle={0.3}
        penumbra={0.9}
        distance={10}
        intensity={2}
        color="#4d94ff"
        castShadow={false}
      />
      
      <SpotLight
        position={[5, 5, 0]}
        angle={0.3}
        penumbra={0.9}
        distance={10}
        intensity={2}
        color="#ffcc66"
        castShadow={false}
      />
      
      <SpotLight
        position={[0, 5, -5]}
        angle={0.3}
        penumbra={0.9}
        distance={10}
        intensity={2}
        color="#ff99cc"
        castShadow={false}
      />
    </group>
  ) : null;
}); 