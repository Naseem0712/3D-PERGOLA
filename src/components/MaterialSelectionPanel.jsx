import React from 'react'
import { SwatchIcon } from '@heroicons/react/24/outline'

// Define color maps for different materials
const COLOR_MAPS = {
  black: '#000000',
  grey: '#808080',
  brown: '#8B4513',
  'light-oak': '#D2B48C',
  'dark-oak': '#5C4033',
  mahogany: '#A52A2A',
  teak: '#CD853F',
  'natural-wood-1': '#DEB887',
  'natural-wood-2': '#A0522D',
  'natural-wood-3': '#8B4513',
  'tram-wood': '#B8860B',
  'wood-variant-1': '#D2691E',
  'wood-variant-2': '#8B4513'
}

const MATERIALS = {
  iron: {
    name: 'Iron',
    colors: ['black', 'grey', 'brown'],
    sizes: {
      pillar: ['100x100mm', '150x150mm', '200x200mm'],
      beam: ['100x50mm pipe', '100x50mm ISLB', '150x65mm pipe', '150x65mm ISLB'],
      rafter: ['100x100mm pipe', '100x50mm pipe', '25x75mm pipe', '150x75mm pipe']
    }
  },
  aluminium: {
    name: 'Aluminium Profile',
    colors: ['black', 'grey', 'brown', 'tram-wood', 'wood-variant-1', 'wood-variant-2'],
    sizes: {
      pillar: ['100x100mm', '125x125mm', '150x150mm'],
      beam: ['100x50mm', '125x60mm', '150x75mm'],
      rafter: ['100x50mm', '80x40mm', '125x60mm', '150x75mm']
    }
  },
  wpc: {
    name: 'WPC',
    colors: ['natural-wood-1', 'natural-wood-2', 'natural-wood-3'],
    sizes: {
      pillar: ['100x100mm', '125x125mm', '150x150mm'],
      beam: ['100x50mm', '125x60mm', '150x75mm'],
      rafter: ['100x50mm', '80x40mm', '125x60mm', '150x75mm']
    }
  },
  wood: {
    name: 'Wood',
    colors: ['light-oak', 'dark-oak', 'mahogany', 'teak'],
    sizes: {
      pillar: ['100x100mm', '125x125mm', '150x150mm'],
      beam: ['100x100mm', '150x150mm', '100x200mm'],
      rafter: ['125x60mm', '100x100mm', '150x100mm', '150x150mm', '150x25mm', '100x40mm']
    }
  }
}

export default function MaterialSelectionPanel({ selectedMaterial, materialColor, onMaterialChange, onColorChange }) {
  // Get the actual color value from the color name
  const getColorValue = (colorName) => {
    return COLOR_MAPS[colorName] || colorName;
  };
  
  // Handle material color selection
  const handleColorSelect = (colorName) => {
    const colorValue = getColorValue(colorName);
    onColorChange(colorValue);
  };
  
  return (
    <div className="space-y-5">
      <div className="panel-title">
        <SwatchIcon className="w-5 h-5" />
        <h2>Material Selection</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(MATERIALS).map(([id, material]) => (
          <button
            key={id}
            onClick={() => onMaterialChange(id)}
            className={`p-4 rounded-xl border transition-all ${
              selectedMaterial === id
                ? 'border-white/30 bg-white/10'
                : 'border-white/5 bg-black/30 hover:bg-black/40 hover:border-white/10'
            }`}
          >
            <p className="font-medium">{material.name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {material.colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: getColorValue(color),
                    opacity: 1
                  }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
      
      {/* Material-specific Color Selection */}
      <div className="mt-5">
        <h3 className="premium-label">Material Colors</h3>
        <div className="flex flex-wrap gap-3 mt-2">
          {MATERIALS[selectedMaterial]?.colors.map((color) => {
            const colorValue = getColorValue(color);
            const isActive = colorValue.toLowerCase() === materialColor.toLowerCase();
            
            return (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`premium-color-swatch ${isActive ? 'active' : ''}`}
                title={color.replace(/-/g, ' ')}
                style={{ 
                  backgroundColor: colorValue
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Custom Color Selection */}
      <div className="mt-6">
        <h3 className="premium-label">Custom Color</h3>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <input
              type="color"
              value={materialColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-10 rounded-lg bg-black/40 border border-white/10 cursor-pointer"
            />
          </div>
          <div>
            <input
              type="text"
              value={materialColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="input-field h-10"
              placeholder="#RRGGBB"
            />
          </div>
        </div>
      </div>

      <div className="premium-card mt-5 bg-black/20">
        <p className="text-sm text-white/70">
          <span className="font-medium text-white/90">AI Suggestion:</span> {MATERIALS[selectedMaterial].name} is an excellent choice for durability
          and aesthetics. Popular in modern pergola designs.
        </p>
      </div>
    </div>
  )
}
