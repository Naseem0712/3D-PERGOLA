import React from 'react'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

export default function PergolaDimensionsPanel({ dimensions, onDimensionsChange }) {
  const handleChange = (dimension, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      // No minimum restrictions, allow any valid number
      onDimensionsChange({ ...dimensions, [dimension]: numValue })
    }
  }
  
  // Function to quickly adjust dimensions with preset values
  const applyPreset = (preset) => {
    switch(preset) {
      case 'small':
        onDimensionsChange({ length: 2.5, width: 2, height: 2.2 })
        break
      case 'medium':
        onDimensionsChange({ length: 4, width: 3, height: 2.5 })
        break
      case 'large':
        onDimensionsChange({ length: 6, width: 4, height: 2.8 })
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-5">
      <div className="panel-title">
        <ArrowsPointingOutIcon className="w-5 h-5" />
        <h2>Dimensions</h2>
      </div>

      <div className="space-y-4">
        {['length', 'width', 'height'].map((dim) => (
          <div key={dim} className="space-y-1.5">
            <label className="premium-label capitalize">
              {dim} (meters)
            </label>
            <input
              type="number"
              value={dimensions[dim]}
              onChange={(e) => handleChange(dim, e.target.value)}
              min="0.1"
              max="50"
              step="0.1"
              className="input-field"
            />
          </div>
        ))}
      </div>

      {/* Quick Preset Buttons */}
      <div className="mt-5">
        <label className="premium-label mb-2">Quick Presets</label>
        <div className="flex space-x-2">
          <button 
            onClick={() => applyPreset('small')} 
            className="button-secondary text-sm py-1.5 px-3"
          >
            Small
          </button>
          <button 
            onClick={() => applyPreset('medium')} 
            className="button-secondary text-sm py-1.5 px-3"
          >
            Medium
          </button>
          <button 
            onClick={() => applyPreset('large')} 
            className="button-secondary text-sm py-1.5 px-3"
          >
            Large
          </button>
        </div>
      </div>
      
      <div className="premium-card mt-5 bg-black/20">
        <p className="text-sm text-white/70">
          <span className="font-medium text-white/90">AI Suggestion:</span> Based on your current dimensions, this pergola would be suitable for {dimensions.length * dimensions.width < 9 ? 'small gatherings' : dimensions.length * dimensions.width < 20 ? 'medium-sized outdoor dining' : 'large entertainment areas'}.
        </p>
      </div>
    </div>
  )
}
