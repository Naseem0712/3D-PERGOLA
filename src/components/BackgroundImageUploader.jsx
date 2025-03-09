import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpTrayIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const BackgroundImageUploader = ({ onImageUpload, onImageRemove, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Process the selected file
  const processFile = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Read the file and create a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setPreviewImage(imageDataUrl);
      onImageUpload(imageDataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle browse click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-xl rounded-xl p-4 border border-white/10"
    >
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-white mb-2">Background Image</h3>
        
        {previewImage ? (
          <div className="relative w-full">
            <div className="w-full h-24 rounded-lg overflow-hidden mb-2">
              <img 
                src={previewImage} 
                alt="Background preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging ? 'border-green-500 bg-green-500/10' : 'border-white/20 hover:border-white/40'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <ArrowUpTrayIcon className="h-6 w-6 mx-auto text-white/70 mb-2" />
            <p className="text-xs text-white/70 mb-2">Drag & drop an image here</p>
            <div className="flex justify-center">
              <label className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white cursor-pointer transition-colors inline-block">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BackgroundImageUploader;
