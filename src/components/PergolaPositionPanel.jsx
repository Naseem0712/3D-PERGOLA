import React from 'react';
import { motion } from 'framer-motion';
import hybridAIService from '../services/HybridAIService';

const PergolaPositionPanel = ({ pergolaPosition, onPositionChange }) => {
  // Handle position change
  const handlePositionChange = (axis, value) => {
    const newPosition = {
      ...pergolaPosition,
      [axis]: pergolaPosition?.[axis] + value || value
    };
    
    onPositionChange(newPosition);
    
    hybridAIService.recordInteraction('pergola_position_changed', {
      axis,
      value,
      newPosition
    });
  };
  
  // Reset position to default
  const resetPosition = () => {
    onPositionChange({ x: 0, y: 0, z: 0 });
  };
  
  return (
    <motion.div
      className="premium-control-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="premium-panel-header">
        <h3 className="text-lg font-medium">Pergola Position</h3>
      </div>
      
      <div className="premium-panel-content">
        <div className="text-sm font-medium mb-4">Adjust Pergola Position</div>
        
        <div className="flex flex-col space-y-4 mb-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">X Position (Left/Right)</span>
              <span className="text-xs">{(pergolaPosition?.x || 0).toFixed(2)} m</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="premium-rafter-button"
                onClick={() => handlePositionChange('x', -0.1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.01"
                value={pergolaPosition?.x || 0}
                onChange={(e) => {
                  const newPosition = {
                    ...pergolaPosition,
                    x: parseFloat(e.target.value)
                  };
                  onPositionChange(newPosition);
                }}
                className="premium-slider flex-grow"
              />
              <button 
                className="premium-rafter-button"
                onClick={() => handlePositionChange('x', 0.1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l7 7 7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Y Position (Up/Down)</span>
              <span className="text-xs">{(pergolaPosition?.y || 0).toFixed(2)} m</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="premium-rafter-button"
                onClick={() => handlePositionChange('y', -0.1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.01"
                value={pergolaPosition?.y || 0}
                onChange={(e) => {
                  const newPosition = {
                    ...pergolaPosition,
                    y: parseFloat(e.target.value)
                  };
                  onPositionChange(newPosition);
                }}
                className="premium-slider flex-grow"
              />
              <button 
                className="premium-rafter-button"
                onClick={() => handlePositionChange('y', 0.1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l7 7 7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Z Position (Front/Back)</span>
              <span className="text-xs">{(pergolaPosition?.z || 0).toFixed(2)} m</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="premium-rafter-button"
                onClick={() => handlePositionChange('z', -0.1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.01"
                value={pergolaPosition?.z || 0}
                onChange={(e) => {
                  const newPosition = {
                    ...pergolaPosition,
                    z: parseFloat(e.target.value)
                  };
                  onPositionChange(newPosition);
                }}
                className="premium-slider flex-grow"
              />
              <button 
                className="premium-rafter-button"
                onClick={() => handlePositionChange('z', 0.1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l7 7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <button 
          className="premium-rafter-button w-full"
          onClick={resetPosition}
        >
          Reset Position
        </button>
      </div>
    </motion.div>
  );
};

export default PergolaPositionPanel;
