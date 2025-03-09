import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

/**
 * QuickPreviewMode Component
 * Provides a quick preview carousel of preset pergola designs
 * with the ability to apply them instantly
 */
const QuickPreviewMode = ({ 
  isOpen, 
  onClose, 
  onApplyDesign, 
  currentDesign,
  previewPositions = [
    { name: "Front View", position: [0, 2.5, 8], target: [0, 1.25, 0] },
    { name: "Side View", position: [8, 2.5, 0], target: [0, 1.25, 0] },
    { name: "Top View", position: [0, 8, 0], target: [0, 0, 0] },
    { name: "Perspective", position: [6, 4, 6], target: [0, 1, 0] }
  ]
}) => {
  // Preset designs
  const presetDesigns = [
    {
      name: "Modern Minimalist",
      description: "Clean lines and minimalist aesthetic with aluminum frame",
      dimensions: { length: 4, width: 3, height: 2.5 },
      material: "aluminium",
      materialColor: "#a8a8a8",
      pillars: { count: 4, size: { width: 0.1, depth: 0.1 } },
      rafters: {
        pattern: "crosshatch",
        frontToBack: { count: 6, width: 0.05, height: 0.1 },
        leftToRight: { count: 6, width: 0.05, height: 0.1 }
      },
      glass: {
        visible: true,
        applied: true,
        color: "#a9c2d9",
        opacity: 0.6,
        sides: { top: true, front: false, back: false, left: false, right: false }
      }
    },
    {
      name: "Classic Wooden",
      description: "Traditional wooden pergola with warm tones",
      dimensions: { length: 4.5, width: 3.5, height: 2.7 },
      material: "wood",
      materialColor: "#8B4513",
      pillars: { count: 4, size: { width: 0.15, depth: 0.15 } },
      rafters: {
        pattern: "parallel",
        frontToBack: { count: 8, width: 0.08, height: 0.12 },
        leftToRight: { count: 0, width: 0.08, height: 0.12 }
      },
      glass: {
        visible: false,
        applied: false,
        color: "#a9c2d9",
        opacity: 0.6,
        sides: { top: false, front: false, back: false, left: false, right: false }
      }
    },
    {
      name: "Luxury Glass",
      description: "Premium design with extensive glass features",
      dimensions: { length: 5, width: 4, height: 3 },
      material: "aluminium",
      materialColor: "#2c3e50",
      pillars: { count: 4, size: { width: 0.12, depth: 0.12 } },
      rafters: {
        pattern: "crosshatch",
        frontToBack: { count: 7, width: 0.06, height: 0.1 },
        leftToRight: { count: 7, width: 0.06, height: 0.1 }
      },
      glass: {
        visible: true,
        applied: true,
        color: "#a9c2d9",
        opacity: 0.7,
        sides: { top: true, front: true, back: true, left: true, right: true }
      }
    },
    {
      name: "Compact Urban",
      description: "Space-efficient design for urban settings",
      dimensions: { length: 3, width: 2.5, height: 2.3 },
      material: "aluminium",
      materialColor: "#34495e",
      pillars: { count: 4, size: { width: 0.08, depth: 0.08 } },
      rafters: {
        pattern: "crosshatch",
        frontToBack: { count: 5, width: 0.04, height: 0.08 },
        leftToRight: { count: 5, width: 0.04, height: 0.08 }
      },
      glass: {
        visible: true,
        applied: true,
        color: "#a9c2d9",
        opacity: 0.5,
        sides: { top: true, front: false, back: false, left: false, right: false }
      }
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? presetDesigns.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === presetDesigns.length - 1 ? 0 : prev + 1));
  };

  const handleApply = () => {
    onApplyDesign(presetDesigns[currentIndex]);
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl ${
          isFullscreen ? 'fixed inset-0 rounded-none' : 'max-w-4xl w-full mx-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-medium text-white">Quick Preview</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
            {/* Design preview with gradient background instead of image */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  ${presetDesigns[currentIndex].name === "Modern Minimalist" ? "#3b82f6, #1e40af" : 
                  presetDesigns[currentIndex].name === "Classic Wooden" ? "#92400e, #713f12" :
                  presetDesigns[currentIndex].name === "Luxury Glass" ? "#0ea5e9, #0c4a6e" :
                  presetDesigns[currentIndex].name === "Compact Urban" ? "#4b5563, #1f2937" :
                  "#6366f1, #4338ca"})`
              }}
            >
              <div className="text-center p-6 bg-black/30 backdrop-blur-sm rounded-lg max-w-md">
                <h3 className="text-2xl font-bold text-white mb-2">{presetDesigns[currentIndex].name}</h3>
                <p className="text-gray-100">{presetDesigns[currentIndex].description}</p>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-lg font-medium text-white mb-3">Dimensions</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Length:</span>
                  <span>{presetDesigns[currentIndex].dimensions.length}m</span>
                </li>
                <li className="flex justify-between">
                  <span>Width:</span>
                  <span>{presetDesigns[currentIndex].dimensions.width}m</span>
                </li>
                <li className="flex justify-between">
                  <span>Height:</span>
                  <span>{presetDesigns[currentIndex].dimensions.height}m</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-lg font-medium text-white mb-3">Materials</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize">{presetDesigns[currentIndex].material}</span>
                </li>
                <li className="flex justify-between">
                  <span>Color:</span>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: presetDesigns[currentIndex].materialColor }}
                    ></div>
                    <span>{presetDesigns[currentIndex].materialColor}</span>
                  </div>
                </li>
                <li className="flex justify-between">
                  <span>Glass:</span>
                  <span>{presetDesigns[currentIndex].glass.visible ? 'Yes' : 'No'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Apply This Design
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickPreviewMode;
