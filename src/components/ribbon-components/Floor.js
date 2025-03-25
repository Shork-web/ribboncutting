import React from 'react';
import { usePlane } from '@react-three/cannon';
import { MeshReflectorMaterial } from '@react-three/drei';

// Floor component with reflection
export const Floor = React.memo(() => {
  // Simple physics setup without callbacks
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
    type: 'static'
  }));
  
  return (
    <mesh ref={ref} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#f0f0f0"
        metalness={0.1}
      />
    </mesh>
  );
}); 