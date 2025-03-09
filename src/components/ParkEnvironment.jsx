import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';

const ParkEnvironment = () => {
  const groupRef = useRef();
  
  // Tree positions
  const treePositions = [
    { x: -15, y: 0, z: -15 },
    { x: 15, y: 0, z: -15 },
    { x: -15, y: 0, z: 15 },
    { x: 15, y: 0, z: 15 },
    { x: -10, y: 0, z: -20 },
    { x: 10, y: 0, z: -20 },
    { x: -20, y: 0, z: -10 },
    { x: 20, y: 0, z: -10 },
  ];
  
  // Bush positions
  const bushPositions = [
    { x: -5, y: 0, z: -10 },
    { x: 5, y: 0, z: -10 },
    { x: -10, y: 0, z: -5 },
    { x: 10, y: 0, z: -5 },
    { x: -8, y: 0, z: 8 },
    { x: 8, y: 0, z: 8 },
    { x: -3, y: 0, z: 12 },
    { x: 3, y: 0, z: 12 },
  ];
  
  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#4CAF50"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Trees - simple cone and cylinder representation */}
      {treePositions.map((pos, index) => (
        <group key={`tree-${index}`} position={[pos.x, pos.y, pos.z]}>
          {/* Tree trunk */}
          <Box 
            args={[0.5, 3, 0.5]} 
            position={[0, 1.5, 0]}
            castShadow
          >
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </Box>
          
          {/* Tree foliage */}
          <Box 
            args={[2, 4, 2]} 
            position={[0, 4, 0]}
            castShadow
          >
            <meshStandardMaterial color="#2E7D32" roughness={0.7} />
          </Box>
        </group>
      ))}
      
      {/* Bushes - simple sphere representation */}
      {bushPositions.map((pos, index) => (
        <Sphere
          key={`bush-${index}`}
          args={[1, 16, 16]}
          position={[pos.x, 0.5, pos.z]}
          castShadow
        >
          <meshStandardMaterial color="#388E3C" roughness={0.7} />
        </Sphere>
      ))}
    </group>
  );
};

export default ParkEnvironment;
