import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const timerRef = useRef(null);
  const completionTimerRef = useRef(null);
  
  // Loading progress animation
  useEffect(() => {
    const loadingTexts = [
      'Initializing 3D engine...',
      'Loading materials...',
      'Preparing geometry...',
      'Configuring environment...',
      'Optimizing rendering...',
      'Almost ready...',
    ];
    
    // Update loading text based on progress
    const textIndex = Math.min(Math.floor(progress / 20), loadingTexts.length - 1);
    setLoadingText(loadingTexts[textIndex]);
    
    // Preload assets
    const preloadAssets = async () => {
      try {
        // Create an array of promises for each asset to load
        const assetPromises = [
          new Promise((resolve) => {
            const img1 = new Image();
            img1.onload = () => resolve();
            img1.onerror = () => resolve(); // Continue even if error
            img1.src = '/src/assets/textures/wood.jpg';
          }),
          new Promise((resolve) => {
            const img2 = new Image();
            img2.onload = () => resolve();
            img2.onerror = () => resolve(); // Continue even if error
            img2.src = '/src/assets/textures/metal.jpg';
          }),
          // Add more assets as needed
        ];
        
        // Wait for all assets to load
        await Promise.all(assetPromises);
        setAssetsLoaded(true);
        console.log('All assets preloaded successfully');
      } catch (error) {
        console.error('Error preloading assets:', error);
        // Continue anyway to avoid blocking the app
        setAssetsLoaded(true);
      }
    };
    
    preloadAssets();
    
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        // Slow down progress near the end if assets aren't loaded
        if (prev >= 90 && !assetsLoaded) {
          return 90; // Hold at 90% until assets are loaded
        }
        
        if (prev >= 100) {
          clearInterval(timerRef.current);
          
          // Add a small delay before setting complete to ensure smooth transition
          completionTimerRef.current = setTimeout(() => {
            console.log('Loading animation complete');
            setIsComplete(true);
          }, 800);
          
          return 100;
        }
        
        // Normal progress speed up to 90%
        const increment = prev < 70 ? 2 : 1; // Slower near the end
        return Math.min(prev + increment, 100);
      });
    }, 50);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    };
  }, [progress, assetsLoaded]);
  
  // Effect to ensure progress completes when assets are loaded
  useEffect(() => {
    if (assetsLoaded && progress >= 90 && progress < 100) {
      // Assets loaded, finish the progress
      const finishTimer = setTimeout(() => {
        setProgress(100);
      }, 500);
      
      return () => clearTimeout(finishTimer);
    }
  }, [assetsLoaded, progress]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        key="loading-screen"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
        <h1 className="text-4xl font-bold text-white mb-8">LUXURY PERGOLA VISUALIZER</h1>
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className="text-white/70 text-sm mb-2">{loadingText}</p>
        <p className="text-white/50 text-xs">{progress}% complete</p>
        
        {/* Fallback preload div to ensure assets are loaded */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <img src="/src/assets/textures/wood.jpg" alt="" />
          <img src="/src/assets/textures/metal.jpg" alt="" />
          <img src="/src/assets/textures/aluminium.jpg" alt="" />
          <img src="/src/assets/textures/glass.jpg" alt="" />
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
