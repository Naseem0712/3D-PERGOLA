import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDoubleRightIcon, 
  ChevronDoubleLeftIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  HeartIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

import Pergola3DModel from './components/Pergola3DModel';
import QuickPreviewMode from './components/QuickPreviewMode';
import WishlistPanel from './components/WishlistPanel';
import VoiceCommandControl from './components/VoiceCommandControl';
import PDFExport from './components/PDFExport';

import Navbar from './components/Navbar';
import PergolaDimensionsPanel from './components/PergolaDimensionsPanel';
import MaterialSelectionPanel from './components/MaterialSelectionPanel';
import PillarCustomizationPanel from './components/PillarCustomizationPanel';
import RafterControlPanel from './components/RafterControlPanel';
import GlassControlPanel from './components/GlassControlPanel';
import PergolaPositionPanel from './components/PergolaPositionPanel';
import EnvironmentToggle from './components/EnvironmentToggle';
import AIRecommendationsPanel from './components/AIRecommendationsPanel';
import LoadingScreen from './components/LoadingScreen';
import CustomerDetailsForm from './components/CustomerDetailsForm';
import ViewSelectionPanel from './components/ViewSelectionPanel';
import PDFControlPanel from './components/PDFControlPanel';
import { jsPDF } from 'jspdf';
import hybridAIService from './services/HybridAIService';

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
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(true)
  
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
  const [exportType, setExportType] = useState('pdf'); // 'pdf' or 'image'
  
  // State for PDF export quality settings
  const [qualitySettings, setQualitySettings] = useState({
    resolution: 'high',
    includeDetails: true,
    includeMeasurements: true,
    includeWatermark: true
  });
  
  // State for new features
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [voiceControlOpen, setVoiceControlOpen] = useState(false);
  const [pdfExportOpen, setPdfExportOpen] = useState(false);
  
  // Refs
  const canvasRef = useRef(null)
  const pergola3DRef = useRef(null)
  const cameraRef = useRef(null)
  const modelContainerRef = useRef(null)
  
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
  
  // Effect to handle dark mode changes
  useEffect(() => {
    // Apply dark mode to the document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    // Record user preference in AI service
    hybridAIService.recordInteraction('toggle_dark_mode', {
      newMode: !darkMode ? 'dark' : 'light'
    });
  };

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

  // Function to handle export button click from Navbar
  const handleExportClick = () => {
    // Show the customer details form first
    setShowCustomerForm(true);
    
    // Track this interaction
    hybridAIService.trackInteraction('export_initiated', { type: 'pdf' });
  };

  // Function to export design as PDF - with improved features
  const exportAsPDF = async () => {
    setIsExporting(true);
    console.log('Starting PDF export with user-selected views...');
    
    // Get the canvas element
    const canvasElement = document.querySelector('canvas');
    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }
    
    // Create a temporary canvas for higher quality rendering
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    
    // Set quality factor based on settings
    let qualityFactor = 0.8; // Default high quality
    let scaleFactor = 2;
    
    switch (qualitySettings.resolution) {
      case 'ultra':
        qualityFactor = 1.0;
        scaleFactor = 3;
        break;
      case 'high':
        qualityFactor = 0.8;
        scaleFactor = 2;
        break;
      case 'medium':
        qualityFactor = 0.6;
        scaleFactor = 1.5;
        break;
      case 'low':
        qualityFactor = 0.4;
        scaleFactor = 1;
        break;
    }
    
    // Get original dimensions
    const originalWidth = canvasElement.width;
    const originalHeight = canvasElement.height;
    
    // Set temporary canvas size
    tempCanvas.width = originalWidth * scaleFactor;
    tempCanvas.height = originalHeight * scaleFactor;
    
    // Store original camera state
    const originalCameraState = {
      position: { 
        x: cameraRef.current.position.x, 
        y: cameraRef.current.position.y, 
        z: cameraRef.current.position.z 
      },
      rotation: { 
        x: cameraRef.current.rotation.x, 
        y: cameraRef.current.rotation.y, 
        z: cameraRef.current.rotation.z 
      }
    };
    
    // Function to capture view from a specific camera position with optimal framing
    const captureView = (posX, posY, posZ, lookAtX, lookAtY, lookAtZ) => {
      return new Promise(resolve => {
        // Position camera
        cameraRef.current.position.set(posX, posY, posZ);
        cameraRef.current.lookAt(lookAtX, lookAtY, lookAtZ);
        
        // Allow time for the camera to update and render
        setTimeout(() => {
          // Render the scene
          tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempContext.drawImage(canvasElement, 0, 0, tempCanvas.width, tempCanvas.height);
          
          // Get the image data
          const imageData = tempCanvas.toDataURL('image/jpeg', qualityFactor);
          resolve(imageData);
        }, 200); // Increased delay for better rendering
      });
    };
    
    // Create views based on user selection
    const captureSelectedViews = async () => {
      const views = {};
      
      // Calculate optimal distances based on pergola dimensions
      const maxDimension = Math.max(dimensions.width, dimensions.length, dimensions.height);
      const optimalDistance = maxDimension * 1.8; // Optimal distance for a good view
      const centerY = dimensions.height / 2;
      
      // Front view (from front of pergola)
      if (selectedViews.frontView) {
        views.frontView = await captureView(
          0, centerY, optimalDistance,
          0, centerY, 0
        );
      }
      
      // Side view (from right side of pergola)
      if (selectedViews.sideView) {
        views.sideView = await captureView(
          optimalDistance, centerY, 0,
          0, centerY, 0
        );
      }
      
      // Top view (from above pergola)
      if (selectedViews.topView) {
        views.topView = await captureView(
          0, optimalDistance * 1.2, 0,
          0, 0, 0
        );
      }
      
      // Perspective view (from corner)
      if (selectedViews.perspectiveView) {
        views.perspectiveView = await captureView(
          optimalDistance * 0.8, optimalDistance * 0.6, optimalDistance * 0.8,
          dimensions.width / 2, dimensions.height / 2, dimensions.length / 2
        );
      }
      
      // Custom angle view if selected
      if (selectedViews.customAngleView) {
        // Use current camera position for custom view
        views.customView = await captureView(
          originalCameraState.position.x,
          originalCameraState.position.y,
          originalCameraState.position.z,
          0, dimensions.height / 2, 0
        );
      }
      
      return views;
    };
    
    // Capture views based on user selection
    const views = await captureSelectedViews();
    
    // Restore original camera position
    cameraRef.current.position.set(
      originalCameraState.position.x,
      originalCameraState.position.y,
      originalCameraState.position.z
    );
    cameraRef.current.rotation.set(
      originalCameraState.rotation.x,
      originalCameraState.rotation.y,
      originalCameraState.rotation.z
    );
    
    // Create a new PDF document
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    // Function to add mint background to pages
    const addPageWithBackground = () => {
      // Add subtle mint background
      pdf.setFillColor(235, 245, 240);
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
    };
    
    // Add background to first page
    addPageWithBackground();
    
    // Capture the main image for the first page
    const mainImgData = views.frontView;
    
    // Add luxury branding header
    // Add elegant border at the top
    pdf.setDrawColor(0, 75, 155);
    pdf.setLineWidth(0.5);
    pdf.line(10, 10, pdf.internal.pageSize.getWidth() - 10, 10);
    
    pdf.setTextColor(0, 75, 155);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LUXURY', pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'italic');
    pdf.text('PERGOLA DESIGNS', pdf.internal.pageSize.getWidth() / 2, 32, { align: 'center' });
    
    // Add elegant border below the title
    pdf.line(pdf.internal.pageSize.getWidth() / 2 - 40, 36, pdf.internal.pageSize.getWidth() / 2 + 40, 36);
    
    // Add date with elegant formatting
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Created: ${currentDate}`, pdf.internal.pageSize.getWidth() - 20, 15, { align: 'right' });
    
    // Add the main image to the first page with elegant border
    const imgWidth = 180; // Width in mm
    const imgHeight = (tempCanvas.height * imgWidth) / tempCanvas.width;
    const imgX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
    const imgY = 45;
    
    // Add drop shadow effect (simulate by adding darker rectangle behind)
    pdf.setFillColor(220, 220, 220);
    pdf.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4, 'F');
    
    // Add image with border
    pdf.addImage(mainImgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
    pdf.setDrawColor(0, 75, 155);
    pdf.setLineWidth(0.3);
    pdf.rect(imgX, imgY, imgWidth, imgHeight);
    
    // Add caption below the image
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Your Custom Pergola Design', pdf.internal.pageSize.getWidth() / 2, imgY + imgHeight + 8, { align: 'center' });
    
    // Add a new page for specifications
    pdf.addPage();
    addPageWithBackground();
    
    // Add header to specifications page
    pdf.setDrawColor(0, 75, 155);
    pdf.setLineWidth(0.5);
    pdf.line(10, 10, pdf.internal.pageSize.getWidth() - 10, 10);
    
    pdf.setTextColor(0, 75, 155);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESIGN SPECIFICATIONS', pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    
    // Add elegant border below the title
    pdf.line(pdf.internal.pageSize.getWidth() / 2 - 50, 29, pdf.internal.pageSize.getWidth() / 2 + 50, 29);
    
    // Create specification boxes in a grid layout
    const createSpecBox = (title, content, x, y, width, height) => {
      // Draw box with subtle gradient
      pdf.setFillColor(235, 245, 240);
      pdf.roundedRect(x, y, width, height, 2, 2, 'F');
      pdf.setFillColor(225, 235, 230);
      pdf.roundedRect(x, y, width, 8, 2, 2, 'F');
      
      // Add border
      pdf.setDrawColor(0, 75, 155);
      pdf.setLineWidth(0.2);
      pdf.roundedRect(x, y, width, height, 2, 2, 'S');
      
      // Add title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 75, 155);
      pdf.text(title, x + 5, y + 6);
      
      // Add content
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      
      if (Array.isArray(content)) {
        let contentY = y + 16;
        content.forEach(line => {
          pdf.text(line, x + 5, contentY);
          contentY += 6;
        });
      } else {
        pdf.text(content, x + 5, y + 16);
      }
    };
    
    // Create specification grid
    const margin = 15;
    const gutter = 10;
    const specBoxWidth = (pdf.internal.pageSize.getWidth() - (2 * margin) - gutter) / 2;
    const specBoxHeight = 40;
    
    // Row 1
    createSpecBox('DIMENSIONS', 
      `Width: ${dimensions.width.toFixed(2)}m × Height: ${dimensions.height.toFixed(2)}m × Depth: ${dimensions.length.toFixed(2)}m`, 
      margin, 40, specBoxWidth, specBoxHeight);
        
    createSpecBox('MATERIAL', 
      [`Type: ${selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)}`, 
       `Color: ${materialColor}`], 
      margin + specBoxWidth + gutter, 40, specBoxWidth, specBoxHeight);
      
    // Row 2
    createSpecBox('PILLARS', 
      [`Count: ${pillars.count}`, 
       `Size: ${pillars.size.width.toFixed(2)}m × ${pillars.size.depth.toFixed(2)}m`], 
      margin, 40 + specBoxHeight + gutter, specBoxWidth, specBoxHeight);
        
    createSpecBox('RAFTERS', 
      [`Front to Back: ${rafters.frontToBack.count}`, 
       `Side to Side: ${rafters.leftToRight.count}`], 
      margin + specBoxWidth + gutter, 40 + specBoxHeight + gutter, specBoxWidth, specBoxHeight);
      
    // Row 3 - Glass details if visible
    if (glass.visible) {
      const glassContent = [
        `Color: ${glass.color}`,
        `Opacity: ${(glass.opacity * 100).toFixed(0)}%`,
        `Thickness: ${glass.thickness.toFixed(1)} cm`
      ];
      
      // Add visible sides if any
      const visibleSides = Object.entries(glass.sides)
        .filter(([_, isVisible]) => isVisible)
        .map(([side]) => side.charAt(0).toUpperCase() + side.slice(1))
        .join(', ');
        
      if (visibleSides) {
        glassContent.push(`Visible Sides: ${visibleSides}`);
      }
      
      createSpecBox('GLASS DETAILS', glassContent, 
        margin, 40 + (specBoxHeight + gutter) * 2, specBoxWidth * 2 + gutter, specBoxHeight + 10);
    }
    
    // Add multiple views of the pergola
    // We need to capture different angles of the pergola
    
    // Add a section for multiple views
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 75, 155);
    pdf.text('MULTIPLE VIEWS', pdf.internal.pageSize.getWidth() / 2, 150, { align: 'center' });
    
    // Add elegant border below the title
    pdf.line(pdf.internal.pageSize.getWidth() / 2 - 30, 154, pdf.internal.pageSize.getWidth() / 2 + 30, 154);
    
    // Create a grid of views
    const viewWidth = (pdf.internal.pageSize.getWidth() - (2 * 15) - (2 * 10)) / 3;
    const viewHeight = (viewWidth * tempCanvas.height) / tempCanvas.width;
    const viewY = 160;
    
    // Add view labels and images
    const addView = (title, imgData, x, y, width, height) => {
      if (!imgData) return; // Skip if no image data
      
      // Add image with border
      pdf.addImage(imgData, 'JPEG', x, y, width, height);
      pdf.setDrawColor(0, 75, 155);
      pdf.setLineWidth(0.2);
      pdf.rect(x, y, width, height);
      
      // Add label
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(title, x + width / 2, y + height + 5, { align: 'center' });
    };
    
    // Calculate positions for views based on how many are selected
    const selectedViewsCount = Object.values(views).filter(Boolean).length;
    let viewPositions = [];
    
    if (selectedViewsCount === 1) {
      // Center the single view
      const singleViewWidth = (pdf.internal.pageSize.getWidth() - 30);
      const singleViewHeight = (singleViewWidth * tempCanvas.height) / tempCanvas.width;
      viewPositions.push({
        x: 15,
        y: viewY,
        width: singleViewWidth,
        height: singleViewHeight
      });
    } else if (selectedViewsCount === 2) {
      // Two views side by side
      const twoViewWidth = (pdf.internal.pageSize.getWidth() - 40) / 2;
      const twoViewHeight = (twoViewWidth * tempCanvas.height) / tempCanvas.width;
      viewPositions.push(
        { x: 15, y: viewY, width: twoViewWidth, height: twoViewHeight },
        { x: 15 + twoViewWidth + 10, y: viewY, width: twoViewWidth, height: twoViewHeight }
      );
    } else {
      // Default grid layout for 3+ views
      const gridWidth = (pdf.internal.pageSize.getWidth() - (2 * 15) - (2 * 10)) / 3;
      const gridHeight = (gridWidth * tempCanvas.height) / tempCanvas.width;
      
      // First row
      viewPositions.push(
        { x: 15, y: viewY, width: gridWidth, height: gridHeight },
        { x: 15 + gridWidth + 10, y: viewY, width: gridWidth, height: gridHeight },
        { x: 15 + (gridWidth + 10) * 2, y: viewY, width: gridWidth, height: gridHeight }
      );
      
      // Second row if needed
      if (selectedViewsCount > 3) {
        const secondRowY = viewY + gridHeight + 20;
        viewPositions.push(
          { x: 15 + gridWidth / 2, y: secondRowY, width: gridWidth, height: gridHeight },
          { x: 15 + gridWidth + 10 + gridWidth / 2, y: secondRowY, width: gridWidth, height: gridHeight }
        );
      }
    }
    
    // Add views in order of importance
    let viewIndex = 0;
    
    // Front view
    if (views.frontView && viewIndex < viewPositions.length) {
      addView('Front View', views.frontView, 
        viewPositions[viewIndex].x, 
        viewPositions[viewIndex].y, 
        viewPositions[viewIndex].width, 
        viewPositions[viewIndex].height
      );
      viewIndex++;
    }
    
    // Perspective view (most important after front)
    if (views.perspectiveView && viewIndex < viewPositions.length) {
      addView('Perspective View', views.perspectiveView, 
        viewPositions[viewIndex].x, 
        viewPositions[viewIndex].y, 
        viewPositions[viewIndex].width, 
        viewPositions[viewIndex].height
      );
      viewIndex++;
    }
    
    // Side view
    if (views.sideView && viewIndex < viewPositions.length) {
      addView('Side View', views.sideView, 
        viewPositions[viewIndex].x, 
        viewPositions[viewIndex].y, 
        viewPositions[viewIndex].width, 
        viewPositions[viewIndex].height
      );
      viewIndex++;
    }
    
    // Top view
    if (views.topView && viewIndex < viewPositions.length) {
      addView('Top View', views.topView, 
        viewPositions[viewIndex].x, 
        viewPositions[viewIndex].y, 
        viewPositions[viewIndex].width, 
        viewPositions[viewIndex].height
      );
      viewIndex++;
    }
    
    // Custom view
    if (views.customView && viewIndex < viewPositions.length) {
      addView('Custom View', views.customView, 
        viewPositions[viewIndex].x, 
        viewPositions[viewIndex].y, 
        viewPositions[viewIndex].width, 
        viewPositions[viewIndex].height
      );
      viewIndex++;
    }
    
    // Add watermark if enabled
    if (qualitySettings.includeWatermark) {
      pdf.setTextColor(230, 230, 230); // Very light gray for watermark
      pdf.setFontSize(60);
      pdf.setFont('helvetica', 'bold');
      pdf.save();
      pdf.rotate(45, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() / 2);
      pdf.text('LUXURY', pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() / 2, { align: 'center' });
      pdf.restore();
    }
    
    // Add footer with page number
    const addFooter = (pageNum, totalPages) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${pageNum} of ${totalPages}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
      
      // Add website or contact info
      pdf.text('www.luxurypergola.com', 15, pdf.internal.pageSize.getHeight() - 10);
      pdf.text('contact@luxurypergola.com | +1 (800) PERGOLA', pdf.internal.pageSize.getWidth() - 15, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
    };
    
    // Add footers to all pages
    const totalPages = 2;
    addFooter(1, totalPages);
    addFooter(2, totalPages);
    
    // Save the PDF with customer name in filename
    const filename = customerDetails.name 
      ? `Luxury_Pergola_Design_${customerDetails.name.replace(/\s+/g, '_')}.pdf`
      : 'Luxury_Pergola_Design.pdf';
        
    pdf.save(filename);
    console.log('High-quality luxury PDF exported successfully');
    
    // Reset export states
    setTimeout(() => {
      setIsExporting(false);
      setShowCustomerForm(false);
    }, 1000);
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

  // Get current design state
  const getCurrentDesign = () => {
    return {
      dimensions,
      material: selectedMaterial,
      materialColor,
      pillars,
      rafters,
      glass
    };
  };

  // Apply a design preset
  const applyDesign = (design) => {
    if (design.dimensions) setDimensions(design.dimensions);
    if (design.material) setSelectedMaterial(design.material);
    if (design.materialColor) setMaterialColor(design.materialColor);
    if (design.pillars) setPillars(design.pillars);
    if (design.rafters) setRafters(design.rafters);
    if (design.glass) setGlass(design.glass);
  };

  // Capture screenshot for PDF export
  const captureScreenshot = async () => {
    if (!modelContainerRef.current) return null;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(modelContainerRef.current);
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return null;
    }
  };

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    if (command === 'reset') {
      // Reset to default design
      setDimensions({ length: 4, width: 3, height: 2.5 });
      setSelectedMaterial('aluminium');
      setMaterialColor('#a8a8a8');
      setPillars({
        count: 4,
        size: { width: 0.1, depth: 0.1 }
      });
      setRafters({
        pattern: 'crosshatch',
        frontToBack: { count: 6, width: 0.05, height: 0.1 },
        leftToRight: { count: 6, width: 0.05, height: 0.1 }
      });
      setGlass({
        visible: true,
        applied: true,
        color: '#a9c2d9',
        opacity: 0.6,
        sides: { top: true, front: false, back: false, left: false, right: false }
      });
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
          className={`h-screen w-screen ${darkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-100 to-white'} text-white overflow-hidden`}
        >
          <div className="h-screen flex flex-col">
            {/* Navbar */}
            <Navbar 
              onExportClick={handleExportClick}
              onToggleQuickPreview={() => setQuickPreviewOpen(!quickPreviewOpen)}
              onToggleWishlist={() => setWishlistOpen(!wishlistOpen)}
              onToggleVoiceControl={() => setVoiceControlOpen(!voiceControlOpen)}
              onTogglePDFExport={() => setPdfExportOpen(!pdfExportOpen)}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
            
            {/* Main Content */}
            <div className="flex h-[calc(100vh-64px)]">
              
              {/* Left Panel - Controls */}
              <motion.div 
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 30 }}
                className="w-80 premium-panel-container"
              >
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

              {/* 3D Visualization Area */}
              <div className="flex-1 relative" ref={modelContainerRef}>
                
                <Canvas
                  shadows
                  gl={{
                    antialias: true,
                    alpha: false, 
                    powerPreference: 'default', 
                    preserveDrawingBuffer: true,
                    depth: true,
                  }}
                  dpr={1} 
                  onCreated={state => {
                    console.log('Canvas created successfully');
                    state.gl.setClearColor('#000000');
                    
                  }}
                >
                  <ErrorBoundary>
                    <Suspense fallback={
                      <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.5, 16, 16]} />
                        <meshStandardMaterial color="#4285F4" />
                      </mesh>
                    }>
                    <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={45} ref={cameraRef} />
                    
                    {/* Basic lighting */}
                    {/* Simplified lighting for better performance */}
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
                    
                    {/* 3D Model */}
                    <Pergola3DModel
                      ref={pergola3DRef}
                      dimensions={dimensions}
                      material={selectedMaterial}
                      materialColor={materialColor}
                      pillars={pillars}
                      rafters={rafters}
                      glass={glass}
                      pergolaPosition={pergolaPosition}
                      onRafterSelect={handleRafterSelect}
                    />
                    
                    {/* Environment */}
                    <Environment preset={environment} background={true} />
                    
                    {/* Controls */}
                    <OrbitControls 
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                    />
                  </Suspense>
                  </ErrorBoundary>
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
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[600px] bg-black/50 backdrop-blur-xl p-6 rounded-xl border border-white/10"
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
                
                {/* Customer Details Form */}
                <AnimatePresence>
                  {showCustomerForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[600px] bg-black/50 backdrop-blur-xl p-6 rounded-xl border border-white/10"
                    >
                      <PDFControlPanel
                        onExport={exportAsPDF}
                        onCancel={() => setShowCustomerForm(false)}
                        customerDetails={customerDetails}
                        setCustomerDetails={setCustomerDetails}
                        qualitySettings={qualitySettings}
                        setQualitySettings={setQualitySettings}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Export Dialog */}
                <AnimatePresence>
                  {exportDialogOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
                    >
                      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-white/10">
                        <h3 className="text-xl font-medium text-white mb-4">Export {exportType === 'pdf' ? 'PDF' : 'Image'}</h3>
                        <button 
                          className="absolute top-4 right-4 text-white/70 hover:text-white"
                          onClick={() => {
                            setExportDialogOpen(false);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        {/* Customer Details Form */}
                        <CustomerDetailsForm 
                          customerDetails={customerDetails}
                          setCustomerDetails={setCustomerDetails}
                        />
                        
                        {/* View Selection Panel - Only show for PDF export */}
                        {exportType === 'pdf' && (
                          <ViewSelectionPanel 
                            selectedViews={selectedViews}
                            setSelectedViews={setSelectedViews}
                            isExporting={isExporting}
                          />
                        )}
                        
                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            onClick={() => setExportDialogOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600 flex items-center justify-center min-w-[120px]"
                            onClick={exportType === 'pdf' ? exportAsPDF : exportAsImage}
                            disabled={isExporting}
                          >
                            {isExporting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <span>Export as {exportType === 'pdf' ? 'PDF' : 'Image'}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          {quickPreviewOpen && (
            <QuickPreviewMode 
              isOpen={quickPreviewOpen}
              onClose={() => setQuickPreviewOpen(false)}
              onApplyDesign={applyDesign}
              currentDesign={getCurrentDesign()}
            />
          )}
          
          {wishlistOpen && (
            <WishlistPanel 
              isOpen={wishlistOpen}
              onClose={() => setWishlistOpen(false)}
              onApplyDesign={applyDesign}
              currentDesign={getCurrentDesign()}
            />
          )}
          
          {voiceControlOpen && (
            <VoiceCommandControl 
              isOpen={voiceControlOpen}
              onClose={() => setVoiceControlOpen(false)}
              onCommandRecognized={handleVoiceCommand}
              onDimensionChange={handleDimensionsChange}
              onMaterialChange={handleMaterialChange}
              onEnvironmentChange={handleEnvironmentChange}
              onGlassChange={handleGlassChange}
              currentDesign={getCurrentDesign()}
            />
          )}
          
          {pdfExportOpen && (
            <PDFExport 
              isOpen={pdfExportOpen}
              onClose={() => setPdfExportOpen(false)}
              currentDesign={getCurrentDesign()}
              modelRef={modelContainerRef}
              captureScreenshot={captureScreenshot}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
