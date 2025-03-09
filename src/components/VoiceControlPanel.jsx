import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, XMarkIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

/**
 * VoiceControlPanel Component
 * Provides voice command functionality for controlling the pergola design
 */
const VoiceControlPanel = ({ 
  isOpen, 
  onClose, 
  onApplyCommand,
  currentDesign
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [availableCommands, setAvailableCommands] = useState([
    { command: "Change color to [color]", description: "Changes the pergola color" },
    { command: "Set height to [number] meters", description: "Adjusts the pergola height" },
    { command: "Set width to [number] meters", description: "Adjusts the pergola width" },
    { command: "Set length to [number] meters", description: "Adjusts the pergola length" },
    { command: "Change material to [material]", description: "Changes the pergola material" },
    { command: "Add roof", description: "Adds a roof to the pergola" },
    { command: "Remove roof", description: "Removes the roof from the pergola" },
    { command: "Rotate [left/right]", description: "Rotates the pergola view" },
    { command: "Reset view", description: "Resets the camera view" },
    { command: "Save design", description: "Saves the current design" }
  ]);

  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (isOpen) {
      // Check if browser supports speech recognition
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
          
          // Process command when confidence is high enough
          if (event.results[current].isFinal && event.results[current][0].confidence > 0.7) {
            processCommand(transcriptText);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setFeedback(`Error: ${event.error}. Please try again.`);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            // Restart if we're supposed to be listening but it ended
            recognitionRef.current.start();
          }
        };
      } else {
        setFeedback('Speech recognition is not supported in your browser.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, isListening]);

  // Process the voice command
  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Add to history
    setCommandHistory(prev => [{ text: command, timestamp: new Date() }, ...prev.slice(0, 9)]);
    
    // Process color commands
    if (lowerCommand.includes('change color to')) {
      const colorMatch = lowerCommand.match(/change color to (\w+)/);
      if (colorMatch && colorMatch[1]) {
        const color = colorMatch[1];
        setFeedback(`Changing color to ${color}`);
        onApplyCommand({ type: 'changeColor', value: color });
        return;
      }
    }
    
    // Process dimension commands
    if (lowerCommand.includes('set height to')) {
      const heightMatch = lowerCommand.match(/set height to (\d+(\.\d+)?)/);
      if (heightMatch && heightMatch[1]) {
        const height = parseFloat(heightMatch[1]);
        setFeedback(`Setting height to ${height} meters`);
        onApplyCommand({ type: 'setDimension', dimension: 'height', value: height });
        return;
      }
    }
    
    if (lowerCommand.includes('set width to')) {
      const widthMatch = lowerCommand.match(/set width to (\d+(\.\d+)?)/);
      if (widthMatch && widthMatch[1]) {
        const width = parseFloat(widthMatch[1]);
        setFeedback(`Setting width to ${width} meters`);
        onApplyCommand({ type: 'setDimension', dimension: 'width', value: width });
        return;
      }
    }
    
    if (lowerCommand.includes('set length to')) {
      const lengthMatch = lowerCommand.match(/set length to (\d+(\.\d+)?)/);
      if (lengthMatch && lengthMatch[1]) {
        const length = parseFloat(lengthMatch[1]);
        setFeedback(`Setting length to ${length} meters`);
        onApplyCommand({ type: 'setDimension', dimension: 'length', value: length });
        return;
      }
    }
    
    // Process material commands
    if (lowerCommand.includes('change material to')) {
      const materialMatch = lowerCommand.match(/change material to (\w+)/);
      if (materialMatch && materialMatch[1]) {
        const material = materialMatch[1];
        setFeedback(`Changing material to ${material}`);
        onApplyCommand({ type: 'changeMaterial', value: material });
        return;
      }
    }
    
    // Process roof commands
    if (lowerCommand.includes('add roof')) {
      setFeedback('Adding roof to pergola');
      onApplyCommand({ type: 'toggleRoof', value: true });
      return;
    }
    
    if (lowerCommand.includes('remove roof')) {
      setFeedback('Removing roof from pergola');
      onApplyCommand({ type: 'toggleRoof', value: false });
      return;
    }
    
    // Process rotation commands
    if (lowerCommand.includes('rotate left')) {
      setFeedback('Rotating view left');
      onApplyCommand({ type: 'rotate', direction: 'left' });
      return;
    }
    
    if (lowerCommand.includes('rotate right')) {
      setFeedback('Rotating view right');
      onApplyCommand({ type: 'rotate', direction: 'right' });
      return;
    }
    
    // Process view reset
    if (lowerCommand.includes('reset view')) {
      setFeedback('Resetting camera view');
      onApplyCommand({ type: 'resetView' });
      return;
    }
    
    // Process save command
    if (lowerCommand.includes('save design')) {
      setFeedback('Saving current design');
      onApplyCommand({ type: 'saveDesign' });
      return;
    }
    
    // If we get here, command wasn't recognized
    setFeedback(`Sorry, I didn't understand "${command}". Please try again.`);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setFeedback('Voice recognition paused. Click the microphone to resume.');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setFeedback('Listening... Say a command.');
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          setFeedback(`Error: ${error.message}. Please try again.`);
        }
      }
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
        className="bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <SpeakerWaveIcon className="w-5 h-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-medium text-white">Voice Control</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voice Control Section */}
            <div className="space-y-6">
              {/* Microphone Button */}
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <MicrophoneIcon className="w-10 h-10 text-white" />
                </button>
                <p className="mt-3 text-sm text-white/70">
                  {isListening ? 'Tap to stop' : 'Tap to start'}
                </p>
              </div>
              
              {/* Transcript and Feedback */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-2">Transcript</h3>
                <div className="h-16 bg-black/30 rounded-lg p-3 text-white overflow-y-auto mb-4">
                  {transcript || <span className="text-white/30">Your speech will appear here...</span>}
                </div>
                
                <h3 className="text-sm font-medium text-white/70 mb-2">Feedback</h3>
                <div className="h-12 bg-black/30 rounded-lg p-3 text-white overflow-y-auto">
                  {feedback || <span className="text-white/30">Command feedback will appear here...</span>}
                </div>
              </div>
              
              {/* Command History */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-2">Command History</h3>
                <div className="h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {commandHistory.length > 0 ? (
                    <ul className="space-y-2">
                      {commandHistory.map((item, index) => (
                        <li key={index} className="text-sm">
                          <span className="text-white/70">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-white ml-2">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/30 text-center py-4">No commands yet</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Available Commands Section */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white/70 mb-4">Available Commands</h3>
              <div className="h-96 overflow-y-auto pr-2 custom-scrollbar">
                <ul className="space-y-3">
                  {availableCommands.map((cmd, index) => (
                    <li key={index} className="bg-black/30 rounded-lg p-3">
                      <p className="text-blue-400 font-medium">{cmd.command}</p>
                      <p className="text-white/70 text-sm mt-1">{cmd.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoiceControlPanel;
