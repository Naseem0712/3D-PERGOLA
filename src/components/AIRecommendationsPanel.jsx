import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, XMarkIcon, ArrowRightIcon, LightBulbIcon, SwatchIcon, ArrowsPointingOutIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import hybridAIService from '../services/HybridAIService';

export default function AIRecommendationsPanel({ dimensions, material, materialColor, pillars, rafters, onClose, onApplyRecommendation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(true);

  // Use the HybridAIService to generate real recommendations
  useEffect(() => {
    setIsGenerating(true);
    
    // Record the current design state in the AI service
    hybridAIService.recordInteraction('design_update', {
      dimensions,
      material,
      materialColor,
      pillars,
      rafters
    });
    
    // Short timeout to simulate processing time
    const timer = setTimeout(() => {
      // Get recommendations from the AI service
      const currentDesign = {
        dimensions,
        material,
        materialColor,
        pillars,
        rafters
      };
      
      // Get AI-generated recommendations
      const aiRecommendations = hybridAIService.generateRecommendations(currentDesign);
      
      // Transform the AI recommendations into the format expected by the UI
      const generatedRecommendations = [
        // Include some of the original static recommendations for now
        // In a full implementation, all would come from the AI service
        {
          id: 1,
          title: 'Optimized Dimensions',
          description: 'Balanced proportions for aesthetic appeal and stability',
          dimensions: { length: 4.5, width: 3.2, height: 2.7 },
          material: material,
          materialColor: materialColor,
          pillars: pillars,
          rafters: rafters,
          icon: <ArrowsPointingOutIcon className="h-4 w-4" />,
          preview: '4.5m × 3.2m × 2.7m',
          category: 'dimensions'
        },
        {
          id: 2,
          title: 'Material Upgrade',
          description: 'Enhanced durability with premium material selection',
          dimensions: dimensions,
          material: material === 'aluminium' ? 'wpc' : 'aluminium',
          materialColor: material === 'aluminium' ? '#8B4513' : '#a8a8a8',
          pillars: pillars,
          rafters: rafters,
          icon: <SwatchIcon className="h-4 w-4" />,
          preview: material === 'aluminium' ? 'WPC' : 'Aluminium',
          category: 'material'
        },
        {
          id: 3,
          title: 'Architectural Balance',
          description: 'Golden ratio proportions for visual harmony',
          dimensions: { 
            length: parseFloat((dimensions.width * 1.618).toFixed(1)), 
            width: dimensions.width, 
            height: dimensions.height 
          },
          material: material,
          materialColor: materialColor,
          pillars: pillars,
          rafters: rafters,
          icon: <LightBulbIcon className="h-4 w-4" />,
          preview: `${(dimensions.width * 1.618).toFixed(1)}m × ${dimensions.width}m × ${dimensions.height}m`,
          category: 'dimensions'
        },
        {
          id: 4,
          title: 'Structural Optimization',
          description: 'Improved pillar configuration for enhanced stability',
          dimensions: dimensions,
          material: material,
          materialColor: materialColor,
          pillars: {
            ...pillars,
            count: 6,
            visible: [...pillars.visible.slice(0, 4), true, true]
          },
          rafters: rafters,
          icon: <SparklesIcon className="h-4 w-4" />,
          preview: '6-Pillar Configuration',
          category: 'structure'
        },
        {
          id: 5,
          title: 'Color Harmony',
          description: 'Optimized color palette based on material properties',
          dimensions: dimensions,
          material: material,
          materialColor: material === 'wpc' ? '#6D4C41' : 
                        material === 'aluminium' ? '#B0BEC5' : 
                        material === 'wood' ? '#8D6E63' : '#455A64',
          pillars: pillars,
          rafters: rafters,
          icon: <SwatchIcon className="h-4 w-4" />,
          preview: 'Enhanced Color Palette',
          category: 'color'
        },
        {
          id: 6,
          title: 'Rafter Spacing Optimization',
          description: 'Balanced rafter spacing for optimal light filtration',
          dimensions: dimensions,
          material: material,
          materialColor: materialColor,
          pillars: pillars,
          rafters: {
            ...rafters,
            spacing: 0.35,
            direction: 'front-back'
          },
          icon: <LightBulbIcon className="h-4 w-4" />,
          preview: 'Optimized Light Filtration',
          category: 'rafters'
        }
      ];
      
      // Add any error recommendations from the AI service
      const errorRecommendations = aiRecommendations
        .filter(rec => rec.type === 'error' || rec.type === 'warning')
        .map((rec, index) => ({
          id: 100 + index,
          title: rec.type === 'error' ? 'Design Issue Detected' : 'Design Suggestion',
          description: rec.message,
          dimensions: rec.category === 'dimensions' ? rec.value : dimensions,
          material: rec.category === 'material' ? rec.value : material,
          materialColor: materialColor,
          pillars: rec.category === 'structural' ? { ...pillars, count: 6 } : pillars,
          rafters: rec.category === 'aesthetic' ? { ...rafters, spacing: 0.3 } : rafters,
          icon: rec.type === 'error' ? <ExclamationTriangleIcon className="h-4 w-4 text-orange-400" /> : <CheckCircleIcon className="h-4 w-4" />,
          preview: rec.category.charAt(0).toUpperCase() + rec.category.slice(1) + ' Optimization',
          category: rec.category,
          severity: rec.severity || 'medium'
        }));
      
      // Combine static and AI-generated recommendations
      const combinedRecommendations = [...generatedRecommendations, ...errorRecommendations];
      
      setRecommendations(combinedRecommendations);
      setIsGenerating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dimensions, material, materialColor, pillars, rafters]);

  const [activeCategory, setActiveCategory] = useState('all');
  
  // Handle applying a recommendation
  const handleApplyRecommendation = (recommendation) => {
    // Record this interaction in the AI service
    hybridAIService.recordInteraction('apply_recommendation', {
      recommendationId: recommendation.id,
      category: recommendation.category,
      before: { dimensions, material, materialColor, pillars, rafters },
      after: {
        dimensions: recommendation.dimensions,
        material: recommendation.material,
        materialColor: recommendation.materialColor,
        pillars: recommendation.pillars,
        rafters: recommendation.rafters
      }
    });
    
    // Apply the recommendation
    onApplyRecommendation(recommendation);
  };
  
  const filteredRecommendations = activeCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === activeCategory);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="text-white bg-black/30 backdrop-blur-xl rounded-xl p-5 border border-white/10 shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-blue-400" />
          <h3 className="text-xl font-medium">AI Design Recommendations</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'dimensions', 'material', 'structural', 'aesthetic', 'color', 'rafters'].map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-all ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/70 text-sm">Analyzing your design and generating intelligent recommendations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {filteredRecommendations.map((rec) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: rec.id * 0.05 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer group"
              onClick={() => handleApplyRecommendation(rec)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-2 group-hover:bg-blue-500/30 transition-colors">
                  {rec.icon || <SparklesIcon className="h-4 w-4 text-blue-400" />}
                </div>
                <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">{rec.title}</h4>
              </div>
              <p className="text-sm text-white/70 mb-3 line-clamp-2">{rec.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono bg-black/20 rounded-lg px-2 py-1 inline-block text-blue-300/80">
                  {rec.preview}
                </div>
                <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRightIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 text-xs text-white/40 flex justify-between">
                <span>Category: {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}</span>
                {rec.severity && (
                  <span className={`${rec.severity === 'high' ? 'text-red-400' : rec.severity === 'medium' ? 'text-orange-400' : 'text-yellow-400'}`}>
                    {rec.severity.charAt(0).toUpperCase() + rec.severity.slice(1)} Priority
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!isGenerating && (
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-xs text-white/50">
            <SparklesIcon className="h-3 w-3 inline mr-1" />
            Recommendations based on design principles and ergonomic standards
          </p>
          <button 
            onClick={onClose}
            className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
}
