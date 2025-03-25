import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls,
} from '@react-three/drei';
import { Physics } from '@react-three/cannon';

// Import components
import { Floor } from './ribbon-components/Floor';
import { Ribbon } from './ribbon-components/Ribbon';
import { Confetti } from './ribbon-components/Confetti';
import { LightBeams } from './ribbon-components/LightBeams';
import { AtmosphericClouds } from './ribbon-components/AtmosphericClouds';
import { Background } from './ribbon-components/Background';

// Main component with enhanced features
const RibbonCutting = ({ 
  ribbonColor = '#ff0000', 
  width = 5,
  isCut = false,
  onComplete = () => {},
  autoRotate = false
}) => {
  const [hasCut, setHasCut] = useState(false);
  
  useEffect(() => {
    if (isCut && !hasCut) {
      setHasCut(true);
      // Call the completion callback after the ribbon falls
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else if (!isCut && hasCut) {
      setHasCut(false);
    }
  }, [isCut, hasCut, onComplete]);
  
  return (
    <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#f5f5f5']} />
      <fog attach="fog" args={['#f5f5f5', 5, 30]} />
      
      <PerspectiveCamera makeDefault position={[0, 1, 7]} fov={40} />
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.6} />
      <hemisphereLight 
        args={['#ffffff', '#e0e0e0', 0.7]} 
        position={[0, 20, 0]} 
      />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight 
        position={[-10, 5, -5]} 
        intensity={0.5} 
      />
      
      {/* Add rim light for more depth */}
      <spotLight
        position={[0, 3, -10]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Configure the Physics system with appropriate settings */}
      <Physics 
        gravity={[0, -3, 0]}
        defaultContactMaterial={{
          friction: 0.3,
          restitution: 0.2,
          contactEquationStiffness: 1e6
        }}
        allowSleep={true}
      >
        <SceneContent 
          width={width} 
          ribbonColor={ribbonColor} 
          isCut={hasCut} 
        />
      </Physics>
    </Canvas>
  );
};

// Scene content component - this wraps all 3D elements
function SceneContent({ width, ribbonColor, isCut }) {
  return (
    <>
      <Background />
      <Ribbon width={width} color={ribbonColor} isCut={isCut} />
      <Floor />
      <Confetti isCut={isCut} />
      <LightBeams isCut={isCut} />
      <AtmosphericClouds isCut={isCut} />
    </>
  );
}

export default RibbonCutting; 