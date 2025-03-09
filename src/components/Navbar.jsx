import React, { useState, useEffect } from 'react';
import { 
  CloudArrowDownIcon, 
  MicrophoneIcon, 
  DocumentTextIcon, 
  HeartIcon, 
  SparklesIcon,
  SunIcon,
  MoonIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';

export default function Navbar({ 
  onExportClick, 
  onToggleQuickPreview, 
  onToggleWishlist, 
  onToggleVoiceControl, 
  onTogglePDFExport,
  darkMode,
  onToggleDarkMode
}) {
  // State for SEO score display
  const [showSeoScore, setShowSeoScore] = useState(false);
  const [seoScores, setSeoScores] = useState({
    pergola: 92,
    gazebo: 87,
    canopy: 85
  });

  // Ensure all handlers have fallbacks to prevent errors
  const handleQuickPreview = () => {
    if (typeof onToggleQuickPreview === 'function') {
      onToggleQuickPreview();
    } else {
      console.warn('Quick Preview handler not provided');
    }
  };

  const handleWishlist = () => {
    if (typeof onToggleWishlist === 'function') {
      onToggleWishlist();
    } else {
      console.warn('Wishlist handler not provided');
    }
  };

  const handleVoiceControl = () => {
    if (typeof onToggleVoiceControl === 'function') {
      onToggleVoiceControl();
    } else {
      console.warn('Voice Control handler not provided');
    }
  };

  const handlePDFExport = () => {
    if (typeof onTogglePDFExport === 'function') {
      onTogglePDFExport();
    } else {
      console.warn('PDF Export handler not provided');
    }
  };

  const handleExport = () => {
    if (typeof onExportClick === 'function') {
      onExportClick();
    } else {
      console.warn('Export handler not provided');
    }
  };
  
  const handleToggleDarkMode = () => {
    if (typeof onToggleDarkMode === 'function') {
      onToggleDarkMode();
    } else {
      console.warn('Dark Mode toggle handler not provided');
    }
  };

  // Toggle SEO score display
  const toggleSeoScore = () => {
    setShowSeoScore(!showSeoScore);
  };

  return (
    <nav className={`h-16 ${darkMode ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-xl border-b ${darkMode ? 'border-white/10' : 'border-black/10'} shadow-md`}>
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className={`text-xl sm:text-2xl font-light tracking-wider ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <span className="font-medium">3D</span>
            <span className="font-light">PERGOLA</span>
            <span className="text-xs align-top ml-1 text-blue-500">™</span>
          </h1>
          <div className="hidden md:flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              Pergola
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'}`}>
              Gazebo
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
              Canopy
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <button
            onClick={handleToggleDarkMode}
            className={`navbar-button has-tooltip ${darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
            <span className="tooltip">{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          <button
            onClick={toggleSeoScore}
            className={`navbar-button has-tooltip ${darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
            aria-label="SEO Score"
          >
            <ChartBarIcon className="w-5 h-5" />
            <span className="tooltip">SEO Score</span>
          </button>
          
          <button
            onClick={handleQuickPreview}
            className={`navbar-button has-tooltip ${darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
            aria-label="Quick Preview Pergola Designs"
          >
            <SparklesIcon className="w-5 h-5 mr-1 md:mr-2" />
            <span className="font-medium tracking-wide hidden sm:inline">Preview</span>
            <span className="tooltip">Quick Preview Pergola & Gazebo Designs</span>
          </button>
          
          <button
            onClick={handleWishlist}
            className={`navbar-button has-tooltip ${darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
            aria-label="Wishlist Pergola Designs"
          >
            <HeartIcon className="w-5 h-5 mr-1 md:mr-2" />
            <span className="font-medium tracking-wide hidden sm:inline">Wishlist</span>
            <span className="tooltip">Save Favorite Pergola & Canopy Designs</span>
          </button>
          
          <button
            onClick={handleVoiceControl}
            className={`navbar-button has-tooltip ${darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
            aria-label="Voice Control Pergola Designer"
          >
            <MicrophoneIcon className="w-5 h-5 mr-1 md:mr-2" />
            <span className="font-medium tracking-wide hidden sm:inline">Voice</span>
            <span className="tooltip">Voice Control Pergola Designer</span>
          </button>
          
          <button
            onClick={handlePDFExport}
            className={`navbar-button has-tooltip ${darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
            aria-label="PDF Export Pergola Design"
          >
            <DocumentTextIcon className="w-5 h-5 mr-1 md:mr-2" />
            <span className="font-medium tracking-wide hidden sm:inline">PDF</span>
            <span className="tooltip">Export Pergola Design as PDF</span>
          </button>
          
          <button
            onClick={handleExport}
            className="export-button flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600 active:from-blue-700 active:to-indigo-800 transition-all duration-300 shadow-md"
            aria-label="Export Pergola Design"
          >
            <CloudArrowDownIcon className="w-5 h-5 mr-1 md:mr-2" />
            <span className="font-medium tracking-wide">Export</span>
          </button>
        </div>
      </div>
      
      {/* SEO Score Panel */}
      {showSeoScore && (
        <div className={`absolute top-16 right-0 w-64 md:w-80 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-bl-lg z-50 p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>SEO Performance</h3>
            <button 
              onClick={toggleSeoScore}
              className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Pergola</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{seoScores.pergola}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${seoScores.pergola}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Gazebo</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{seoScores.gazebo}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${seoScores.gazebo}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Canopy</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{seoScores.canopy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${seoScores.canopy}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Keywords optimized for luxury outdoor structures including pergolas, gazebos, and canopies.
          </div>
        </div>
      )}
    </nav>
  );
}
