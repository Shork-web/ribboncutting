import * as THREE from 'three';

// Create wavy ribbon geometry
export const createRibbonGeometry = (width, height, depth, segments = 20) => {
  const geometry = new THREE.BoxGeometry(width, height, depth, segments, 1, 1);
  const positionAttr = geometry.attributes.position;
  const vertices = positionAttr.array;
  
  // Add wave and sag to the ribbon
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const relativeX = x / width; // -0.5 to 0.5 normalized position
    
    // Add gentle sag (parabolic)
    const sag = -(Math.pow(relativeX * 2, 2) - 1) * 0.08;
    
    // Add wave pattern
    const wave = Math.sin(relativeX * Math.PI * 3) * 0.03;
    
    // Apply vertical deformation
    vertices[i + 1] += sag + wave;
  }
  
  geometry.computeVertexNormals();
  return geometry;
}; 