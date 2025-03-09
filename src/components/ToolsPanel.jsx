import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MotionComponent from './MotionComponent';

export default function ToolsPanel({ selectedTool, onToolSelect }) {
  // Local state to ensure we can track selection even if parent state doesn't update
  const [localSelectedTool, setLocalSelectedTool] = useState(selectedTool);
  const tools = [
    { id: 'move', icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z', label: 'Move' },
    { id: 'rotate', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Rotate' },
    { id: 'scale', icon: 'M3 8V4m0 0h4M3 4l4 4m8 0V4m0 0h-4m4 0l-4 4m-8 4v4m0 0h4m-4 0l4-4m8 4l-4-4m4 4v-4m0 4h-4', label: 'Scale' },
    { id: 'measure', icon: 'M19 13l-7 7-7-7m14-8l-7 7-7-7', label: 'Measure' }
  ];

  return (
    <MotionComponent title="Tools">
      <div className="flex flex-col space-y-2">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              const newTool = tool.id === localSelectedTool ? null : tool.id;
              setLocalSelectedTool(newTool);
              onToolSelect(newTool);
            }}
            className={`p-2 rounded-lg transition-all ${
              localSelectedTool === tool.id 
                ? 'bg-blue-600 text-white' 
                : 'text-white/70 hover:bg-white/10'
            }`}
            title={tool.label}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
            </svg>
          </button>
        ))}
      </div>
    </MotionComponent>
  );
}
