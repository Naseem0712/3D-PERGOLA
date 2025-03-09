import React from 'react'
import { CubeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function PillarCustomizationPanel({ pillars, onPillarsChange }) {

  return (
    <div className="space-y-5">
      <div className="panel-title">
        <CubeIcon className="w-5 h-5" />
        <h2>Pillar Customization</h2>
      </div>

      <div className="space-y-5">
        {/* Pillar Size */}
        <div>
          <label className="premium-label">
            Pillar Size (meters)
          </label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs text-white/60 mb-1">Width</label>
              <input
                type="number"
                value={pillars.size.width}
                onChange={(e) => onPillarsChange({
                  ...pillars,
                  size: {
                    ...pillars.size,
                    width: parseFloat(e.target.value)
                  }
                })}
                min="0.01"
                max="1.0"
                step="0.01"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Depth</label>
              <input
                type="number"
                value={pillars.size.depth}
                onChange={(e) => onPillarsChange({
                  ...pillars,
                  size: {
                    ...pillars.size,
                    depth: parseFloat(e.target.value)
                  }
                })}
                min="0.01"
                max="1.0"
                step="0.01"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Pillar Visibility */}
        <div>
          <label className="premium-label">
            Pillar Visibility
          </label>
          <div className="grid grid-cols-2 gap-3">
            {pillars.visible.map((isVisible, index) => (
              <button
                key={`pillar-visibility-${index}`}
                onClick={() => {
                  const newVisible = [...pillars.visible];
                  newVisible[index] = !newVisible[index];
                  onPillarsChange({ ...pillars, visible: newVisible });
                }}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-all ${isVisible ? 'bg-white/10 text-white' : 'bg-white/5 text-white/50'}`}
              >
                {isVisible ? (
                  <>
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">Pillar {index + 1}</span>
                  </>
                ) : (
                  <>
                    <EyeSlashIcon className="w-4 h-4" />
                    <span className="text-sm">Pillar {index + 1}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar Count */}
        <div>
          <label className="premium-label">
            Number of Pillars
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (pillars.count > 2) {
                  const newCount = pillars.count - 1;
                  const newVisible = [...pillars.visible];
                  newVisible.pop();
                  onPillarsChange({
                    ...pillars,
                    count: newCount,
                    visible: newVisible
                  });
                }
              }}
              disabled={pillars.count <= 2}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="text-lg font-medium text-white">{pillars.count}</span>
            <button
              onClick={() => {
                const newCount = pillars.count + 1;
                const newVisible = [...pillars.visible, true];
                onPillarsChange({
                  ...pillars,
                  count: newCount,
                  visible: newVisible
                });
              }}
              disabled={pillars.count >= 12}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <p className="text-xs text-white/50 mt-1">Min: 2, Max: 12 pillars</p>
        </div>

        {/* Pillar Configuration Presets */}
        <div className="mt-4">
          <label className="premium-label">
            Pillar Configuration Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onPillarsChange({
                ...pillars,
                count: 4,
                visible: [true, true, true, true],
                size: { width: 0.1, depth: 0.1 }
              })}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
            >
              Standard
            </button>
            <button
              onClick={() => onPillarsChange({
                ...pillars,
                count: 6,
                visible: [true, true, true, true, true, true],
                size: { width: 0.15, depth: 0.15 }
              })}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
            >
              Enhanced
            </button>
            <button
              onClick={() => onPillarsChange({
                ...pillars,
                count: 8,
                visible: [true, true, true, true, true, true, true, true],
                size: { width: 0.2, depth: 0.2 }
              })}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
            >
              Premium
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-sm text-white/60">
            <span className="text-blue-400 font-medium">AI Suggestion:</span> {pillars.count < 4 ? 
              "Minimal pillar design creates an open, airy feel but may require additional structural considerations." :
              pillars.count > 8 ?
              "Extended pillar configuration provides maximum stability and a grand architectural statement." :
              `${pillars.count}-pillar configuration balances aesthetics with structural integrity.`
            }
          </p>
        </div>
      </div>
    </div>
  )
}
