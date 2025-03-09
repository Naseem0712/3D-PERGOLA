import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PDFControlPanel = ({ onExport, onCancel, customerDetails, setCustomerDetails, qualitySettings, setQualitySettings }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle quality settings changes
  const handleQualityChange = (setting, value) => {
    setQualitySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Apple-style header */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800">Export PDF</h2>
        <p className="text-sm text-gray-600">Customize your luxury pergola export</p>
      </div>
      
      {/* Tab navigation - Apple style */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'details' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Client Details
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'quality' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('quality')}
        >
          Quality Settings
        </button>
      </div>
      
      {/* Scrollable content area */}
      <div className="max-h-[400px] overflow-y-auto p-6 custom-scrollbar">
        {activeTab === 'details' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                name="name"
                value={customerDetails.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="Enter client name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={customerDetails.email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="client@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="mobile"
                value={customerDetails.mobile || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={customerDetails.address || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                placeholder="Enter client address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="additionalInfo"
                value={customerDetails.additionalInfo || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700"
                placeholder="Any special requirements or notes"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">PDF Quality</label>
              <div className="space-y-2">
                {['ultra', 'high', 'medium', 'low'].map((quality) => (
                  <div key={quality} className="flex items-center">
                    <input
                      type="radio"
                      id={`quality-${quality}`}
                      checked={qualitySettings.resolution === quality}
                      onChange={() => handleQualityChange('resolution', quality)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                    />
                    <label htmlFor={`quality-${quality}`} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                      {quality}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Include in PDF</label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-details"
                  checked={qualitySettings.includeDetails}
                  onChange={() => handleQualityChange('includeDetails', !qualitySettings.includeDetails)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="include-details" className="ml-3 block text-sm text-gray-700">
                  Detailed specifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-measurements"
                  checked={qualitySettings.includeMeasurements}
                  onChange={() => handleQualityChange('includeMeasurements', !qualitySettings.includeMeasurements)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="include-measurements" className="ml-3 block text-sm text-gray-700">
                  Measurements and dimensions
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-watermark"
                  checked={qualitySettings.includeWatermark}
                  onChange={() => handleQualityChange('includeWatermark', !qualitySettings.includeWatermark)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="include-watermark" className="ml-3 block text-sm text-gray-700">
                  Luxury watermark
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Apple-style footer with action buttons */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Export PDF
        </button>
      </div>
    </motion.div>
  );
};

export default PDFControlPanel;
