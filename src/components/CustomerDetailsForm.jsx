import React from 'react';
import { motion } from 'framer-motion';

export default function CustomerDetailsForm({ 
  customerDetails, 
  onCustomerDetailsChange, 
  onSubmit, 
  onCancel, 
  isExporting 
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onCustomerDetailsChange({
      ...customerDetails,
      [name]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-black/50 backdrop-blur-xl p-6 rounded-xl border border-white/10 w-full max-w-md"
    >
      <h3 className="text-xl font-medium text-white mb-4">ग्राहक विवरण भरें (Customer Details)</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            पूरा नाम (Full Name) *
          </label>
          <input
            type="text"
            name="name"
            value={customerDetails.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter customer's full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            पता (Address) *
          </label>
          <textarea
            name="address"
            value={customerDetails.address}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter customer's address"
            rows="2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            मोबाइल नंबर (Mobile Number) *
          </label>
          <input
            type="tel"
            name="mobile"
            value={customerDetails.mobile}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter customer's mobile number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            ईमेल (Email Address)
          </label>
          <input
            type="email"
            name="email"
            value={customerDetails.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter customer's email address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            अतिरिक्त जानकारी (Additional Information)
          </label>
          <textarea
            name="additionalInfo"
            value={customerDetails.additionalInfo}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional information or special requirements"
            rows="2"
          />
        </div>
        
        <div className="pt-4 flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            वापस (Back)
          </button>
          <button
            onClick={onSubmit}
            disabled={isExporting || !customerDetails.name || !customerDetails.address || !customerDetails.mobile}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>आगे बढ़ें (Next)</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
