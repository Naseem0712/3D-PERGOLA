import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CurvedRafterDecoration = ({ 
  width, 
  height, 
  segments = 10, 
  rafterWidth, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  color = '#ffffff' 
}) => {
  // Create the curved decoration geometry
  const geometry = useMemo(() => {
    // Create points for the curve
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = -width / 2 + t * width;
      
      // Use a sine curve for the height
      // This creates a curve that starts and ends at 0 and peaks in the middle
      const y = Math.sin(Math.PI * t) * height;
      
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    // Create a smooth curve from the points
    const curve = new THREE.CatmullRomCurve3(points);
    
    // Create a tube geometry from the curve
    return new THREE.TubeGeometry(
      curve,
      segments,
      rafterWidth / 2, // Radius
      8, // Radial segments
      false // Not closed
    );
  }, [width, height, segments, rafterWidth]);
  
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

export default CurvedRafterDecoration;
