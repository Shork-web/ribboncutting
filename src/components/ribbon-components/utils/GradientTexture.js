import * as THREE from 'three';
import React, { useLayoutEffect, useMemo } from 'react';

export function GradientTexture({ stops, colors, size = 1024, ...props }) {
  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, size);
    
    if (stops.length !== colors.length) {
      throw new Error('GradientTexture: stops and colors must have the same length');
    }
    
    stops.forEach((stop, i) => gradient.addColorStop(stop, colors[i]));
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    
    return canvas;
  }, [stops, colors, size]);
  
  const texture = useMemo(() => {
    const texture = new THREE.CanvasTexture(
      canvas,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearFilter
    );
    texture.needsUpdate = true;
    return texture;
  }, [canvas]);
  
  return <primitive object={texture} {...props} />;
} 