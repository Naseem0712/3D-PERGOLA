import React from 'react'
import { SunIcon, MoonIcon, CloudIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function EnvironmentToggle({ environment, timeOfDay, onEnvironmentChange, onTimeOfDayChange }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/30 backdrop-blur-xl rounded-xl p-2 border border-white/10"
    >
      {/* Environment Selection */}
      <div className="mb-2 pb-2 border-b border-white/10">
        <p className="text-xs text-white/70 mb-1 text-center">Environment</p>
        <div className="flex space-x-2">
          <button
            onClick={() => onEnvironmentChange('sunset')}
            className={`p-2 rounded-lg transition-all ${
              environment === 'sunset'
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
            title="Sunset"
          >
            <SparklesIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEnvironmentChange('forest')}
            className={`p-2 rounded-lg transition-all ${
              environment === 'forest'
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
            title="Forest"
          >
            <CloudIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Time of Day Selection */}
      <div>
        <p className="text-xs text-white/70 mb-1 text-center">Time</p>
        <div className="flex space-x-2">
          <button
            onClick={() => onTimeOfDayChange('day')}
            className={`p-2 rounded-lg transition-all ${
              timeOfDay === 'day'
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
            title="Day Time"
          >
            <SunIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onTimeOfDayChange('night')}
            className={`p-2 rounded-lg transition-all ${
              timeOfDay === 'night'
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
            title="Night Time"
          >
            <MoonIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
