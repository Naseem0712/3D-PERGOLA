import React from 'react';
import { motion } from 'framer-motion';
import { ArrowsRightLeftIcon, ArrowsUpDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function RafterCustomizationPanel({ rafters, onRaftersChange }) {
  const handleSpacingChange = (e) => {
    const spacing = parseFloat(e.target.value);
    onRaftersChange({ ...rafters, spacing });
  };

  const handleDirectionChange = (direction) => {
    onRaftersChange({ ...rafters, direction });
  };

  const handleSizeChange = (dimension, value) => {
    const size = { ...rafters.size, [dimension]: parseFloat(value) };
    onRaftersChange({ ...rafters, size });
  };

  const handleStyleChange = (style) => {
    onRaftersChange({ ...rafters, style });
  };

  const toggleRafterVisibility = () => {
    onRaftersChange({ ...rafters, visible: !rafters.visible });
  };

  const handleCurvatureChange = (e) => {
    const curvature = parseFloat(e.target.value);
    onRaftersChange({ ...rafters, curvature });
  };

  const handleCurvePositionChange = (e) => {
    const curvePosition = parseFloat(e.target.value);
    onRaftersChange({ ...rafters, curvePosition });
  };

  const toggleGapManagement = () => {
    const gapManagement = { 
      ...rafters.gapManagement, 
      enabled: !rafters.gapManagement.enabled 
    };
    onRaftersChange({ ...rafters, gapManagement });
  };

  const handleGapChange = (property, value) => {
    const gapManagement = { 
      ...rafters.gapManagement, 
      [property]: parseFloat(value) 
    };
    onRaftersChange({ ...rafters, gapManagement });
  };

  const toggleIndividualControl = () => {
    onRaftersChange({ 
      ...rafters, 
      individualControl: !rafters.individualControl,
      // Reset selected rafter when turning off individual control
      selectedRafter: !rafters.individualControl ? null : rafters.selectedRafter
    });
  };

  const handleIndividualRafterCurvature = (e) => {
    if (!rafters.selectedRafter) return;
    
    const curvature = parseFloat(e.target.value);
    const updatedIndividualRafters = [...rafters.individualRafters];
    
    // Find if this rafter already has custom settings
    const existingIndex = updatedIndividualRafters.findIndex(
      r => r.id === rafters.selectedRafter
    );
    
    if (existingIndex >= 0) {
      // Update existing rafter settings
      updatedIndividualRafters[existingIndex] = {
        ...updatedIndividualRafters[existingIndex],
        curvature
      };
    } else {
      // Add new rafter settings
      updatedIndividualRafters.push({
        id: rafters.selectedRafter,
        curvature
      });
    }
    
    onRaftersChange({
      ...rafters,
      individualRafters: updatedIndividualRafters
    });
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-medium text-white">Rafter Customization</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Spacing (m)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0.05"
              max="2"
              step="0.05"
              value={rafters.spacing}
              onChange={handleSpacingChange}
              className="w-full h-2 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white bg-white/10 px-2 py-1 rounded-md text-sm min-w-[50px] text-center">
              {rafters.spacing}m
            </span>
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Ultra-Dense (0.05m)</span>
            <span>Very Sparse (2m)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Direction
          </label>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-2 text-sm rounded-lg transition-all flex-1 flex items-center justify-center space-x-2 ${
                rafters.direction === 'front-back'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              onClick={() => handleDirectionChange('front-back')}
            >
              <ArrowsUpDownIcon className="w-4 h-4" />
              <span>Front-Back</span>
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-lg transition-all flex-1 flex items-center justify-center space-x-2 ${
                rafters.direction === 'left-right'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              onClick={() => handleDirectionChange('left-right')}
            >
              <ArrowsRightLeftIcon className="w-4 h-4" />
              <span>Left-Right</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Width (m)</label>
              <input
                type="number"
                min="0.01"
                max="0.5"
                step="0.01"
                value={rafters.size.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Height (m)</label>
              <input
                type="number"
                min="0.01"
                max="0.5"
                step="0.01"
                value={rafters.size.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Rafter Presets */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-white/70 mb-2">
          Rafter Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onRaftersChange({
              ...rafters,
              spacing: 0.3,
              size: { width: 0.05, height: 0.1 }
            })}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
          >
            Standard
          </button>
          <button
            onClick={() => onRaftersChange({
              ...rafters,
              spacing: 0.2,
              size: { width: 0.08, height: 0.15 }
            })}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
          >
            Premium
          </button>
          <button
            onClick={() => onRaftersChange({
              ...rafters,
              spacing: 0.15,
              size: { width: 0.1, height: 0.2 }
            })}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
          >
            Luxury
          </button>
        </div>
      </div>

      {/* Pattern Selection */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-white/70 mb-2">
            Rafter Pattern
          </label>
          <button 
            onClick={toggleRafterVisibility}
            className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            title={rafters.visible ? "Hide Rafters" : "Show Rafters"}
          >
            {rafters.visible ? 
              <EyeIcon className="w-4 h-4 text-white/70" /> : 
              <EyeSlashIcon className="w-4 h-4 text-white/70" />}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-center space-x-2 ${
              rafters.pattern === 'parallel' || !rafters.pattern
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            onClick={() => onRaftersChange({ ...rafters, pattern: 'parallel' })}
          >
            <span>Parallel</span>
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-center space-x-2 ${
              rafters.pattern === 'crosshatch'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            onClick={() => onRaftersChange({ ...rafters, pattern: 'crosshatch' })}
          >
            <span>Crosshatch</span>
          </button>
        </div>
      </div>

      {/* Rafter Style */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-white/70 mb-2">
          Rafter Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-center ${
              rafters.style === 'straight'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            onClick={() => handleStyleChange('straight')}
          >
            <span>Straight</span>
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-center ${
              rafters.style === 'curved'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            onClick={() => handleStyleChange('curved')}
          >
            <span>Curved</span>
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-center ${
              rafters.style === 'none'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            onClick={() => handleStyleChange('none')}
          >
            <span>None</span>
          </button>
        </div>
      </div>

      {/* Curvature Control - only show when curved style is selected */}
      {rafters.style === 'curved' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-white/70 mb-1">
            Curvature Amount
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={rafters.curvature}
              onChange={handleCurvatureChange}
              className="w-full h-2 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white bg-white/10 px-2 py-1 rounded-md text-sm min-w-[50px] text-center">
              {rafters.curvature.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Subtle</span>
            <span>Dramatic</span>
          </div>
        </div>
      )}
      
      {/* Curve Position Control - only show when curved style is selected */}
      {rafters.style === 'curved' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-white/70 mb-1">
            Curve Position
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={rafters.curvePosition || 0.5}
              onChange={handleCurvePositionChange}
              className="w-full h-2 bg-gradient-to-r from-purple-600/50 to-purple-400/50 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white bg-white/10 px-2 py-1 rounded-md text-sm min-w-[50px] text-center">
              {(rafters.curvePosition || 0.5).toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Left/Front</span>
            <span>Right/Back</span>
          </div>
          <div className="mt-2 text-xs text-white/60 bg-blue-500/10 p-2 rounded-lg">
            <span className="font-semibold">AI Tip:</span> Adjust the position of the maximum curve point to create unique rafter designs.
          </div>
        </div>
      )}

      {/* Individual Rafter Control - only show when curved style is selected */}
      {rafters.style === 'curved' && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Individual Rafter Control
            </label>
            <button 
              onClick={toggleIndividualControl}
              className={`flex items-center justify-center p-2 rounded-lg transition-all ${rafters.individualControl ? 'bg-blue-500/20' : 'bg-white/10 hover:bg-white/20'}`}
              title={rafters.individualControl ? "Disable Individual Control" : "Enable Individual Control"}
            >
              <span className="text-xs font-medium">
                {rafters.individualControl ? "ON" : "OFF"}
              </span>
            </button>
          </div>
          
          {rafters.individualControl && (
            <div className="mt-2 space-y-3">
              <div className="text-xs text-white/70 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-2 rounded-lg">
                Click on any rafter in the 3D model to select it, then adjust its curvature below.
              </div>
              
              {rafters.selectedRafter ? (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-white/70">
                      Selected Rafter: {rafters.selectedRafter}
                    </label>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-xs text-white/70 mb-1">
                      Curvature
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={
                          rafters.individualRafters.find(r => r.id === rafters.selectedRafter)?.curvature || 
                          rafters.curvature
                        }
                        onChange={handleIndividualRafterCurvature}
                        className="w-full h-2 bg-gradient-to-r from-green-600/50 to-green-400/50 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-white bg-white/10 px-2 py-1 rounded-md text-xs min-w-[40px] text-center">
                        {(rafters.individualRafters.find(r => r.id === rafters.selectedRafter)?.curvature || 
                          rafters.curvature).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-xs text-white/50 bg-white/5 rounded-lg">
                  No rafter selected. Click on a rafter in the 3D model.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Gap Management */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-white/70 mb-2">
            Gap Management
          </label>
          <button 
            onClick={toggleGapManagement}
            className={`flex items-center justify-center p-2 rounded-lg transition-all ${rafters.gapManagement.enabled ? 'bg-blue-500/20' : 'bg-white/10 hover:bg-white/20'}`}
            title={rafters.gapManagement.enabled ? "Disable Gap Management" : "Enable Gap Management"}
          >
            <span className={`text-xs ${rafters.gapManagement.enabled ? 'text-blue-400' : 'text-white/70'}`}>
              {rafters.gapManagement.enabled ? "ON" : "OFF"}
            </span>
          </button>
        </div>

        {rafters.gapManagement.enabled && (
          <div className="mt-2 space-y-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
            {/* Group Size */}
            <div>
              <label className="block text-xs text-white/70 mb-1">Group Size (rafters)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={rafters.gapManagement.groupSize}
                  onChange={(e) => handleGapChange('groupSize', e.target.value)}
                  className="w-full h-2 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white bg-white/10 px-2 py-1 rounded-md text-sm min-w-[50px] text-center">
                  {rafters.gapManagement.groupSize}
                </span>
              </div>
            </div>

            {/* Primary Gap */}
            <div>
              <label className="block text-xs text-white/70 mb-1">Primary Gap (m)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={rafters.gapManagement.primaryGap}
                  onChange={(e) => handleGapChange('primaryGap', e.target.value)}
                  className="w-full h-2 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white bg-white/10 px-2 py-1 rounded-md text-sm min-w-[50px] text-center">
                  {rafters.gapManagement.primaryGap.toFixed(2)}m
                </span>
              </div>
            </div>

            {/* Group Gap */}
            <div>
              <label className="block text-xs text-white/70 mb-1">Group Gap (m)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={rafters.gapManagement.groupGap}
                  onChange={(e) => handleGapChange('groupGap', e.target.value)}
                  className="w-full h-2 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white bg-white/10 px-2 py-1 rounded-md text-sm min-w-[50px] text-center">
                  {rafters.gapManagement.groupGap.toFixed(1)}m
                </span>
              </div>
            </div>

            <div className="text-xs text-white/60 mt-2 bg-white/5 p-2 rounded">
              This creates groups of {rafters.gapManagement.groupSize} rafters with {rafters.gapManagement.primaryGap.toFixed(2)}m spacing between rafters in a group, and {rafters.gapManagement.groupGap.toFixed(1)}m between groups.
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-sm text-white/60">
          <span className="text-blue-400 font-medium">AI Suggestion:</span> {' '}
          {rafters.gapManagement.enabled
            ? 'Custom gap management creates a rhythmic pattern with visual interest. Varying gaps between rafter groups adds architectural sophistication.'
            : !rafters.visible
              ? 'Removing rafters creates an open-top pergola design, perfect for climbing plants or string lights.'
              : rafters.style === 'none'
              ? 'Consider adding rafters to provide shade and complete the pergola structure.'
              : rafters.style === 'curved'
              ? `Curved rafters add an elegant, architectural element to your pergola. ${rafters.curvature > 0.7 ? 'The dramatic curve creates a statement piece.' : 'The subtle curve adds refined character.'}`
              : rafters.spacing < 0.15 
                ? 'Dense rafter spacing creates a more sheltered feel with increased shade.'
                : rafters.spacing > 0.8
                ? 'Wide rafter spacing allows more light through while maintaining the pergola aesthetic.'
                : `${rafters.direction === 'front-back' 
                    ? 'Front-to-back rafters with balanced spacing creates a classic pergola look.' 
                    : 'Left-to-right rafters enhance the visual width of your pergola design.'}`
          }
          {rafters.pattern === 'crosshatch' && ' The crosshatch pattern adds architectural complexity and visual interest.'}
        </p>
      </div>
    </motion.div>
  );
}
