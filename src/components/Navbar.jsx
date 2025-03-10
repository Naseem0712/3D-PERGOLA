import React from 'react'
import { CloudArrowDownIcon, Bars3Icon } from '@heroicons/react/24/outline'

export default function Navbar({ onExportClick, isMobile = false, onTogglePanelVisibility }) {
  return (
    <nav className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-md">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between navbar-container">
        {isMobile && (
          <button 
            onClick={onTogglePanelVisibility}
            className="mr-2 p-1.5 rounded-md bg-gray-800/70 text-white hover:bg-gray-700/70"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-xl sm:text-2xl font-light tracking-wider text-white navbar-title">
            <span className="font-medium">3D</span>
            <span className="font-light">PERGOLA</span>
          </h1>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={onExportClick}
            className="export-button flex items-center px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600 active:from-blue-700 active:to-indigo-800 transition-all duration-300 shadow-md"
          >
            <CloudArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="font-medium tracking-wide text-sm sm:text-base">Export</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
