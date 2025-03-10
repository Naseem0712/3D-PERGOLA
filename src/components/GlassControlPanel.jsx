import React, { useState } from 'react';
import { motion } from 'framer-motion';
import hybridAIService from '../services/HybridAIService';

const GlassControlPanel = ({ glass, onGlassChange }) => {
  // Local state for tracking which panel is open
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'sides', 'position'
  
  // Glass color options
  const glassColors = [
    { name: 'Crystal Blue', value: '#a9c2d9' },
    { name: 'Emerald Tint', value: '#88b999' },
    { name: 'Smoky Quartz', value: '#6b5b5b' }
  ];
  
  // Helper function to apply changes
  const applyChanges = (updatedGlass) => {
    onGlassChange(updatedGlass);
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    const updatedGlass = { ...glass, color: color.value };
    applyChanges(updatedGlass);
    
    hybridAIService.trackInteraction('glass_color_changed', {
      color: color.name,
      colorValue: color.value
    });
  };
  
  // Handle thickness change
  const handleThicknessChange = (e) => {
    const thickness = parseFloat(e.target.value);
    const updatedGlass = { ...glass, thickness };
    applyChanges(updatedGlass);
  };
  
  // Handle extension change
  const handleExtensionChange = (e) => {
    const extension = parseFloat(e.target.value);
    const updatedGlass = { ...glass, extension };
    applyChanges(updatedGlass);
  };
  
  // Handle visibility toggle
  const handleVisibilityToggle = () => {
    const updatedGlass = { ...glass, visible: !glass.visible };
    applyChanges(updatedGlass);
  };
  
  // Apply glass to pergola
  const applyGlass = () => {
    const updatedGlass = { 
      ...glass, 
      applied: true,
      visible: true,
      // Ensure proper initial values
      thickness: glass.thickness || 0.8,
      extension: glass.extension || 0.1,
      color: glass.color || '#a9c2d9',
      opacity: glass.opacity || 0.6
    };
    applyChanges(updatedGlass);
    
    hybridAIService.trackInteraction('glass_applied', {
      color: updatedGlass.color,
      thickness: updatedGlass.thickness,
      extension: updatedGlass.extension
    });
  };
  
  // Remove glass from pergola
  const removeGlass = () => {
    const updatedGlass = { ...glass, applied: false, visible: false };
    applyChanges(updatedGlass);
    
    hybridAIService.trackInteraction('glass_removed', {});
  };
  
  // Toggle side panel visibility
  const toggleSideVisibility = (side) => {
    const updatedSides = { 
      ...glass.sides,
      [side]: !glass.sides?.[side] 
    };
    
    const updatedGlass = { 
      ...glass, 
      sides: updatedSides
    };
    
    applyChanges(updatedGlass);
    
    hybridAIService.trackInteraction('glass_side_toggled', {
      side,
      visible: !glass.sides?.[side]
    });
  };
  
  // Handle position change
  const handlePositionChange = (axis, value) => {
    const newPosition = {
      ...glass.position,
      [axis]: (glass.position?.[axis] || 0) + value
    };
    
    const updatedGlass = {
      ...glass,
      position: newPosition
    };
    
    applyChanges(updatedGlass);
    
    hybridAIService.trackInteraction('glass_position_changed', {
      axis,
      value,
      newPosition
    });
  };
  
  // Set position directly
  const setPositionDirectly = (axis, value) => {
    const newPosition = {
      ...glass.position,
      [axis]: parseFloat(value)
    };
    
    const updatedGlass = {
      ...glass,
      position: newPosition
    };
    
    applyChanges(updatedGlass);
  };
  
  // Reset position to default
  const resetPosition = () => {
    const updatedGlass = {
      ...glass,
      position: { x: 0, y: 0, z: 0 }
    };
    
    applyChanges(updatedGlass);
  };
  
  // Reset all glass settings to default
  const resetAllGlassSettings = () => {
    const defaultGlass = {
      visible: false,
      applied: false,
      color: '#a9c2d9', // Crystal Blue
      opacity: 0.6,
      thickness: 0.8,
      extension: 0.1,
      position: { x: 0, y: 0, z: 0 },
      sides: {
        top: true,
        bottom: false,
        front: false,
        back: false,
        left: false,
        right: false
      }
    };
    
    applyChanges(defaultGlass);
    hybridAIService.trackInteraction('glass_reset_all', {});
  };
  
  // Show only top panel
  const showOnlyTopPanel = () => {
    const updatedGlass = {
      ...glass,
      sides: {
        top: true,
        bottom: false,
        front: false,
        back: false,
        left: false,
        right: false
      }
    };
    
    applyChanges(updatedGlass);
    hybridAIService.trackInteraction('glass_show_only_top', {});
  };
  
  // Show all sides
  const showAllSides = () => {
    const updatedGlass = {
      ...glass,
      sides: {
        top: true,
        bottom: true,
        front: true,
        back: true,
        left: true,
        right: true
      }
    };
    
    applyChanges(updatedGlass);
    hybridAIService.trackInteraction('glass_show_all_sides', {});
  };
  
  const tabs = [
    { id: 'main', label: 'Main' },
    { id: 'sides', label: 'Sides' },
    { id: 'position', label: 'Position' }
  ];
  
  return (
    <motion.div 
      className="premium-control-panel glass-control-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="premium-panel-header">
        <h3 className="text-lg font-medium">Glass Control</h3>
        
        <div className="flex space-x-2 mt-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`glass-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="premium-panel-content">
        {/* Main Tab */}
        {activeTab === 'main' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Glass Panel</span>
              <button 
                className={`premium-toggle-button ${glass.visible ? 'active' : ''}`}
                onClick={handleVisibilityToggle}
              >
                {glass.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Glass Color</div>
              <div className="grid grid-cols-3 gap-3">
                {glassColors.map(color => (
                  <button
                    key={color.name}
                    className={`glass-color-button ${glass.color === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: `${color.value}80` }} // 50% opacity for preview
                    onClick={() => handleColorChange(color)}
                  >
                    <div className="glass-color-name">{color.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Glass Thickness</span>
                <span className="text-xs">{glass.thickness.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={glass.thickness}
                onChange={handleThicknessChange}
                className="premium-slider"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Glass Extension</span>
                <span className="text-xs">{glass.extension.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={glass.extension}
                onChange={handleExtensionChange}
                className="premium-slider"
              />
            </div>
            
            <div className="flex space-x-2 mb-4">
              <button 
                className="glass-action-btn w-1/2"
                onClick={applyGlass}
                disabled={glass.applied}
              >
                Apply Glass
              </button>
              <button 
                className="glass-action-btn w-1/2"
                onClick={removeGlass}
                disabled={!glass.applied}
              >
                Remove Glass
              </button>
            </div>
            
            <button 
              className="glass-action-btn w-full"
              onClick={resetAllGlassSettings}
            >
              Reset All Glass Settings
            </button>
          </div>
        )}
        
        {/* Sides Tab */}
        {activeTab === 'sides' && (
          <div>
            <div className="text-sm font-medium mb-4">Glass Panel Configuration</div>
            
            <div className="mb-4 p-3 bg-blue-900/30 rounded-md">
              <p className="text-sm mb-2">Recommended: Use only the top panel for a clean look</p>
              <button 
                className="glass-action-btn w-full"
                onClick={showOnlyTopPanel}
              >
                Show Only Top Panel
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                className={`glass-side-btn ${glass.sides?.top ? 'active' : ''}`}
                onClick={() => toggleSideVisibility('top')}
              >
                Top {glass.sides?.top ? 'Visible' : 'Hidden'}
              </button>
              <button
                className={`glass-side-btn ${glass.sides?.bottom ? 'active' : ''}`}
                onClick={() => toggleSideVisibility('bottom')}
              >
                Bottom {glass.sides?.bottom ? 'Visible' : 'Hidden'}
              </button>
              <button
                className={`glass-side-btn ${glass.sides?.front ? 'active' : ''}`}
                onClick={() => toggleSideVisibility('front')}
              >
                Front {glass.sides?.front ? 'Visible' : 'Hidden'}
              </button>
              <button
                className={`glass-side-btn ${glass.sides?.back ? 'active' : ''}`}
                onClick={() => toggleSideVisibility('back')}
              >
                Back {glass.sides?.back ? 'Visible' : 'Hidden'}
              </button>
              <button
                className={`glass-side-btn ${glass.sides?.left ? 'active' : ''}`}
                onClick={() => toggleSideVisibility('left')}
              >
                Left {glass.sides?.left ? 'Visible' : 'Hidden'}
              </button>
              <button
                className={`glass-side-btn ${glass.sides?.right ? 'active' : ''}`}
                onClick={() => toggleSideVisibility('right')}
              >
                Right {glass.sides?.right ? 'Visible' : 'Hidden'}
              </button>
            </div>
            
            <button 
              className="glass-action-btn w-full"
              onClick={showAllSides}
            >
              Show All Sides
            </button>
          </div>
        )}
        
        {/* Position Tab */}
        {activeTab === 'position' && (
          <div>
            <div className="text-sm font-medium mb-4">Adjust Glass Position</div>
            
            <div className="flex flex-col space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">X Position (Left/Right)</span>
                  <span className="text-xs">{(glass.position?.x || 0).toFixed(2)} m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="glass-control-btn"
                    onClick={() => handlePositionChange('x', -0.1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={glass.position?.x || 0}
                    onChange={(e) => setPositionDirectly('x', e.target.value)}
                    className="premium-slider flex-grow"
                  />
                  <button 
                    className="glass-control-btn"
                    onClick={() => handlePositionChange('x', 0.1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-4-4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Y Position (Up/Down)</span>
                  <span className="text-xs">{(glass.position?.y || 0).toFixed(2)} m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="glass-control-btn"
                    onClick={() => handlePositionChange('y', -0.1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={glass.position?.y || 0}
                    onChange={(e) => setPositionDirectly('y', e.target.value)}
                    className="premium-slider flex-grow"
                  />
                  <button 
                    className="glass-control-btn"
                    onClick={() => handlePositionChange('y', 0.1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m0 0l-7-7m7 7l7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Z Position (Front/Back)</span>
                  <span className="text-xs">{(glass.position?.z || 0).toFixed(2)} m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="glass-control-btn"
                    onClick={() => handlePositionChange('z', -0.1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={glass.position?.z || 0}
                    onChange={(e) => setPositionDirectly('z', e.target.value)}
                    className="premium-slider flex-grow"
                  />
                  <button 
                    className="glass-control-btn"
                    onClick={() => handlePositionChange('z', 0.1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m0 0l-7-7m7 7l7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              className="glass-reset-btn w-full"
              onClick={resetPosition}
            >
              Reset Position
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GlassControlPanel;
