import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, XMarkIcon, ArrowDownTrayIcon, CameraIcon } from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * PDFExport Component
 * Allows users to export their pergola design as a PDF document
 */
const PDFExport = ({ 
  isOpen, 
  onClose, 
  currentDesign,
  modelRef,
  captureScreenshot
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [pdfName, setPdfName] = useState('My Pergola Design');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeMaterials, setIncludeMaterials] = useState(true);
  const [includeRenderImage, setIncludeRenderImage] = useState(true);
  
  const formRef = useRef(null);
  
  // Generate a screenshot of the current design
  const generateScreenshot = async () => {
    if (captureScreenshot) {
      try {
        const imageData = await captureScreenshot();
        setPreviewImage(imageData);
        return imageData;
      } catch (error) {
        console.error('Error capturing screenshot:', error);
        return null;
      }
    } else if (modelRef && modelRef.current) {
      try {
        const canvas = await html2canvas(modelRef.current);
        const imageData = canvas.toDataURL('image/png');
        setPreviewImage(imageData);
        return imageData;
      } catch (error) {
        console.error('Error capturing canvas:', error);
        return null;
      }
    }
    return null;
  };
  
  // Format material name for display
  const formatMaterialName = (material) => {
    if (!material) return 'Not specified';
    return material.charAt(0).toUpperCase() + material.slice(1);
  };
  
  // Format color for display
  const formatColor = (hexColor) => {
    if (!hexColor) return 'Not specified';
    
    // Map of common hex colors to names
    const colorNames = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#808080': 'Gray',
      '#C0C0C0': 'Silver',
      '#FF0000': 'Red',
      '#0000FF': 'Blue',
      '#008000': 'Green',
      '#8B4513': 'Brown',
      '#5D4037': 'Dark Brown',
      '#A1887F': 'Light Brown',
      '#404040': 'Dark Gray',
      '#D3D3D3': 'Light Gray'
    };
    
    return colorNames[hexColor.toUpperCase()] || hexColor;
  };
  
  // Generate and download PDF
  const generatePDF = async () => {
    if (!currentDesign) return;
    
    setIsGenerating(true);
    setProgress(10);
    
    try {
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text(pdfName, 20, 20);
      
      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
      
      setProgress(30);
      
      // Add design image if requested
      if (includeRenderImage) {
        const imageData = previewImage || await generateScreenshot();
        if (imageData) {
          pdf.addImage(imageData, 'PNG', 20, 40, 170, 100);
        }
      }
      
      setProgress(60);
      
      // Add design details if requested
      let yPosition = includeRenderImage ? 150 : 40;
      
      if (includeDetails) {
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Design Specifications', 20, yPosition);
        
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        
        yPosition += 10;
        pdf.text(`Dimensions:`, 20, yPosition);
        yPosition += 6;
        pdf.text(`• Length: ${currentDesign.dimensions.length} meters`, 25, yPosition);
        yPosition += 6;
        pdf.text(`• Width: ${currentDesign.dimensions.width} meters`, 25, yPosition);
        yPosition += 6;
        pdf.text(`• Height: ${currentDesign.dimensions.height} meters`, 25, yPosition);
        
        if (currentDesign.pillars) {
          yPosition += 10;
          pdf.text(`Pillars:`, 20, yPosition);
          yPosition += 6;
          pdf.text(`• Count: ${currentDesign.pillars.count}`, 25, yPosition);
          yPosition += 6;
          pdf.text(`• Size: ${currentDesign.pillars.size.width}m × ${currentDesign.pillars.size.depth}m`, 25, yPosition);
        }
        
        if (currentDesign.rafters) {
          yPosition += 10;
          pdf.text(`Rafters:`, 20, yPosition);
          yPosition += 6;
          pdf.text(`• Pattern: ${currentDesign.rafters.pattern || 'Standard'}`, 25, yPosition);
          
          if (currentDesign.rafters.leftToRight) {
            yPosition += 6;
            pdf.text(`• Left to Right: ${currentDesign.rafters.leftToRight.count} rafters`, 25, yPosition);
          }
          
          if (currentDesign.rafters.frontToBack) {
            yPosition += 6;
            pdf.text(`• Front to Back: ${currentDesign.rafters.frontToBack.count} rafters`, 25, yPosition);
          }
        }
      }
      
      setProgress(80);
      
      // Add materials section if requested
      if (includeMaterials) {
        yPosition += 15;
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Materials', 20, yPosition);
        
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        
        yPosition += 10;
        pdf.text(`• Primary Material: ${formatMaterialName(currentDesign.material)}`, 25, yPosition);
        
        yPosition += 6;
        pdf.text(`• Color: ${formatColor(currentDesign.materialColor)}`, 25, yPosition);
        
        if (currentDesign.glass && currentDesign.glass.applied) {
          yPosition += 6;
          pdf.text(`• Glass: ${currentDesign.glass.applied ? 'Yes' : 'No'}`, 25, yPosition);
          
          if (currentDesign.glass.applied) {
            yPosition += 6;
            pdf.text(`• Glass Color: ${formatColor(currentDesign.glass.color)}`, 25, yPosition);
            
            yPosition += 6;
            pdf.text(`• Glass Opacity: ${currentDesign.glass.opacity * 100}%`, 25, yPosition);
            
            if (currentDesign.glass.sides) {
              yPosition += 6;
              const glassSides = [];
              if (currentDesign.glass.sides.top) glassSides.push('Top');
              if (currentDesign.glass.sides.front) glassSides.push('Front');
              if (currentDesign.glass.sides.back) glassSides.push('Back');
              if (currentDesign.glass.sides.left) glassSides.push('Left');
              if (currentDesign.glass.sides.right) glassSides.push('Right');
              
              pdf.text(`• Glass Sides: ${glassSides.join(', ') || 'None'}`, 25, yPosition);
            }
          }
        }
      }
      
      setProgress(90);
      
      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text('Generated by 3D Pergola Visualizer | luxurypergola.com', pdf.internal.pageSize.getWidth() / 2, 287, { align: 'center' });
      }
      
      // Save the PDF
      pdf.save(`${pdfName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      setProgress(0);
      alert('There was an error generating your PDF. Please try again.');
    }
  };
  
  // Take a screenshot for the preview
  const handleTakeScreenshot = async () => {
    await generateScreenshot();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div className="relative w-full max-w-4xl mx-auto p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close PDF export"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="bg-black/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-semibold text-white">Export Design as PDF</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Form */}
              <div>
                <form ref={formRef} className="space-y-4">
                  <div>
                    <label htmlFor="pdfName" className="block text-sm font-medium text-white/70 mb-1">
                      PDF Name
                    </label>
                    <input
                      type="text"
                      id="pdfName"
                      value={pdfName}
                      onChange={(e) => setPdfName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                      placeholder="My Pergola Design"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      PDF Content
                    </label>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeRenderImage"
                        checked={includeRenderImage}
                        onChange={(e) => setIncludeRenderImage(e.target.checked)}
                        className="w-4 h-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="includeRenderImage" className="ml-2 text-sm text-white">
                        Include 3D Render Image
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeDetails"
                        checked={includeDetails}
                        onChange={(e) => setIncludeDetails(e.target.checked)}
                        className="w-4 h-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="includeDetails" className="ml-2 text-sm text-white">
                        Include Design Specifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeMaterials"
                        checked={includeMaterials}
                        onChange={(e) => setIncludeMaterials(e.target.checked)}
                        className="w-4 h-4 rounded border-white/30 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="includeMaterials" className="ml-2 text-sm text-white">
                        Include Materials Information
                      </label>
                    </div>
                  </div>
                  
                  {includeRenderImage && (
                    <div>
                      <button
                        type="button"
                        onClick={handleTakeScreenshot}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white flex items-center justify-center"
                      >
                        <CameraIcon className="w-5 h-5 mr-2" />
                        Take Screenshot for PDF
                      </button>
                    </div>
                  )}
                </form>
              </div>
              
              {/* Right column - Preview */}
              <div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-full">
                  <h3 className="text-lg font-medium text-white mb-3">PDF Preview</h3>
                  
                  {previewImage ? (
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={previewImage} 
                        alt="Design Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                      <p className="text-white/50">Screenshot preview will appear here</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-white/70">Document Title</h4>
                      <p className="text-white">{pdfName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-white/70">Content Sections</h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        {includeRenderImage && <li>• 3D Render Image</li>}
                        {includeDetails && <li>• Design Specifications</li>}
                        {includeMaterials && <li>• Materials Information</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              Cancel
            </button>
            
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg transition-colors text-white flex items-center ${
                isGenerating 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600'
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF ({progress}%)
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PDFExport;
