import React, { useEffect, useState } from 'react';

/**
 * PerformanceOptimizer component
 * Handles performance optimization for 3D models including:
 * - Level of Detail (LOD) system
 * - Lazy loading for large models
 * - Frame rate monitoring and quality adjustments
 */
const PerformanceOptimizer = ({ 
  children, 
  onQualityChange,
  initialQuality = 'high' // 'low', 'medium', 'high', 'ultra'
}) => {
  const [devicePerformance, setDevicePerformance] = useState('unknown'); // 'low', 'medium', 'high'
  const [currentQuality, setCurrentQuality] = useState(initialQuality);
  const [fps, setFps] = useState(60);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect device capabilities on mount
  useEffect(() => {
    detectDevicePerformance();
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Monitor performance and adjust quality settings
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId;
    
    const measureFrameRate = () => {
      frameCount++;
      const now = performance.now();
      
      // Update FPS every second
      if (now - lastTime >= 1000) {
        const currentFps = Math.round(frameCount * 1000 / (now - lastTime));
        setFps(currentFps);
        
        // Auto-adjust quality based on frame rate
        if (currentFps < 20 && currentQuality !== 'low') {
          adjustQuality('low');
        } else if (currentFps < 40 && currentQuality === 'high') {
          adjustQuality('medium');
        } else if (currentFps > 55 && currentQuality === 'low' && devicePerformance !== 'low') {
          adjustQuality('medium');
        }
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameId = requestAnimationFrame(measureFrameRate);
    };
    
    frameId = requestAnimationFrame(measureFrameRate);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [currentQuality, devicePerformance]);
  
  // Detect device performance capabilities
  const detectDevicePerformance = () => {
    // Check for GPU info if available
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setDevicePerformance('low');
      adjustQuality('low');
      return;
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    let gpu = 'unknown';
    
    if (debugInfo) {
      gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
    
    // Simple heuristic based on GPU name and device memory
    const isHighEnd = /RTX|Radeon Pro|Quadro/i.test(gpu);
    const isMidRange = /GTX|Radeon RX|Intel Iris/i.test(gpu);
    const isLowEnd = /Intel HD|Intel UHD|Mali|Adreno/i.test(gpu);
    
    // Check device memory if available
    let deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if not available
    
    if (isHighEnd || deviceMemory >= 8) {
      setDevicePerformance('high');
      adjustQuality('high');
    } else if (isMidRange || deviceMemory >= 4) {
      setDevicePerformance('medium');
      adjustQuality('medium');
    } else if (isLowEnd || deviceMemory < 4) {
      setDevicePerformance('low');
      adjustQuality('low');
    } else {
      // Default to medium for unknown devices
      setDevicePerformance('medium');
      adjustQuality('medium');
    }
  };
  
  // Check if device is mobile
  const checkMobile = () => {
    const mobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    // Automatically lower quality on mobile
    if (mobile && currentQuality === 'high') {
      adjustQuality('medium');
    }
  };
  
  // Adjust quality settings
  const adjustQuality = (quality) => {
    if (quality === currentQuality) return;
    
    setCurrentQuality(quality);
    
    // Call the parent callback with new quality settings
    if (onQualityChange) {
      const qualitySettings = getQualitySettings(quality);
      onQualityChange(quality, qualitySettings);
    }
    
    console.log(`Performance optimizer: Quality adjusted to ${quality}`);
  };
  
  // Get specific quality settings based on level
  const getQualitySettings = (quality) => {
    switch (quality) {
      case 'low':
        return {
          shadows: false,
          antialiasing: false,
          textureSize: 512,
          maxLights: 2,
          reflections: false,
          lodBias: 2, // Higher LOD bias means lower detail
          drawDistance: 100
        };
      case 'medium':
        return {
          shadows: true,
          shadowResolution: 512,
          antialiasing: true,
          textureSize: 1024,
          maxLights: 4,
          reflections: false,
          lodBias: 1,
          drawDistance: 200
        };
      case 'high':
        return {
          shadows: true,
          shadowResolution: 1024,
          antialiasing: true,
          textureSize: 2048,
          maxLights: 8,
          reflections: true,
          reflectionResolution: 512,
          lodBias: 0,
          drawDistance: 500
        };
      case 'ultra':
        return {
          shadows: true,
          shadowResolution: 2048,
          antialiasing: true,
          textureSize: 4096,
          maxLights: 16,
          reflections: true,
          reflectionResolution: 1024,
          lodBias: 0,
          drawDistance: 1000
        };
      default:
        return getQualitySettings('medium');
    }
  };
  
  // Render performance stats if in development mode
  const renderStats = process.env.NODE_ENV === 'development' && (
    <div className="fixed bottom-0 left-0 bg-black/50 text-white text-xs p-2 z-50">
      FPS: {fps} | Quality: {currentQuality} | Device: {devicePerformance} | Mobile: {isMobile ? 'Yes' : 'No'}
    </div>
  );
  
  return (
    <>
      {renderStats}
      {/* Pass the current quality settings to children */}
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { 
              qualityLevel: currentQuality,
              qualitySettings: getQualitySettings(currentQuality),
              isMobile
            })
          : child
      )}
    </>
  );
};

export default PerformanceOptimizer;
