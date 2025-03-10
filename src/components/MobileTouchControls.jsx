import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, ViewfinderCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';

/**
 * MobileTouchControls component provides touch-friendly controls for mobile devices
 * It includes gesture hints, touch controls, and panel toggles
 */
const MobileTouchControls = ({ 
  availablePanels = [], 
  activePanel = '', 
  onPanelChange = () => {}, 
  onTogglePanelVisibility = () => {},
  onResetView = () => {}
}) => {
  const [showControls, setShowControls] = useState(false);
  const [showGestureHints, setShowGestureHints] = useState(true);
  const [showPanelButtons, setShowPanelButtons] = useState(false);
  
  // Hide gesture hints after 5 seconds
  useEffect(() => {
    if (showGestureHints) {
      const timer = setTimeout(() => {
        setShowGestureHints(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showGestureHints]);
  
  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
    setShowPanelButtons(false);
  };
  
  // Toggle panel buttons visibility
  const togglePanelButtons = () => {
    setShowPanelButtons(!showPanelButtons);
  };
  
  // Handle panel selection
  const handlePanelSelect = (panelId) => {
    onPanelChange(panelId);
    onTogglePanelVisibility();
    setShowPanelButtons(false);
  };
  
  return (
    <div className="mobile-touch-controls">
      {/* Gesture Hints Overlay - Shown briefly on load */}
      <AnimatePresence>
        {showGestureHints && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center text-white p-6"
          >
            <h3 className="text-xl font-semibold mb-6">Touch Controls</h3>
            
            <div className="grid grid-cols-1 gap-6 max-w-xs">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center mr-4">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 22v-8m0 0V6m0 8h8m-8 0H4" />
                    </svg>
                  </motion.div>
                </div>
                <p>Drag with one finger to rotate model</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center mr-4">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.5, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </motion.div>
                </div>
                <p>Pinch to zoom in and out</p>
              </div>
              
              <button 
                className="mt-6 px-6 py-3 bg-white text-black rounded-lg font-medium"
                onClick={() => setShowGestureHints(false)}
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Controls Button */}
      <button 
        onClick={toggleControls}
        className="mobile-touch-button"
        aria-label="Toggle controls"
      >
        {showControls ? (
          <ArrowsPointingInIcon className="h-6 w-6" />
        ) : (
          <ArrowsPointingOutIcon className="h-6 w-6" />
        )}
      </button>
      
      {/* Controls Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-16 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-xl z-40"
            style={{ width: 'auto', maxWidth: '90%' }}
          >
            <div className="flex flex-col space-y-3">
              {/* Reset View Button */}
              <button
                onClick={onResetView}
                className="mobile-control-button flex items-center space-x-2 px-3 py-2 bg-gray-800/80 rounded-lg text-white text-sm"
              >
                <ViewfinderCircleIcon className="h-5 w-5" />
                <span>Reset View</span>
              </button>
              
              {/* Panel Toggle Button */}
              <button
                onClick={togglePanelButtons}
                className="mobile-control-button flex items-center space-x-2 px-3 py-2 bg-gray-800/80 rounded-lg text-white text-sm"
              >
                <Bars3Icon className="h-5 w-5" />
                <span>Change Panel</span>
              </button>
              
              {/* Panel Selection Buttons */}
              <AnimatePresence>
                {showPanelButtons && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col space-y-2 pt-2 border-t border-white/10"
                  >
                    {availablePanels.map((panel) => (
                      <button
                        key={panel.id}
                        onClick={() => handlePanelSelect(panel.id)}
                        className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                          activePanel === panel.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800/60 text-white/80 hover:bg-gray-700/60'
                        }`}
                      >
                        {panel.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileTouchControls;
