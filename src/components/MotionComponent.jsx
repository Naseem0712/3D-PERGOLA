import React from 'react';
import { motion } from 'framer-motion';

export default function MotionComponent({ children, title, className = '' }) {
  // Animation variants - simplified
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`bg-black/30 backdrop-blur-xl rounded-xl p-2 border border-white/10 ${className}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {title && (
        <p className="text-xs text-white/70 mb-1 text-center">
          {title}
        </p>
      )}
      <div className="flex flex-col space-y-2">
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
