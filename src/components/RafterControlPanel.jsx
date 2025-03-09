import React, { useState } from 'react';
import { motion } from 'framer-motion';
import hybridAIService from '../services/HybridAIService';

const RafterControlPanel = ({ rafters, onRaftersChange }) => {
  const [selectedDirection, setSelectedDirection] = useState('frontToBack');
  const [selectedRafter, setSelectedRafter] = useState(null);
  
  // Apply changes with force update
  const applyChanges = (changes) => {
    onRaftersChange({
      ...changes,
      forceUpdate: true
    });
  };
  
  // Handle pattern change
  const handlePatternChange = (pattern) => {
    const updatedRafters = { ...rafters, pattern };
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_pattern_changed', { pattern });
  };
  
  // Handle count change
  const handleCountChange = (direction, value) => {
    const newCount = Math.max(2, Math.min(20, value));
    
    // Create a deep copy of the rafters object
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    
    // Create or adjust items array to match new count
    const currentItems = updatedRafters[direction].items || [];
    let newItems = [...currentItems];
    
    if (newCount > currentItems.length) {
      // Add new items
      const itemsToAdd = newCount - currentItems.length;
      const newItemsArray = Array(itemsToAdd).fill().map(() => ({ 
        visible: true, 
        curvature: 0,
        selected: false
      }));
      newItems = [...newItems, ...newItemsArray];
    } else if (newCount < currentItems.length) {
      // Remove items
      newItems = newItems.slice(0, newCount);
    }
    
    // Update the count and items
    updatedRafters[direction].count = newCount;
    updatedRafters[direction].items = newItems;
    
    // Reset selected rafter if it's now out of bounds
    if (selectedRafter !== null && selectedRafter >= newCount) {
      setSelectedRafter(null);
    }
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_count_changed', {
      direction,
      count: newCount
    });
  };
  
  // Toggle visibility for all rafters of a direction
  const toggleVisibility = (direction) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].visible = !updatedRafters[direction].visible;
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_visibility_changed', {
      direction,
      visible: updatedRafters[direction].visible
    });
  };
  
  // Toggle visibility for a specific rafter
  const toggleRafterVisibility = (direction, index) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].items[index].visible = !updatedRafters[direction].items[index].visible;
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('individual_rafter_visibility_changed', {
      direction,
      index,
      visible: updatedRafters[direction].items[index].visible
    });
  };
  
  // Handle individual rafter curvature change
  const handleIndividualCurvatureChange = (direction, index, value) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].items[index].curvature = parseFloat(value);
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('individual_rafter_curvature_changed', {
      direction,
      index,
      curvature: parseFloat(value)
    });
  };
  
  // Handle gap change
  const handleGapChange = (direction, value) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].gap = parseFloat(value);
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_gap_changed', {
      direction,
      gap: parseFloat(value)
    });
  };
  
  // Handle width change
  const handleWidthChange = (direction, value) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].width = parseFloat(value);
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_width_changed', {
      direction,
      width: parseFloat(value)
    });
  };
  
  // Handle height change
  const handleHeightChange = (direction, value) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].height = parseFloat(value);
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_height_changed', {
      direction,
      height: parseFloat(value)
    });
  };
  
  // Handle shape change
  const handleShapeChange = (direction, shape) => {
    const updatedRafters = JSON.parse(JSON.stringify(rafters));
    updatedRafters[direction].shape = shape;
    
    applyChanges(updatedRafters);
    
    hybridAIService.trackInteraction('rafter_shape_changed', {
      direction,
      shape
    });
  };
  
  // Select a rafter for editing
  const selectRafter = (index) => {
    setSelectedRafter(index === selectedRafter ? null : index);
  };
  
  // Get the label for the direction
  const getDirectionLabel = (direction) => {
    return direction === 'frontToBack' ? 'Front-to-Back' : 'Side-to-Side';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="premium-card"
    >
      <div className="panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20M2 12v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M2 12v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
        </svg>
        <h2>Rafter Customization</h2>
      </div>
      
      {/* Pattern Selection */}
      <div className="mb-5">
        <label className="premium-label">Pattern</label>
        <div className="flex space-x-2 mt-1.5">
          <button
            className={`premium-button ${rafters.pattern === 'parallel' ? 'active' : ''}`}
            onClick={() => handlePatternChange('parallel')}
          >
            Parallel
          </button>
          <button
            className={`premium-button ${rafters.pattern === 'crosshatch' ? 'active' : ''}`}
            onClick={() => handlePatternChange('crosshatch')}
          >
            Crosshatch
          </button>
        </div>
      </div>
      
      {/* Direction Tabs */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            className={`premium-tab ${selectedDirection === 'frontToBack' ? 'active' : ''}`}
            onClick={() => {
              setSelectedDirection('frontToBack');
              setSelectedRafter(null);
            }}
          >
            Front-to-Back
          </button>
          <button
            className={`premium-tab ${selectedDirection === 'leftToRight' ? 'active' : ''}`}
            onClick={() => {
              setSelectedDirection('leftToRight');
              setSelectedRafter(null);
            }}
          >
            Side-to-Side
          </button>
        </div>
      </div>
      
      {/* Global Direction Controls */}
      <div className="mb-4 p-3 bg-black/30 rounded-lg border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <label className="premium-label m-0">
            All {getDirectionLabel(selectedDirection)} Rafters
          </label>
          <button
            className={`premium-toggle ${rafters[selectedDirection].visible ? 'active' : ''}`}
            onClick={() => toggleVisibility(selectedDirection)}
          >
            {rafters[selectedDirection].visible ? 'Visible' : 'Hidden'}
          </button>
        </div>
        
        {/* Count Control */}
        <div className="mb-4">
          <div className="flex justify-between">
            <label className="premium-label">Count</label>
            <span className="text-sm text-white/90">{rafters[selectedDirection].count}</span>
          </div>
          <div className="premium-number-input w-full">
            <button
              onClick={() => handleCountChange(selectedDirection, rafters[selectedDirection].count - 1)}
              className="premium-number-button"
            >
              −
            </button>
            <input
              type="number"
              value={rafters[selectedDirection].count}
              onChange={(e) => handleCountChange(selectedDirection, parseInt(e.target.value) || 0)}
              min="2"
              max="20"
              className="premium-number-field"
            />
            <button
              onClick={() => handleCountChange(selectedDirection, rafters[selectedDirection].count + 1)}
              className="premium-number-button"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Gap Control */}
        <div className="mb-4">
          <div className="flex justify-between">
            <label className="premium-label">Gap</label>
            <span className="text-sm text-white/90">{rafters[selectedDirection].gap.toFixed(2)}m</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.01"
            value={rafters[selectedDirection].gap}
            onChange={(e) => handleGapChange(selectedDirection, e.target.value)}
            className="premium-slider"
          />
        </div>
        
        {/* Size Controls */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="flex justify-between">
              <label className="premium-label">Width</label>
              <span className="text-sm text-white/90">{rafters[selectedDirection].width.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.01"
              value={rafters[selectedDirection].width}
              onChange={(e) => handleWidthChange(selectedDirection, e.target.value)}
              className="premium-slider"
            />
          </div>
          <div>
            <div className="flex justify-between">
              <label className="premium-label">Height</label>
              <span className="text-sm text-white/90">{rafters[selectedDirection].height.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.01"
              value={rafters[selectedDirection].height}
              onChange={(e) => handleHeightChange(selectedDirection, e.target.value)}
              className="premium-slider"
            />
          </div>
        </div>
        
        {/* Shape Selection */}
        <div>
          <label className="premium-label">Shape</label>
          <div className="flex space-x-2 mt-1.5">
            <button
              className={`premium-button ${rafters[selectedDirection].shape === 'square' ? 'active' : ''}`}
              onClick={() => handleShapeChange(selectedDirection, 'square')}
            >
              Square
            </button>
            <button
              className={`premium-button ${rafters[selectedDirection].shape === 'round' ? 'active' : ''}`}
              onClick={() => handleShapeChange(selectedDirection, 'round')}
            >
              Round
            </button>
          </div>
        </div>
      </div>
      
      {/* Individual Rafter Selection */}
      <div className="mb-4">
        <label className="premium-label">Select Individual Rafter</label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {rafters[selectedDirection].items.map((item, index) => (
            <button
              key={index}
              className={`premium-rafter-button ${selectedRafter === index ? 'active' : ''} ${!item.visible ? 'invisible' : ''}`}
              onClick={() => selectRafter(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/70 mb-4">
          Click on a rafter number to select it for individual customization
        </p>
      </div>
      
      {/* Individual Rafter Controls */}
      {selectedRafter !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 p-3 bg-black/30 rounded-lg border border-white/10"
        >
          <div className="flex justify-between items-center mb-3">
            <label className="premium-label m-0">
              Rafter {selectedRafter + 1} Controls
            </label>
            <button
              className={`premium-toggle ${rafters[selectedDirection].items[selectedRafter].visible ? 'active' : ''}`}
              onClick={() => toggleRafterVisibility(selectedDirection, selectedRafter)}
            >
              {rafters[selectedDirection].items[selectedRafter].visible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          
          <div className="mb-1">
            <div className="flex justify-between">
              <label className="premium-label">Curvature</label>
              <span className="text-sm text-white/90">
                {rafters[selectedDirection].items[selectedRafter].curvature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.01"
              value={rafters[selectedDirection].items[selectedRafter].curvature}
              onChange={(e) => handleIndividualCurvatureChange(selectedDirection, selectedRafter, e.target.value)}
              className="premium-slider"
            />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>Concave</span>
              <span>Flat</span>
              <span>Convex</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Instructions */}
      {selectedRafter === null && (
        <div className="text-center p-3 bg-black/30 rounded-lg border border-white/10">
          <p className="text-sm text-white/80">
            Select a rafter number above to customize individual rafters
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RafterControlPanel;
