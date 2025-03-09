import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

/**
 * WishlistPanel Component
 * Allows users to save and manage their favorite pergola designs
 */
const WishlistPanel = ({ 
  isOpen, 
  onClose, 
  onApplyDesign, 
  currentDesign 
}) => {
  // State for saved designs
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [designName, setDesignName] = useState('');
  const [designNote, setDesignNote] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  // Load saved designs from localStorage on component mount
  useEffect(() => {
    const loadSavedDesigns = () => {
      try {
        const savedData = localStorage.getItem('pergolaWishlist');
        if (savedData) {
          setSavedDesigns(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading saved designs:', error);
      }
    };

    if (isOpen) {
      loadSavedDesigns();
    }
  }, [isOpen]);

  // Save designs to localStorage when they change
  useEffect(() => {
    if (savedDesigns.length > 0) {
      try {
        localStorage.setItem('pergolaWishlist', JSON.stringify(savedDesigns));
      } catch (error) {
        console.error('Error saving designs:', error);
      }
    }
  }, [savedDesigns]);

  // Handle saving current design
  const handleSaveDesign = () => {
    if (!designName.trim()) {
      alert('Please enter a name for your design');
      return;
    }

    const designToSave = {
      ...currentDesign,
      name: designName.trim(),
      note: designNote.trim(),
      date: new Date().toISOString()
    };

    if (editIndex >= 0) {
      // Update existing design
      const updatedDesigns = [...savedDesigns];
      updatedDesigns[editIndex] = designToSave;
      setSavedDesigns(updatedDesigns);
    } else {
      // Add new design
      setSavedDesigns([...savedDesigns, designToSave]);
    }

    // Reset form
    setDesignName('');
    setDesignNote('');
    setShowSaveForm(false);
    setEditIndex(-1);
  };

  // Handle editing a saved design
  const handleEditDesign = (index) => {
    const design = savedDesigns[index];
    setDesignName(design.name);
    setDesignNote(design.note || '');
    setEditIndex(index);
    setShowSaveForm(true);
  };

  // Handle deleting a saved design
  const handleDeleteDesign = (index) => {
    if (window.confirm('Are you sure you want to delete this saved design?')) {
      const updatedDesigns = savedDesigns.filter((_, i) => i !== index);
      setSavedDesigns(updatedDesigns);
      
      // Update localStorage
      if (updatedDesigns.length === 0) {
        localStorage.removeItem('pergolaWishlist');
      } else {
        localStorage.setItem('pergolaWishlist', JSON.stringify(updatedDesigns));
      }
    }
  };

  // Handle applying a saved design
  const handleApplyDesign = (design) => {
    onApplyDesign(design);
    onClose();
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <HeartIconSolid className="w-5 h-5 text-red-500 mr-2" />
            <h2 className="text-xl font-medium text-white">My Wishlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Save current design button */}
          {!showSaveForm && (
            <button
              onClick={() => {
                setDesignName('');
                setDesignNote('');
                setEditIndex(-1);
                setShowSaveForm(true);
              }}
              className="w-full mb-6 p-3 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            >
              <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-white">Save Current Design</span>
            </button>
          )}

          {/* Save form */}
          <AnimatePresence>
            {showSaveForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">
                      {editIndex >= 0 ? 'Edit Saved Design' : 'Save Current Design'}
                    </h3>
                    <button
                      onClick={() => setShowSaveForm(false)}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="designName" className="block text-sm font-medium text-gray-300 mb-1">
                        Design Name
                      </label>
                      <input
                        type="text"
                        id="designName"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="My Perfect Pergola"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="designNote" className="block text-sm font-medium text-gray-300 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="designNote"
                        value={designNote}
                        onChange={(e) => setDesignNote(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add any notes about this design..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => setShowSaveForm(false)}
                        className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveDesign}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                      >
                        {editIndex >= 0 ? 'Update Design' : 'Save Design'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved designs list */}
          {savedDesigns.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {savedDesigns.map((design, index) => (
                <div
                  key={index}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{design.name}</h4>
                      <p className="text-xs text-gray-400">
                        {new Date(design.date).toLocaleDateString()}
                      </p>
                      {design.note && (
                        <p className="text-sm text-gray-300 mt-2">{design.note}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDesign(index)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteDesign(index)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-red-600/70 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleApplyDesign(design)}
                        className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
                        title="Apply Design"
                      >
                        <ArrowUturnLeftIcon className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HeartIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No saved designs yet</p>
              <p className="text-sm text-white/30 mt-2">
                Save your favorite designs to access them later
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WishlistPanel;
