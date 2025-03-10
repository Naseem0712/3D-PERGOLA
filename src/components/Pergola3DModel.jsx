import React, { useRef, forwardRef, useImperativeHandle, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Cylinder, useDetectGPU } from '@react-three/drei';
import * as THREE from 'three'
import CurvedRafterDecoration from './CurvedRafterDecoration';

const Pergola3DModel = forwardRef(({
  dimensions = { width: 3, length: 4, height: 2.5 }, 
  material = 'aluminium', 
  materialColor = '#a8a8a8',
  pillars = { count: 4, size: { width: 0.1, depth: 0.1 }, positions: [], visible: [true, true, true, true] },
  rafters = { 
    frontToBack: {
      count: 5,
      width: 0.05,
      height: 0.1,
      visible: true,
      shape: 'square',
      items: []
    },
    leftToRight: {
      count: 5,
      width: 0.05,
      height: 0.1,
      visible: true,
      shape: 'square',
      items: []
    },
    pattern: 'crosshatch',
    style: 'straight',
    visible: true
  },
  glass = {
    visible: false,
    applied: false,
    color: '#a9c2d9',
    opacity: 0.6,
    thickness: 0.8,
    extension: 0.1,
    position: { x: 0, y: 0, z: 0 },
    sides: {
      top: true,
      front: true,
      back: true,
      left: true,
      right: true,
      bottom: true
    }
  },
  pergolaPosition = { x: 0, y: 0, z: 0 },
  onRafterSelect = () => {},
  qualitySettings = null, 
  qualityLevel = 'high', 
  isMobile = false,
  modelRef
}, ref) => {
  // Refs for animation and interaction
  const groupRef = useRef();
  const raftersRef = useRef({});
  const gpuTier = useDetectGPU();
  const { gl, camera } = useThree();
  
  // State for LOD (Level of Detail) system
  const [distanceFromCamera, setDistanceFromCamera] = useState(0);
  const [currentLOD, setCurrentLOD] = useState(0); // 0 = high, 1 = medium, 2 = low
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getObject3D: () => groupRef.current
  }));
  
  // Expose scene to parent component for export
  useImperativeHandle(modelRef, () => ({
    scene: groupRef.current,
    getScene: () => {
      // Create a new scene containing only our pergola model
      const exportScene = new THREE.Scene();
      
      // Clone the group with all its children
      if (groupRef.current) {
        // Add the group to the scene
        exportScene.add(groupRef.current.clone());
        
        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        exportScene.add(ambientLight);
        
        // Add directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        exportScene.add(directionalLight);
      }
      
      return exportScene;
    }
  }));
  
  // Material properties - simplified for better performance
  const materialProps = useMemo(() => {
    // Determine material properties based on the selected material
    let roughness = 0.5;
    let metalness = 0.6;
    let envMapIntensity = 1;
    
    // Adjust quality based on device performance
    const qualityMultiplier = qualityLevel === 'high' ? 1 : 
                             qualityLevel === 'medium' ? 0.7 : 0.4;
    
    switch(material) {
      case 'wood':
        roughness = 0.8 * qualityMultiplier;
        metalness = 0.1 * qualityMultiplier;
        envMapIntensity = 0.5 * qualityMultiplier;
        break;
      case 'aluminium':
        roughness = 0.3 * qualityMultiplier;
        metalness = 0.8 * qualityMultiplier;
        envMapIntensity = 1.2 * qualityMultiplier;
        break;
      case 'iron':
        roughness = 0.4 * qualityMultiplier;
        metalness = 0.9 * qualityMultiplier;
        envMapIntensity = 1.0 * qualityMultiplier;
        break;
      case 'wpc':
        roughness = 0.7 * qualityMultiplier;
        metalness = 0.2 * qualityMultiplier;
        envMapIntensity = 0.6 * qualityMultiplier;
        break;
      default:
        // Default to aluminium
        roughness = 0.3 * qualityMultiplier;
        metalness = 0.8 * qualityMultiplier;
        envMapIntensity = 1.2 * qualityMultiplier;
    }
    
    return {
      color: materialColor,
      roughness,
      metalness,
      envMapIntensity
    };
  }, [material, materialColor, qualityLevel]);
  
  // Calculate pillar positions based on count and dimensions
  const pillarPositions = useMemo(() => {
    // Default 4 corner positions
    const basePositions = [
      [-dimensions.length/2, 0, -dimensions.width/2], // front-left
      [dimensions.length/2, 0, -dimensions.width/2],  // front-right
      [-dimensions.length/2, 0, dimensions.width/2],  // back-left
      [dimensions.length/2, 0, dimensions.width/2]    // back-right
    ];
    
    // If we have more than 4 pillars, add additional positions
    if (pillars.count > 4) {
      // Add pillars along the sides
      const additionalCount = pillars.count - 4;
      const positionsPerSide = Math.floor(additionalCount / 4);
      const remainder = additionalCount % 4;
      
      const extraPositions = [];
      
      // Front side extra pillars
      for (let i = 1; i <= positionsPerSide; i++) {
        const ratio = i / (positionsPerSide + 1);
        extraPositions.push([
          -dimensions.length/2 + dimensions.length * ratio,
          0,
          -dimensions.width/2
        ]);
      }
      
      // Right side extra pillars
      for (let i = 1; i <= positionsPerSide; i++) {
        const ratio = i / (positionsPerSide + 1);
        extraPositions.push([
          dimensions.length/2,
          0,
          -dimensions.width/2 + dimensions.width * ratio
        ]);
      }
      
      // Back side extra pillars
      for (let i = 1; i <= positionsPerSide; i++) {
        const ratio = i / (positionsPerSide + 1);
        extraPositions.push([
          -dimensions.length/2 + dimensions.length * ratio,
          0,
          dimensions.width/2
        ]);
      }
      
      // Left side extra pillars
      for (let i = 1; i <= positionsPerSide; i++) {
        const ratio = i / (positionsPerSide + 1);
        extraPositions.push([
          -dimensions.length/2,
          0,
          -dimensions.width/2 + dimensions.width * ratio
        ]);
      }
      
      // Add any remainder pillars to the front side
      for (let i = 1; i <= remainder; i++) {
        const ratio = i / (remainder + 1);
        extraPositions.push([
          -dimensions.length/2 + dimensions.length * ratio,
          0,
          -dimensions.width/2
        ]);
      }
      
      return [...basePositions, ...extraPositions];
    }
    
    return basePositions;
  }, [dimensions, pillars.count]);
  
  // Handle rafter selection for individual control
  const handleRafterClick = (id) => {
    if (rafters.frontToBack.items.find(item => item.id === id)?.selected || rafters.leftToRight.items.find(item => item.id === id)?.selected) {
      onRafterSelect(id);
    }
  };

  // Get individual rafter curvature if available
  const getRafterCurvature = (rafterId) => {
    const individualRafter = rafters.frontToBack.items.find(r => r.id === rafterId) || rafters.leftToRight.items.find(r => r.id === rafterId);
    return individualRafter ? individualRafter.curvature : 0;
  };

  // Function to create a rafter
  const createRafter = (length, width, height, x, y, z, direction, curvature, curvePosition, materialColor, material, index) => {
    // Create rafter geometry
    let rafterGeometry;
    
    if (direction === 'front-back') {
      rafterGeometry = new THREE.BoxGeometry(length, height, width);
    } else {
      rafterGeometry = new THREE.BoxGeometry(width, height, length);
    }
    
    // Create rafter material with consistent properties
    const rafterMaterial = new THREE.MeshStandardMaterial({
      color: materialColor,
      roughness: materialProps.roughness,
      metalness: materialProps.metalness
    });
    
    // Create rafter mesh
    const rafter = new THREE.Mesh(rafterGeometry, rafterMaterial);
    rafter.position.set(x, y, z);
    
    // Add curvature if specified
    if (curvature > 0) {
      // Create a curve
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, y, z - length / 2),
        new THREE.Vector3(x, y + curvature, z - length / 2 + length * curvePosition),
        new THREE.Vector3(x, y, z + length / 2)
      ]);
      
      // Create a tube geometry along the curve
      const tubeGeometry = new THREE.TubeGeometry(curve, 64, width / 2, 8, false);
      
      // Replace the box geometry with the tube geometry
      rafter.geometry = tubeGeometry;
    }
    
    // Add event listener for rafter selection
    rafter.userData = { isRafter: true, id: `rafter-${index}` };
    
    return rafter;
  };

  // No auto-rotation - user can manually control rotation with OrbitControls
  // useFrame was removed to stop auto-rotation

  // Generate front-to-back rafters (left to right)
  const generateFrontToBackRafters = () => {
    if (!rafters.frontToBack.visible || rafters.frontToBack.count <= 0) {
      return [];
    }
    
    // Calculate spacing based on width, count and gap
    const gapFactor = rafters.frontToBack.gap || 0.2; // Default gap factor if not set
    const totalWidth = dimensions.width; // Use full width to connect with frame
    
    // Calculate the actual spacing between rafters based on count and gap factor
    const effectiveWidth = totalWidth * (1 - gapFactor * 0.1); // Slight adjustment for gap
    const spacing = effectiveWidth / Math.max(1, rafters.frontToBack.count);
    const offset = (dimensions.width - effectiveWidth) / 2; // Center the rafters
    
    // Generate rafters
    return Array.from({ length: rafters.frontToBack.count }).map((_, index) => {
      // Calculate position with offset to keep within bounds
      const position = -dimensions.width / 2 + offset + spacing * (index + 0.5);
      
      // Calculate length (exactly matching pergola length)
      const length = dimensions.length; // Full length to connect with frame
      
      // Check if this rafter is visible
      const isVisible = rafters.frontToBack.items[index]?.visible !== false;
      if (!isVisible) return null;
      
      // Get curvature for this rafter
      const curvature = rafters.frontToBack.items[index]?.curvature || 0;
      
      // Position at the top of the pergola
      const yPosition = dimensions.height;
      
      // Create the rafter
      return (
        <group 
          key={`front-back-rafter-${index}`}
          position={[0, yPosition, position]}
        >
          {/* Render square or round rafter based on shape */}
          {curvature === 0 ? (
            // Straight rafter
            rafters.frontToBack.shape === 'square' ? (
              <Box 
                args={[length, rafters.frontToBack.height, rafters.frontToBack.width]} 
                position={[0, rafters.frontToBack.height / 2, 0]}
                onClick={() => handleRafterClick(`front-back-rafter-${index}`)}
              >
                <meshStandardMaterial 
                  color={rafters.frontToBack.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </Box>
            ) : (
              <Cylinder 
                args={[rafters.frontToBack.width / 2, rafters.frontToBack.width / 2, length, 32]} 
                position={[0, rafters.frontToBack.height / 2, 0]}
                rotation={[0, 0, Math.PI / 2]}
                onClick={() => handleRafterClick(`front-back-rafter-${index}`)}
              >
                <meshStandardMaterial 
                  color={rafters.frontToBack.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </Cylinder>
            )
          ) : (
            // Curved rafter - transform the existing rafter
            rafters.frontToBack.shape === 'square' ? (
              // For square rafters, use a tube geometry with the same width/height
              <mesh
                onClick={() => handleRafterClick(`front-back-rafter-${index}`)}
              >
                <tubeGeometry 
                  args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(-length/2, rafters.frontToBack.height/2, 0),
                      new THREE.Vector3(0, rafters.frontToBack.height/2 + curvature, 0),
                      new THREE.Vector3(length/2, rafters.frontToBack.height/2, 0)
                    ]),
                    64, // tubular segments
                    rafters.frontToBack.width/2, // radius
                    8, // radial segments
                    false // closed
                  ]} 
                />
                <meshStandardMaterial 
                  color={rafters.frontToBack.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </mesh>
            ) : (
              // For round rafters, use a tube geometry with consistent radius
              <mesh
                onClick={() => handleRafterClick(`front-back-rafter-${index}`)}
              >
                <tubeGeometry 
                  args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(-length/2, rafters.frontToBack.height/2, 0),
                      new THREE.Vector3(0, rafters.frontToBack.height/2 + curvature, 0),
                      new THREE.Vector3(length/2, rafters.frontToBack.height/2, 0)
                    ]),
                    64, // tubular segments
                    rafters.frontToBack.width/2, // radius
                    16, // radial segments for smoother round appearance
                    false // closed
                  ]} 
                />
                <meshStandardMaterial 
                  color={rafters.frontToBack.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </mesh>
            )
          )}
        </group>
      );
    }).filter(Boolean);
  };

  // Generate left-to-right rafters (front to back)
  const generateLeftToRightRafters = () => {
    if (!rafters.leftToRight.visible || rafters.leftToRight.count <= 0) {
      return [];
    }
    
    // Calculate spacing based on length, count and gap
    const gapFactor = rafters.leftToRight.gap || 0.2; // Default gap factor if not set
    const totalLength = dimensions.length; // Use full length to connect with frame
    
    // Calculate the actual spacing between rafters based on count and gap factor
    const effectiveLength = totalLength * (1 - gapFactor * 0.1); // Slight adjustment for gap
    const spacing = effectiveLength / Math.max(1, rafters.leftToRight.count);
    const offset = (dimensions.length - effectiveLength) / 2; // Center the rafters
    
    // Generate rafters
    return Array.from({ length: rafters.leftToRight.count }).map((_, index) => {
      // Calculate position with offset to keep within bounds
      const position = -dimensions.length / 2 + offset + spacing * (index + 0.5);
      
      // Calculate length (exactly matching pergola width)
      const length = dimensions.width; // Full width to connect with frame
      
      // Check if this rafter is visible
      const isVisible = rafters.leftToRight.items[index]?.visible !== false;
      if (!isVisible) return null;
      
      // Get curvature for this rafter
      const curvature = rafters.leftToRight.items[index]?.curvature || 0;
      
      // Position at the top of the pergola
      const yPosition = dimensions.height;
      
      // Create the rafter
      return (
        <group 
          key={`left-right-rafter-${index}`}
          position={[position, yPosition, 0]}
        >
          {/* Render square or round rafter based on shape */}
          {curvature === 0 ? (
            // Straight rafter
            rafters.leftToRight.shape === 'square' ? (
              <Box 
                args={[rafters.leftToRight.width, rafters.leftToRight.height, length]} 
                position={[0, rafters.leftToRight.height / 2, 0]}
                onClick={() => handleRafterClick(`left-right-rafter-${index}`)}
              >
                <meshStandardMaterial 
                  color={rafters.leftToRight.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </Box>
            ) : (
              <Cylinder 
                args={[rafters.leftToRight.width / 2, rafters.leftToRight.width / 2, length, 32]} 
                position={[0, rafters.leftToRight.height / 2, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                onClick={() => handleRafterClick(`left-right-rafter-${index}`)}
              >
                <meshStandardMaterial 
                  color={rafters.leftToRight.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </Cylinder>
            )
          ) : (
            // Curved rafter - transform the existing rafter
            rafters.leftToRight.shape === 'square' ? (
              // For square rafters, use a tube geometry with the same width/height
              <mesh
                onClick={() => handleRafterClick(`left-right-rafter-${index}`)}
              >
                <tubeGeometry 
                  args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(0, rafters.leftToRight.height/2, -length/2),
                      new THREE.Vector3(0, rafters.leftToRight.height/2 + curvature, 0),
                      new THREE.Vector3(0, rafters.leftToRight.height/2, length/2)
                    ]),
                    64, // tubular segments
                    rafters.leftToRight.width/2, // radius
                    8, // radial segments
                    false // closed
                  ]} 
                />
                <meshStandardMaterial 
                  color={rafters.leftToRight.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </mesh>
            ) : (
              // For round rafters, use a tube geometry with consistent radius
              <mesh
                onClick={() => handleRafterClick(`left-right-rafter-${index}`)}
              >
                <tubeGeometry 
                  args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(0, rafters.leftToRight.height/2, -length/2),
                      new THREE.Vector3(0, rafters.leftToRight.height/2 + curvature, 0),
                      new THREE.Vector3(0, rafters.leftToRight.height/2, length/2)
                    ]),
                    64, // tubular segments
                    rafters.leftToRight.width/2, // radius
                    16, // radial segments for smoother round appearance
                    false // closed
                  ]} 
                />
                <meshStandardMaterial 
                  color={rafters.leftToRight.items[index]?.selected ? '#FFD700' : materialColor} 
                  {...materialProps} 
                />
              </mesh>
            )
          )}
        </group>
      );
    }).filter(Boolean);
  };

  // Generate glass panels if applied
  const generateGlassPanels = () => {
    if (!glass.visible || !glass.applied) return null;
    
    const extension = glass.extension || 0;
    const glassThickness = Math.max(0.003, (glass.thickness || 0.8) / 100); // Convert cm to meters, minimum 3mm
    
    // Calculate glass dimensions with extension
    const glassLength = dimensions.length + (extension * 2);
    const glassWidth = dimensions.width + (extension * 2);
    
    // Position glass at the exact center of the pergola
    const centerX = dimensions.length / 2;
    const centerZ = dimensions.width / 2;
    
    // Calculate the height based on pergola height plus rafter height
    const rafterHeight = Math.max(
      rafters.frontToBack.height || 0.1,
      rafters.leftToRight.height || 0.1
    );
    const glassHeight = dimensions.height + rafterHeight;
    
    // Apply glass position offsets
    const offsetX = glass.position?.x || 0;
    const offsetY = glass.position?.y || 0;
    const offsetZ = glass.position?.z || 0;
    
    // Calculate positions for each panel with offsets
    const topPanelY = glassHeight + offsetY;
    
    // Glass material properties
    const glassMaterialProps = {
      color: glass.color || '#a9c2d9',
      opacity: glass.opacity || 0.6,
      transparent: true,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.9,
      thickness: glassThickness * 100, // Convert back to cm for material
      envMapIntensity: 1,
      ior: 1.5
    };
    
    return (
      <>
        {/* Top glass panel */}
        {glass.sides?.top !== false && (
          <mesh 
            position={[centerX + offsetX, topPanelY, centerZ + offsetZ]} 
            receiveShadow
          >
            <boxGeometry args={[glassLength, glassThickness, glassWidth]} />
            <meshPhysicalMaterial {...glassMaterialProps} />
          </mesh>
        )}
        
        {/* Only render other sides if specifically enabled */}
        {glass.sides?.front && (
          <mesh 
            position={[centerX + offsetX, (glassHeight/2) + offsetY, 0 - extension + offsetZ]} 
            receiveShadow
          >
            <boxGeometry args={[glassLength, glassHeight, glassThickness]} />
            <meshPhysicalMaterial {...glassMaterialProps} />
          </mesh>
        )}
        
        {glass.sides?.back && (
          <mesh 
            position={[centerX + offsetX, (glassHeight/2) + offsetY, dimensions.width + extension + offsetZ]} 
            receiveShadow
          >
            <boxGeometry args={[glassLength, glassHeight, glassThickness]} />
            <meshPhysicalMaterial {...glassMaterialProps} />
          </mesh>
        )}
        
        {glass.sides?.left && (
          <mesh 
            position={[0 - extension + offsetX, (glassHeight/2) + offsetY, centerZ + offsetZ]} 
            receiveShadow
          >
            <boxGeometry args={[glassThickness, glassHeight, glassWidth]} />
            <meshPhysicalMaterial {...glassMaterialProps} />
          </mesh>
        )}
        
        {glass.sides?.right && (
          <mesh 
            position={[dimensions.length + extension + offsetX, (glassHeight/2) + offsetY, centerZ + offsetZ]} 
            receiveShadow
          >
            <boxGeometry args={[glassThickness, glassHeight, glassWidth]} />
            <meshPhysicalMaterial {...glassMaterialProps} />
          </mesh>
        )}
        
        {glass.sides?.bottom && (
          <mesh 
            position={[centerX + offsetX, 0 + offsetY, centerZ + offsetZ]} 
            receiveShadow
          >
            <boxGeometry args={[glassLength, glassThickness, glassWidth]} />
            <meshPhysicalMaterial {...glassMaterialProps} />
          </mesh>
        )}
      </>
    );
  };

  // Monitor camera distance for LOD system
  useFrame(() => {
    if (groupRef.current) {
      // Calculate distance from camera to object center
      const objectPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(objectPosition);
      const distance = camera.position.distanceTo(objectPosition);
      setDistanceFromCamera(distance);
      
      // Determine appropriate LOD level based on distance
      let newLOD = 0; // High detail
      
      if (isMobile) {
        // Mobile devices use lower detail by default
        if (distance > 10) {
          newLOD = 2; // Low detail
        } else if (distance > 5) {
          newLOD = 1; // Medium detail
        }
      } else {
        // Desktop devices can handle more detail
        if (distance > 15) {
          newLOD = 2; // Low detail
        } else if (distance > 8) {
          newLOD = 1; // Medium detail
        }
      }
      
      // Further reduce detail based on GPU tier
      if (gpuTier && gpuTier.tier < 2) {
        newLOD = Math.min(2, newLOD + 1); // Reduce quality by one level
      }
      
      // Update LOD level if changed
      if (newLOD !== currentLOD) {
        setCurrentLOD(newLOD);
      }
    }
  });
  
  // Apply LOD settings to renderer
  useEffect(() => {
    if (gl) {
      // Adjust renderer settings based on LOD and quality level
      if (currentLOD === 0 && qualityLevel === 'high') {
        gl.setPixelRatio(window.devicePixelRatio);
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      } else if (currentLOD === 1 || qualityLevel === 'medium') {
        gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
      } else {
        gl.setPixelRatio(1);
        gl.shadowMap.enabled = false;
      }
    }
  }, [currentLOD, qualityLevel, gl]);
  
  return (
    <group ref={groupRef} position={[pergolaPosition.x, pergolaPosition.y, pergolaPosition.z]}>
      {/* Floor */}
      <mesh 
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[dimensions.length + 2, dimensions.width + 2]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Pillars */}
      {pillarPositions.map((position, index) => {
        // Only render if this pillar is visible or if we don't have visibility data
        const isVisible = index < pillars.visible.length ? pillars.visible[index] : true;
        if (!isVisible) return null;
        
        return (
          <mesh
            key={`pillar-${index}`}
            position={[position[0], position[1] + dimensions.height/2, position[2]]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[pillars.size.width, dimensions.height, pillars.size.depth]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      })}

      {/* Main Beams */}
      {[-dimensions.width/2, dimensions.width/2].map((z, index) => (
        <mesh
          key={`beam-${index}`}
          position={[0, dimensions.height, z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[dimensions.length, rafters.frontToBack.height * 1.5, rafters.frontToBack.width]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      ))}
      
      {/* Side Beams */}
      {[-dimensions.length/2, dimensions.length/2].map((x, index) => (
        <mesh
          key={`side-beam-${index}`}
          position={[x, dimensions.height, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[rafters.leftToRight.width, rafters.leftToRight.height * 1.5, dimensions.width]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      ))}

      {/* Dynamic Rafters */}
      {(() => {
        // If rafters are not visible or style is set to none, don't render any rafters
        if (!rafters.visible || rafters.style === 'none') {
          return null;
        }

        // Generate front-to-back rafters
        const frontToBackRafters = generateFrontToBackRafters();

        // Generate left-to-right rafters
        const leftToRightRafters = generateLeftToRightRafters();

        // If using crosshatch pattern, create intersection points
        if (rafters.pattern === 'crosshatch' && frontToBackRafters && leftToRightRafters) {
          // We'll handle intersections differently - no need for additional cubes
          // The visual effect of the crosshatch is achieved by the proper positioning of the rafters
        }
        
        // Return the rafters
        if (rafters.pattern === 'crosshatch') {
          return [...frontToBackRafters, ...leftToRightRafters];
        } else if (rafters.frontToBack.visible) {
          return frontToBackRafters;
        } else {
          return leftToRightRafters;
        }
      })()} 
      
      {/* Glass Panels */}
      {generateGlassPanels()}
    </group>
  );
});

export default Pergola3DModel;
