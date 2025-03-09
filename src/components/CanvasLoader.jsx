import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const CanvasLoader = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="bg-black/80 p-4 rounded-lg backdrop-blur-sm">
        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-white text-sm font-medium text-center">
          {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
};

export default CanvasLoader;
