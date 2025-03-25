import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { SingletonBackground } from './ribbon-components/SingletonBackground';

// Main component with enhanced features
const RibbonCutting = ({ 
  ribbonColor = '#ff0000', 
  width = 5,
  isCut = false,
  autoRotate = false
}) => {
  console.log("RibbonCutting component rendered, isCut:", isCut);
  const [hasCut, setHasCut] = useState(false);
  const controlsRef = useRef();
  
  useEffect(() => {
    console.log("RibbonCutting effect running, isCut:", isCut, "hasCut:", hasCut);
    if (isCut && !hasCut) {
      console.log("Setting hasCut to true");
      setHasCut(true);
    } else if (!isCut && hasCut) {
      console.log("Setting hasCut to false");
      setHasCut(false);
      // We don't reset the camera when cutting again
    }
  }, [isCut, hasCut]);
  
  return (
    <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#f5f5f5']} />
      
      <PerspectiveCamera makeDefault position={[0, 1, 7]} fov={40} />
      <OrbitControls 
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
        enableDamping
        dampingFactor={0.05}
        // Don't reset the camera when the component re-renders
        makeDefault
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
      
      {/* Singleton Background - rendered first and only once */}
      <SingletonBackground />
      
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
const SceneContent = React.memo(({ width, ribbonColor, isCut }) => {
  console.log("SceneContent rendered, isCut:", isCut);
  
  return (
    <>
      <Ribbon width={width} color={ribbonColor} isCut={isCut} />
      <Floor />
      <Confetti isCut={isCut} />
      <LightBeams isCut={isCut} />
    </>
  );
});

export default RibbonCutting; 