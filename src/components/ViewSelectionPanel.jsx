import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ViewSelectionPanel({ selectedViews, onViewSelectionChange, rafters, pillars, dimensions }) {
  const [qualitySettings, setQualitySettings] = useState({
    resolution: 'high', // high, medium, low
    includeDetails: true,
    includeMeasurements: true,
    includeWatermark: true
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const panelRef = useRef(null);
  const captureTimeoutRef = useRef(null);

  const handleViewSelection = (view) => {
    // Update the selected views
    const updatedViews = {
      ...selectedViews,
      [view]: !selectedViews[view]
    };
    
    // Pass the updated views to the parent component
    onViewSelectionChange(updatedViews);
    
    // Force recapture of preview image after a short delay
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
    }
    
    captureTimeoutRef.current = setTimeout(() => {
      capturePreviewImage();
    }, 300);
  };

  const handleQualityChange = (setting, value) => {
    setQualitySettings({
      ...qualitySettings,
      [setting]: value
    });
  };
  
  // Expose quality settings and pergola details to parent component via DOM
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.qualitySettings = qualitySettings;
      panelRef.current.selectedViews = selectedViews;
      panelRef.current.pergolaDetails = {
        rafters,
        pillars,
        dimensions
      };
    }
  }, [qualitySettings, selectedViews, rafters, pillars, dimensions]);
  
  // Function to capture preview image
  const capturePreviewImage = () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    try {
      const canvasElement = document.querySelector('canvas');
      if (canvasElement) {
        // Capture at a reasonable quality but not too high to avoid performance issues
        const imgData = canvasElement.toDataURL('image/jpeg', 0.7);
        setPreviewImage(imgData);
      }
    } catch (error) {
      console.error('Error capturing preview image:', error);
    } finally {
      setIsCapturing(false);
    }
  };
  
  // Capture preview image when component mounts or views change
  useEffect(() => {
    // Clear any existing timeout
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
    }
    
    // Wait a moment to ensure the canvas is rendered
    captureTimeoutRef.current = setTimeout(() => {
      capturePreviewImage();
    }, 500);
    
    return () => {
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, [selectedViews]);
  
  // Recapture preview when quality settings change
  useEffect(() => {
    // Wait a short moment to ensure any UI updates are complete
    const timer = setTimeout(() => {
      capturePreviewImage();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [qualitySettings]);

  // Calculate how many views are selected
  const selectedViewCount = Object.values(selectedViews).filter(Boolean).length;

  return (
    <div ref={panelRef} data-component-name="ViewSelectionPanel">
      <div className="mb-6">
        <h4 className="text-md font-medium text-white/90 mb-2">
          पर्गोला गुणवत्ता सेटिंग्स (Quality Settings)
        </h4>
        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-2">
              रिज़ॉल्यूशन (Resolution)
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleQualityChange('resolution', 'low')}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  qualitySettings.resolution === 'low' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                कम (Low)
              </button>
              <button
                onClick={() => handleQualityChange('resolution', 'medium')}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  qualitySettings.resolution === 'medium' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                मध्यम (Medium)
              </button>
              <button
                onClick={() => handleQualityChange('resolution', 'high')}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  qualitySettings.resolution === 'high' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                उच्च (High)
              </button>
              <button
                onClick={() => handleQualityChange('resolution', 'ultra')}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  qualitySettings.resolution === 'ultra' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                अल्ट्रा (Ultra)
              </button>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <input
                id="include-details"
                type="checkbox"
                checked={qualitySettings.includeDetails}
                onChange={() => handleQualityChange('includeDetails', !qualitySettings.includeDetails)}
                className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="include-details" className="ml-2 block text-sm text-white/70">
                विस्तृत विनिर्देश शामिल करें (Include Detailed Specifications)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="include-measurements"
                type="checkbox"
                checked={qualitySettings.includeMeasurements}
                onChange={() => handleQualityChange('includeMeasurements', !qualitySettings.includeMeasurements)}
                className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="include-measurements" className="ml-2 block text-sm text-white/70">
                माप और आयाम शामिल करें (Include Measurements & Dimensions)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="include-watermark"
                type="checkbox"
                checked={qualitySettings.includeWatermark}
                onChange={() => handleQualityChange('includeWatermark', !qualitySettings.includeWatermark)}
                className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="include-watermark" className="ml-2 block text-sm text-white/70">
                वॉटरमार्क शामिल करें (Include Watermark)
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <label className="block text-md font-medium text-white/90 mb-2">
        पर्गोला दृश्य चुनें (Select Pergola Views)
      </label>
      <p className="text-sm text-white/60 mb-3">
        {selectedViewCount === 0 
          ? 'कृपया कम से कम एक दृश्य चुनें (Please select at least one view)' 
          : `${selectedViewCount} दृश्य चुने गए (${selectedViewCount} views selected)`}
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <div 
          className={`flex items-center p-3 ${selectedViews.frontView ? 'bg-blue-600/30' : 'bg-white/5'} rounded-lg hover:bg-white/10 transition-colors cursor-pointer border ${selectedViews.frontView ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleViewSelection('frontView')}
        >
          <input
            id="front-view"
            type="checkbox"
            checked={selectedViews.frontView}
            onChange={() => handleViewSelection('frontView')}
            className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="front-view" className="ml-2 block text-sm text-white/70 cursor-pointer">
            सामने का दृश्य (Front View)
          </label>
          <div className="ml-auto w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        </div>
        
        <div 
          className={`flex items-center p-3 ${selectedViews.sideView ? 'bg-blue-600/30' : 'bg-white/5'} rounded-lg hover:bg-white/10 transition-colors cursor-pointer border ${selectedViews.sideView ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleViewSelection('sideView')}
        >
          <input
            id="side-view"
            type="checkbox"
            checked={selectedViews.sideView}
            onChange={() => handleViewSelection('sideView')}
            className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="side-view" className="ml-2 block text-sm text-white/70 cursor-pointer">
            साइड व्यू (Side View)
          </label>
          <div className="ml-auto w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
        
        <div 
          className={`flex items-center p-3 ${selectedViews.topView ? 'bg-blue-600/30' : 'bg-white/5'} rounded-lg hover:bg-white/10 transition-colors cursor-pointer border ${selectedViews.topView ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleViewSelection('topView')}
        >
          <input
            id="top-view"
            type="checkbox"
            checked={selectedViews.topView}
            onChange={() => handleViewSelection('topView')}
            className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="top-view" className="ml-2 block text-sm text-white/70 cursor-pointer">
            ऊपर का दृश्य (Top View)
          </label>
          <div className="ml-auto w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
        
        <div 
          className={`flex items-center p-3 ${selectedViews.perspectiveView ? 'bg-blue-600/30' : 'bg-white/5'} rounded-lg hover:bg-white/10 transition-colors cursor-pointer border ${selectedViews.perspectiveView ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleViewSelection('perspectiveView')}
        >
          <input
            id="perspective-view"
            type="checkbox"
            checked={selectedViews.perspectiveView}
            onChange={() => handleViewSelection('perspectiveView')}
            className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="perspective-view" className="ml-2 block text-sm text-white/70 cursor-pointer">
            परिप्रेक्ष्य दृश्य (Perspective)
          </label>
          <div className="ml-auto w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div 
          className={`flex items-center p-3 ${selectedViews.customAngleView ? 'bg-blue-600/30' : 'bg-white/5'} rounded-lg hover:bg-white/10 transition-colors cursor-pointer border ${selectedViews.customAngleView ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleViewSelection('customAngleView')}
        >
          <input
            id="custom-angle-view"
            type="checkbox"
            checked={selectedViews.customAngleView}
            onChange={() => handleViewSelection('customAngleView')}
            className="h-4 w-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="custom-angle-view" className="ml-2 block text-sm text-white/70 cursor-pointer">
            कस्टम एंगल (Custom Angle)
          </label>
          <div className="ml-auto w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="text-sm font-medium text-white/70 mb-2">
          पीडीएफ प्रीव्यू (PDF Preview)
        </h4>
        <div className="bg-white/10 p-3 rounded border border-white/20 flex items-center justify-center">
          {previewImage ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full max-w-xs aspect-[4/3] overflow-hidden rounded-md mb-2">
                <img 
                  src={previewImage} 
                  alt="Pergola Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
              </div>
              <p className="text-white/50 text-sm">
                {selectedViewCount === 0 
                  ? 'कृपया कम से कम एक दृश्य चुनें (Please select at least one view)'
                  : `${selectedViewCount} दृश्य के साथ PDF (PDF with ${selectedViewCount} views)`}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {qualitySettings.resolution === 'ultra' 
                  ? 'अल्ट्रा हाई क्वालिटी (Ultra High Quality)'
                  : qualitySettings.resolution === 'high'
                    ? 'उच्च गुणवत्ता (High Quality)'
                    : qualitySettings.resolution === 'medium'
                      ? 'मध्यम गुणवत्ता (Medium Quality)'
                      : 'कम गुणवत्ता (Low Quality)'}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-white/30 mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/50 text-sm">
                प्रीव्यू लोड हो रहा है... (Loading preview...)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
