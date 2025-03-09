import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, XMarkIcon, ArrowDownTrayIcon, CheckIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * PDFExportPanel Component
 * Allows users to export their pergola design as a PDF document
 */
const PDFExportPanel = ({ 
  isOpen, 
  onClose, 
  currentDesign,
  canvasRef
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    includeSpecs: true,
    includeMaterials: true,
    includePrice: true,
    orientation: 'portrait',
    fileName: 'My Pergola Design'
  });
  
  const formRef = useRef(null);

  // Handle changes to PDF export options
  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPdfOptions({
      ...pdfOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Generate and export the PDF
  const handleExport = async () => {
    if (!canvasRef || !canvasRef.current) {
      alert('Cannot access the 3D canvas. Please try again.');
      return;
    }

    setIsExporting(true);
    setExportProgress(10);
    setExportComplete(false);

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation,
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(33, 33, 33);
      pdf.text(pdfOptions.fileName, 20, 20);
      
      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      setExportProgress(30);
      
      // Capture the 3D canvas
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      setExportProgress(60);
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const imgWidth = pdf.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 20, 40, imgWidth, imgHeight);
      
      setExportProgress(80);
      
      // Add specifications if selected
      let yPosition = 40 + imgHeight + 10;
      
      if (pdfOptions.includeSpecs) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text('Specifications', 20, yPosition);
        
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);
        yPosition += 10;
        pdf.text(`Dimensions: ${currentDesign.dimensions.length}m × ${currentDesign.dimensions.width}m × ${currentDesign.dimensions.height}m`, 20, yPosition);
        
        yPosition += 8;
        pdf.text(`Style: ${currentDesign.style || 'Custom'}`, 20, yPosition);
        
        if (currentDesign.roofType) {
          yPosition += 8;
          pdf.text(`Roof Type: ${currentDesign.roofType}`, 20, yPosition);
        }
        
        yPosition += 15;
      }
      
      // Add materials if selected
      if (pdfOptions.includeMaterials) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text('Materials', 20, yPosition);
        
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);
        yPosition += 10;
        
        if (currentDesign.materials) {
          pdf.text(`Main Structure: ${currentDesign.materials.structure || 'Wood'}`, 20, yPosition);
          
          yPosition += 8;
          pdf.text(`Color: ${currentDesign.materials.color || 'Natural'}`, 20, yPosition);
          
          if (currentDesign.materials.finish) {
            yPosition += 8;
            pdf.text(`Finish: ${currentDesign.materials.finish}`, 20, yPosition);
          }
        }
        
        yPosition += 15;
      }
      
      // Add price if selected
      if (pdfOptions.includePrice && currentDesign.price) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text('Pricing', 20, yPosition);
        
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);
        yPosition += 10;
        pdf.text(`Estimated Price: $${currentDesign.price.toFixed(2)}`, 20, yPosition);
        
        yPosition += 8;
        pdf.text('*Price is an estimate and may vary based on installation requirements', 20, yPosition);
      }
      
      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text('© 3D Pergola Visualizer - www.pergolavisualizer.com', 20, pdf.internal.pageSize.getHeight() - 10);
      }
      
      setExportProgress(95);
      
      // Save the PDF
      pdf.save(`${pdfOptions.fileName.replace(/\s+/g, '_')}.pdf`);
      
      setExportProgress(100);
      setExportComplete(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportComplete(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
      setIsExporting(false);
      setExportProgress(0);
    }
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
        className="bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-medium text-white">Export as PDF</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            disabled={isExporting}
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form ref={formRef} className="space-y-6">
            {/* File Name */}
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium text-gray-300 mb-1">
                PDF File Name
              </label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                value={pdfOptions.fileName}
                onChange={handleOptionChange}
                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Pergola Design"
                disabled={isExporting}
              />
            </div>
            
            {/* Orientation */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Page Orientation
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="orientation"
                    value="portrait"
                    checked={pdfOptions.orientation === 'portrait'}
                    onChange={handleOptionChange}
                    className="mr-2"
                    disabled={isExporting}
                  />
                  <span className="text-white">Portrait</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="orientation"
                    value="landscape"
                    checked={pdfOptions.orientation === 'landscape'}
                    onChange={handleOptionChange}
                    className="mr-2"
                    disabled={isExporting}
                  />
                  <span className="text-white">Landscape</span>
                </label>
              </div>
            </div>
            
            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Include in PDF
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeSpecs"
                    checked={pdfOptions.includeSpecs}
                    onChange={handleOptionChange}
                    className="mr-2"
                    disabled={isExporting}
                  />
                  <span className="text-white">Specifications (dimensions, style)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeMaterials"
                    checked={pdfOptions.includeMaterials}
                    onChange={handleOptionChange}
                    className="mr-2"
                    disabled={isExporting}
                  />
                  <span className="text-white">Materials & Finishes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includePrice"
                    checked={pdfOptions.includePrice}
                    onChange={handleOptionChange}
                    className="mr-2"
                    disabled={isExporting}
                  />
                  <span className="text-white">Estimated Price</span>
                </label>
              </div>
            </div>
            
            {/* Preview Image */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Preview</h3>
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center overflow-hidden">
                {canvasRef && canvasRef.current ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <p className="text-white/70 text-sm">Your current 3D view will be captured</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/50">3D view not available</p>
                )}
              </div>
            </div>
            
            {/* Export Button or Progress */}
            {isExporting ? (
              <div className="space-y-3">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-white/70 text-sm">
                  {exportComplete ? 'PDF exported successfully!' : `Exporting PDF... ${exportProgress}%`}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleExport}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
              >
                {exportComplete ? (
                  <>
                    <CheckIcon className="w-5 h-5 mr-2" />
                    PDF Exported Successfully
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Export PDF
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PDFExportPanel;
