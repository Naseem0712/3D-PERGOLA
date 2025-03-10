import React, { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Pergola3DModel from './components/Pergola3DModel'
import PergolaDimensionsPanel from './components/PergolaDimensionsPanel'
import MaterialSelectionPanel from './components/MaterialSelectionPanel'
import PillarCustomizationPanel from './components/PillarCustomizationPanel'
import RafterControlPanel from './components/RafterControlPanel'
import GlassControlPanel from './components/GlassControlPanel'
import PergolaPositionPanel from './components/PergolaPositionPanel'
import EnvironmentToggle from './components/EnvironmentToggle'
import AIRecommendationsPanel from './components/AIRecommendationsPanel'
import LoadingScreen from './components/LoadingScreen'
import CustomerDetailsForm from './components/CustomerDetailsForm'
import ViewSelectionPanel from './components/ViewSelectionPanel'
import MobileTouchControls from './components/MobileTouchControls'
import PerformanceOptimizer from './components/PerformanceOptimizer'
import html2canvas from 'html2canvas'
import hybridAIService from './services/HybridAIService'
import * as THREE from 'three';

// Error Boundary component to catch and handle errors in the 3D components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Rendering Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <directionalLight position={[5, 5, 5]} intensity={1} />
        </group>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  // Core state
  const [dimensions, setDimensions] = useState({ length: 4, width: 3, height: 2.5 })
  const [selectedMaterial, setSelectedMaterial] = useState('aluminium')
  const [materialColor, setMaterialColor] = useState('#a8a8a8')
  const [environment, setEnvironment] = useState('sunset') // 'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'
  const [timeOfDay, setTimeOfDay] = useState('day') // 'day' or 'night'
  const [currentView, setCurrentView] = useState(null) // Added currentView state
  
  // Position state for pergola and glass
  const [pergolaPosition, setPergolaPosition] = useState({ x: 0, y: 0, z: 0 })
  
  // Advanced customization state
  const [pillars, setPillars] = useState({
    count: 4,
    size: { width: 0.1, depth: 0.1 },
    positions: [],
    visible: [true, true, true, true]
  })
  
  const [rafters, setRafters] = useState({
    frontToBack: {
      count: 5,
      width: 0.05,
      height: 0.1,
      gap: 0.2,
      visible: true,
      shape: 'square', // 'square' or 'round'
      items: Array(5).fill().map(() => ({ visible: true, curvature: 0, selected: false }))
    },
    leftToRight: {
      count: 5,
      width: 0.05,
      height: 0.1,
      gap: 0.2,
      visible: true,
      shape: 'square', // 'square' or 'round'
      items: Array(5).fill().map(() => ({ visible: true, curvature: 0, selected: false }))
    },
    pattern: 'crosshatch', // 'parallel' or 'crosshatch'
    style: 'straight', // 'straight' or 'curved'
    visible: true
  })
  
  // Glass state
  const [glass, setGlass] = useState({
    visible: false,
    applied: false,
    color: '#a9c2d9', // Crystal Blue
    opacity: 0.6,
    thickness: 0.8, // in cm
    extension: 0.1, // how far glass extends beyond pergola edge in meters
    position: { x: 0, y: 0, z: 0 },
    sides: {
      top: true,
      bottom: false,
      front: false,
      back: false,
      left: false,
      right: false
    }
  })
  
  // UI state - simplified for reliability
  const [activePanel, setActivePanel] = useState('dimensions')
  const [isLoading, setIsLoading] = useState(true)
  
  // State for AI recommendations
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  
  // State for customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    address: '',
    mobile: '',
    email: '',
    additionalInfo: ''
  });
  
  // State for PDF export view selection
  const [selectedViews, setSelectedViews] = useState({
    frontView: true,
    sideView: true,
    topView: true,
    perspectiveView: true,
    customAngleView: false
  });
  
  // State for showing customer details form
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  // State for showing view selection panel
  const [showViewSelection, setShowViewSelection] = useState(false);
  
  // State for tracking export process
  const [isExporting, setIsExporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('image'); // 'pdf' or 'image'
  const [selectedFormat, setSelectedFormat] = useState('png'); // 'png' or 'jpg'
  
  // State for PDF export quality settings
  const [qualitySettings, setQualitySettings] = useState({
    resolution: 'high',
    includeDetails: true,
    includeMeasurements: true,
    includeWatermark: true
  });
  
  // State for mobile UI control
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // Refs
  const canvasRef = useRef(null)
  const pergola3DRef = useRef(null)
  const cameraRef = useRef(null)
  const modelRef = useRef(null)
  
  // Effect to calculate pillar positions based on dimensions
  useEffect(() => {
    const { length, width } = dimensions;
    const positions = [
      [0, 0, 0], // front-left
      [length, 0, 0], // front-right
      [0, 0, width], // back-left
      [length, 0, width], // back-right
    ];
    
    setPillars(prev => ({ ...prev, positions }));
  }, [dimensions]);

  // Simple loading effect - reduced timeout for faster startup
  useEffect(() => {
    console.log('App component mounted');
    
    // Initialize the AI service with the default design
    hybridAIService.recordInteraction('app_init', {
      initialDesign: {
        dimensions,
        material: selectedMaterial,
        materialColor,
        pillars,
        rafters,
        environment,
        timeOfDay
      }
    });
    
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if all required assets are loaded
    const checkAssetsLoaded = () => {
      // Add a resource check here if needed
      return true;
    };
    
    // Improved loading logic with fallback
    const loadApp = () => {
      try {
        // Preload any critical resources
        const resourcesLoaded = checkAssetsLoaded();
        
        if (resourcesLoaded) {
          console.log('Resources loaded successfully');
          // Use a slightly longer timeout to ensure the 3D engine is fully initialized
          setTimeout(() => {
            console.log('Loading complete');
            setIsLoading(false);
          }, 1500);
        } else {
          console.warn('Resources not fully loaded, using fallback loading');
          // Fallback loading with longer timeout
          setTimeout(() => {
            console.log('Loading complete (fallback)');
            setIsLoading(false);
          }, 2500);
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Emergency fallback - don't leave user stuck on loading screen
        setTimeout(() => {
          console.log('Loading complete (emergency fallback)');
          setIsLoading(false);
        }, 3000);
      }
    };
    
    // Start loading process
    loadApp();
    
    return () => {
      // Clean up any resources if needed
    };
  }, []);
  
  // Debug effect to check if 3D model is properly initialized
  useEffect(() => {
    if (pergola3DRef.current) {
      console.log('Pergola3D ref is available:', pergola3DRef.current);
    }
  }, []);  // Fixed dependency array to prevent excessive re-renders
  
  // Handler functions for dimension changes
  const handleDimensionsChange = (newDimensions) => {
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('dimension_change', {
      dimension: Object.keys(newDimensions).find(key => newDimensions[key] !== dimensions[key]),
      value: Object.values(newDimensions).find((val, idx) => val !== Object.values(dimensions)[idx]),
      previousDimensions: { ...dimensions },
      newDimensions: { ...newDimensions }
    });
    
    setDimensions(newDimensions);
  };
  
  // Handler function for material changes
  const handleMaterialChange = (material) => {
    // Determine the new color based on material
    let newColor;
    switch(material) {
      case 'wood':
        newColor = '#8B4513'; // Dark brown
        break;
      case 'aluminium':
        newColor = '#a8a8a8'; // Light gray
        break;
      case 'iron':
        newColor = '#404040'; // Dark gray
        break;
      case 'wpc':
        newColor = '#DEB887'; // Burlywood (light wood color)
        break;
      default:
        newColor = '#a8a8a8';
    }
    
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('material_select', {
      material,
      previousMaterial: selectedMaterial,
      previousColor: materialColor,
      newColor
    });
    
    setSelectedMaterial(material);
    setMaterialColor(newColor);
  };
  
  // Handler function for pillar changes
  const handlePillarChange = (newPillars) => {
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('pillar_change', {
      property: Object.keys(newPillars)[0],
      value: Object.values(newPillars)[0],
      previousPillars: { ...pillars },
      newPillars: { ...pillars, ...newPillars }
    });
    
    setPillars(prev => ({ ...prev, ...newPillars }));
  };
  
  // Handle rafter changes from the control panel
  const handleRafterChange = (newRafters) => {
    console.log('Rafter changes received:', newRafters);
    
    // Apply the changes to the state
    setRafters(newRafters);
    
    // If forceUpdate flag is set, trigger a re-render by creating a new reference
    if (newRafters.forceUpdate) {
      setTimeout(() => {
        const updatedRafters = JSON.parse(JSON.stringify(newRafters));
        delete updatedRafters.forceUpdate;
        setRafters(updatedRafters);
      }, 0);
    }
    
    // Track changes for AI recommendations
    hybridAIService.trackInteraction('rafters_updated', {
      pattern: newRafters.pattern,
      frontToBackCount: newRafters.frontToBack?.count,
      leftToRightCount: newRafters.leftToRight?.count
    });
  };

  // Handler function for rafter selection
  const handleRafterSelect = (rafterId) => {
    setRafters({
      ...rafters,
      selectedRafter: rafterId
    });
  };

  // Handler function for glass changes
  const handleGlassChange = (newGlass) => {
    hybridAIService.recordInteraction('glass_change', {
      previousGlass: { ...glass },
      newGlass: { ...newGlass }
    });
    
    setGlass(newGlass);
  };

  // Handler function for applying AI recommendations
  const handleApplyRecommendation = (recommendation) => {
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('apply_recommendation', {
      recommendationId: recommendation.id,
      category: recommendation.category,
      before: { 
        dimensions, 
        material: selectedMaterial, 
        materialColor, 
        pillars, 
        rafters,
        glass
      },
      after: {
        dimensions: recommendation.dimensions || dimensions,
        material: recommendation.material || selectedMaterial,
        materialColor: recommendation.materialColor || materialColor,
        pillars: recommendation.pillars || pillars,
        rafters: recommendation.rafters || rafters,
        glass: recommendation.glass || glass
      }
    });
    
    // Apply all the recommended changes
    if (recommendation.dimensions) {
      setDimensions(recommendation.dimensions);
    }
    
    if (recommendation.material) {
      setSelectedMaterial(recommendation.material);
    }
    
    if (recommendation.materialColor) {
      setMaterialColor(recommendation.materialColor);
    }
    
    if (recommendation.pillars) {
      setPillars(recommendation.pillars);
    }
    
    if (recommendation.rafters) {
      setRafters(recommendation.rafters);
    }
    
    if (recommendation.glass) {
      setGlass(recommendation.glass);
    }
    
    // Close the recommendations panel
    setShowAIRecommendations(false);
  };

  // Function to generate AI recommendations based on current settings
  const generateAIRecommendations = () => {
    console.log('Generating AI recommendations...');
    // Toggle the recommendations panel
    setShowAIRecommendations(prev => !prev);
    
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('request_recommendations', {
      currentDesign: {
        dimensions,
        material: selectedMaterial,
        materialColor,
        pillars,
        rafters,
        glass,
        environment,
        timeOfDay
      }
    });
  };

  // Function to update the current view
  const updateCurrentView = (newView) => {
    console.log('Updating current view:', newView);
    setCurrentView(newView);
    
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('view_change', {
      newView,
      dimensions,
      material: selectedMaterial,
      materialColor,
      pillars,
      rafters,
      glass,
      environment,
      timeOfDay
    });
  };

  // Function to export the 3D model as an image
  const exportImage = (format = 'png', quality = 0.9) => {
    console.log('Export image called with format:', format, 'quality:', quality);
    
    // Set exporting state
    setIsExporting(true);
    
    try {
      // Get the original canvas element
      const originalCanvas = document.querySelector('canvas');
      
      if (!originalCanvas) {
        console.error('Canvas element not found');
        setIsExporting(false);
        return;
      }
      
      // Create a temporary img element
      const img = new Image();
      
      // When the image is loaded, create high-resolution export
      img.onload = () => {
        try {
          // Create a new canvas for high-resolution export
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = 2000;  // 2000 pixels width
          exportCanvas.height = 2000; // 2000 pixels height
          
          const ctx = exportCanvas.getContext('2d');
          
          // Fill with black background first
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          
          // Calculate aspect ratio to maintain proportions
          const originalAspect = originalCanvas.width / originalCanvas.height;
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (originalAspect >= 1) {
            // Original is wider or square
            drawWidth = exportCanvas.width;
            drawHeight = drawWidth / originalAspect;
            offsetX = 0;
            offsetY = (exportCanvas.height - drawHeight) / 2;
          } else {
            // Original is taller
            drawHeight = exportCanvas.height;
            drawWidth = drawHeight * originalAspect;
            offsetX = (exportCanvas.width - drawWidth) / 2;
            offsetY = 0;
          }
          
          // Draw the image centered and scaled
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Convert to data URL
          let imageDataUrl;
          if (format === 'png') {
            imageDataUrl = exportCanvas.toDataURL('image/png');
          } else {
            imageDataUrl = exportCanvas.toDataURL('image/jpeg', quality);
          }
          
          // Create download link
          const link = document.createElement('a');
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          link.download = `pergola-design-${timestamp}.${format}`;
          link.href = imageDataUrl;
          document.body.appendChild(link);
          
          // Trigger download
          link.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
            setIsExporting(false);
            setExportDialogOpen(false);
          }, 100);
          
        } catch (err) {
          console.error('Error in image processing:', err);
          setIsExporting(false);
        }
      };
      
      // Handle image loading error
      img.onerror = () => {
        console.error('Error loading image from canvas');
        setIsExporting(false);
      };
      
      // Convert canvas to data URL and load into image
      img.src = originalCanvas.toDataURL('image/png');
      
    } catch (error) {
      console.error('Error in export process:', error);
      setIsExporting(false);
    }
  };

  // Handler function for environment changes
  const handleEnvironmentChange = (newEnvironment) => {
    console.log('Environment changed to:', newEnvironment);
    setEnvironment(newEnvironment);
    
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('environment_change', {
      environment: newEnvironment,
      previousEnvironment: environment
    });
  }

  // Handler function for time of day changes
  const handleTimeOfDayChange = (newTimeOfDay) => {
    console.log('Time of day changed to:', newTimeOfDay);
    setTimeOfDay(newTimeOfDay);
    
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('time_of_day_change', {
      timeOfDay: newTimeOfDay,
      previousTimeOfDay: timeOfDay
    });
  }

  // Handler function for pergola position changes
  const handlePergolaPositionChange = (newPosition) => {
    hybridAIService.recordInteraction('pergola_position_change', {
      previousPosition: { ...pergolaPosition },
      newPosition: { ...newPosition }
    });
    
    setPergolaPosition(newPosition);
  };

  // Handle toggle panel visibility for mobile
  const togglePanelVisibility = () => {
    setIsPanelVisible(!isPanelVisible);
  };
  
  // Reset camera view
  const handleResetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(5, 5, 5);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };
  
  // Handle quality change from performance optimizer
  const handleQualityChange = (quality, settings) => {
    console.log(`Quality changed to ${quality}`, settings);
    // Update quality settings for image export
    setQualitySettings(prev => ({
      ...prev,
      resolution: quality
    }));
  };
  
  // Available panels for mobile quick access
  const availablePanels = [
    { 
      id: 'dimensions', 
      label: 'Dimensions', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18v18H3z"></path>
        </svg>
      ) 
    },
    { 
      id: 'material', 
      label: 'Material', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      ) 
    },
    { 
      id: 'pillars', 
      label: 'Pillars', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h12"></path>
          <path d="M6 6h12"></path>
          <path d="M8 6v12"></path>
          <path d="M16 6v12"></path>
        </svg>
      ) 
    },
    { 
      id: 'rafters', 
      label: 'Rafters', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M3 12h18"></path>
          <path d="M3 18h18"></path>
        </svg>
      ) 
    },
    { 
      id: 'glass', 
      label: 'Glass', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"></path>
        </svg>
      ) 
    }
  ];

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'dimensions':
        return (
          <motion.div
            key="dimensions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <PergolaDimensionsPanel dimensions={dimensions} onDimensionsChange={handleDimensionsChange} />
          </motion.div>
        );
      case 'materials':
        return (
          <motion.div
            key="materials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MaterialSelectionPanel 
              selectedMaterial={selectedMaterial} 
              onMaterialChange={handleMaterialChange}
              materialColor={materialColor}
              onColorChange={setMaterialColor}
            />
          </motion.div>
        );
      case 'advanced':
        return (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-5">
              <PillarCustomizationPanel pillars={pillars} onPillarsChange={handlePillarChange} />
              <div className="mt-6">
                <RafterControlPanel rafters={rafters} onRaftersChange={handleRafterChange} />
              </div>
              <div className="mt-6">
                <GlassControlPanel glass={glass} onGlassChange={handleGlassChange} />
              </div>
              <div className="mt-6">
                <PergolaPositionPanel pergolaPosition={pergolaPosition} onPositionChange={handlePergolaPositionChange} />
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <PergolaDimensionsPanel dimensions={dimensions} onDimensionsChange={handleDimensionsChange} />
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : (
        <motion.div 
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        >
          <div className="h-screen flex flex-col">
            {/* Navbar */}
            <Navbar 
              onExportClick={() => setExportDialogOpen(true)} 
              isMobile={isMobileDevice}
              onTogglePanelVisibility={togglePanelVisibility}
            />
            
            {/* Main Content */}
            <div className="flex h-[calc(100vh-64px)]">
              
              {/* Left Panel - Controls */}
              <motion.div 
                initial={isMobileDevice ? { y: '100%' } : { x: -320 }}
                animate={
                  isMobileDevice 
                    ? { y: isPanelVisible ? 0 : '100%' } 
                    : { x: isPanelVisible ? 0 : -320 }
                }
                transition={{ type: 'spring', damping: 30 }}
                className={`${isMobileDevice ? 'w-full' : 'w-80'} premium-panel-container ${isPanelVisible && isMobileDevice ? 'visible' : ''}`}
                style={{ zIndex: isMobileDevice ? 50 : 10 }}
              >
                {/* Close button for mobile */}
                {isMobileDevice && (
                  <button 
                    onClick={togglePanelVisibility}
                    className="absolute top-2 right-2 p-2 text-white/70 hover:text-white"
                    aria-label="Close panel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* Panel Navigation */}
                <div className="flex space-x-2 pb-4 border-b border-white/10 mb-4">
                  <button 
                    onClick={() => setActivePanel('dimensions')}
                    className={`premium-tab ${activePanel === 'dimensions' ? 'active' : ''}`}
                  >
                    Dimensions
                  </button>
                  <button 
                    onClick={() => setActivePanel('materials')}
                    className={`premium-tab ${activePanel === 'materials' ? 'active' : ''}`}
                  >
                    Materials
                  </button>
                  <button 
                    onClick={() => setActivePanel('advanced')}
                    className={`premium-tab ${activePanel === 'advanced' ? 'active' : ''}`}
                  >
                    Advanced
                  </button>
                </div>
                
                {/* Dynamic Panel Content */}
                <AnimatePresence mode="wait">
                  {renderActivePanel()}
                </AnimatePresence>
                
                {/* AI Recommendations Button */}
                <button
                  onClick={generateAIRecommendations}
                  className="button-accent w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span>AI Design Suggestions</span>
                </button>
              </motion.div>

              {/* Mobile Panel Toggle Button (only visible on mobile) */}
              {isMobileDevice && !isPanelVisible && (
                <button 
                  onClick={togglePanelVisibility}
                  className="mobile-panel-toggle shadow-lg"
                  style={{ zIndex: 45 }}
                  aria-label="Open control panel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="mobile-panel-toggle-text">Open Controls</span>
                </button>
              )}
              
              {/* 3D Visualization Area */}
              <div className={`relative flex-1 canvas-container ${isMobileDevice ? 'mobile-canvas' : ''}`}>
                <Canvas
                  ref={canvasRef}
                  shadows
                  camera={{ position: [5, 5, 5], fov: 50 }}
                  gl={{ 
                    antialias: !isMobileDevice, // Disable antialiasing on mobile for better performance
                    preserveDrawingBuffer: true, // Required for screenshots
                    powerPreference: "high-performance"
                  }}
                  dpr={isMobileDevice ? [1, 1.5] : [1, 2]} // Lower resolution on mobile
                  performance={{ min: 0.5 }} // Allow frame rate to drop for better performance
                >
                  <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    position={[5, 5, 5]}
                    fov={50}
                    near={0.1}
                    far={1000}
                  />
                  <color attach="background" args={['#000000']} />
                  
                  {/* Ambient light */}
                  <ambientLight intensity={0.4} />
                  
                  {/* Main directional light with shadows */}
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow={!isMobileDevice} // Disable shadows on mobile for better performance
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                  />
                  
                  {/* Secondary fill light */}
                  <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                  
                  {/* Environment based on selected environment */}
                  <Environment preset={environment} background={false} />
                  
                  {/* Error boundary for 3D components */}
                  <ErrorBoundary>
                    <Suspense fallback={null}>
                      {/* Main pergola model */}
                      <Pergola3DModel
                        ref={modelRef}
                        dimensions={dimensions}
                        material={selectedMaterial}
                        materialColor={materialColor}
                        pillars={pillars}
                        rafters={rafters}
                        glass={glass}
                        pergolaPosition={pergolaPosition}
                        onRafterSelect={handleRafterSelect}
                        qualityLevel={qualitySettings.resolution}
                        isMobile={isMobileDevice}
                        modelRef={modelRef}
                      />
                    </Suspense>
                  </ErrorBoundary>
                  
                  {/* Controls */}
                  <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    minDistance={2}
                    maxDistance={20}
                    target={[dimensions.length / 2, dimensions.height / 2, dimensions.width / 2]}
                    makeDefault
                  />
                </Canvas>
                
                {/* Floating Controls */}
                <div className="absolute top-6 right-6 flex flex-col space-y-4">
                  <EnvironmentToggle
                    environment={environment}
                    timeOfDay={timeOfDay}
                    onEnvironmentChange={handleEnvironmentChange}
                    onTimeOfDayChange={handleTimeOfDayChange}
                  />
                  
                </div>
                
                {/* AI Recommendations Panel */}
                <AnimatePresence>
                  {showAIRecommendations && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[600px] max-w-[90%] bg-black/50 backdrop-blur-xl p-6 rounded-xl border border-white/10"
                      style={{ zIndex: 45 }}
                    >
                      <AIRecommendationsPanel 
                        dimensions={dimensions}
                        material={selectedMaterial}
                        onClose={() => setShowAIRecommendations(false)}
                        materialColor={materialColor}
                        pillars={pillars}
                        rafters={rafters}
                        glass={glass}
                        onApplyRecommendation={handleApplyRecommendation}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Export Dialog */}
                <AnimatePresence>
                  {exportDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md text-white shadow-2xl border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold">Export Image</h3>
                          <button 
                            className="text-gray-400 hover:text-white"
                            onClick={() => setExportDialogOpen(false)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mb-4">
                          <div className="bg-gray-800 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-300 mb-1">Image Settings:</p>
                            <p className="font-medium">Resolution: 2000 x 2000 pixels</p>
                            <p className="font-medium">Quality: 300 PPI (Print Quality)</p>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm mb-2">Select Format:</p>
                            <div className="flex space-x-2">
                              <button 
                                className={`flex-1 py-2 px-3 rounded-lg transition-colors ${selectedFormat === 'png' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                onClick={() => setSelectedFormat('png')}
                              >
                                PNG (Lossless)
                              </button>
                              <button 
                                className={`flex-1 py-2 px-3 rounded-lg transition-colors ${selectedFormat === 'jpg' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                onClick={() => setSelectedFormat('jpg')}
                              >
                                JPG (High Quality)
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <div className="flex justify-end mt-6">
                            <button
                              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg"
                              onClick={() => exportImage(selectedFormat, selectedFormat === 'jpg' ? 0.9 : 1.0)}
                              disabled={isExporting}
                            >
                              {isExporting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Exporting...</span>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  <span>Export Now</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
                
                {/* Mobile Touch Controls */}
                {isMobileDevice && (
                  <MobileTouchControls 
                    availablePanels={availablePanels}
                    activePanel={activePanel}
                    onPanelChange={setActivePanel}
                    onTogglePanelVisibility={togglePanelVisibility}
                    onResetView={handleResetView}
                  />
                )}
                
                {/* Performance Optimizer */}
                <PerformanceOptimizer 
                  onQualityChange={handleQualityChange}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
