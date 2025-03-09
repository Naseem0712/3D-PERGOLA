import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, StopIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * VoiceCommandControl Component
 * Provides voice command functionality for controlling the pergola design
 */
const VoiceCommandControl = ({ 
  isOpen, 
  onClose, 
  onCommandRecognized,
  onDimensionChange,
  onMaterialChange,
  onEnvironmentChange,
  onGlassChange,
  currentDesign
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [supportedCommands, setSupportedCommands] = useState([]);
  const recognitionRef = useRef(null);

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        // Process command when we have a final result
        if (event.results[current].isFinal) {
          processCommand(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setFeedback(`Error: ${event.error}. Please try again.`);
        setIsListening(false);
      };

      // Define supported commands
      setSupportedCommands([
        { command: "set height to [number] meters", description: "Change pergola height" },
        { command: "set width to [number] meters", description: "Change pergola width" },
        { command: "set length to [number] meters", description: "Change pergola length" },
        { command: "change material to [wood/aluminum/iron/wpc]", description: "Change pergola material" },
        { command: "set color to [color name]", description: "Change material color" },
        { command: "add glass", description: "Add glass to the pergola" },
        { command: "remove glass", description: "Remove glass from the pergola" },
        { command: "change environment to [sunset/dawn/night/etc]", description: "Change the environment" },
        { command: "reset design", description: "Reset to default design" },
        { command: "help", description: "List available commands" }
      ]);
    } else {
      setFeedback("Speech recognition is not supported in your browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start/stop listening for voice commands
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setFeedback("Voice recognition stopped.");
    } else {
      try {
        recognitionRef.current.start();
        setFeedback("Listening for commands...");
      } catch (error) {
        console.error('Speech recognition error', error);
        setFeedback(`Error starting speech recognition: ${error.message}`);
      }
    }
    setIsListening(!isListening);
  };

  // Process voice commands
  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Add to command history
    setCommandHistory(prev => [...prev.slice(-4), { text: lowerCommand, timestamp: new Date() }]);
    
    // Process dimension changes
    const heightMatch = lowerCommand.match(/set height to (\d+\.?\d*)\s*(meter|meters|m)?/);
    const widthMatch = lowerCommand.match(/set width to (\d+\.?\d*)\s*(meter|meters|m)?/);
    const lengthMatch = lowerCommand.match(/set length to (\d+\.?\d*)\s*(meter|meters|m)?/);
    
    if (heightMatch) {
      const height = parseFloat(heightMatch[1]);
      if (!isNaN(height) && height > 0 && height <= 5) {
        onDimensionChange({ ...currentDesign.dimensions, height });
        setFeedback(`Height set to ${height} meters.`);
        return;
      } else {
        setFeedback("Please specify a valid height between 0 and 5 meters.");
        return;
      }
    }
    
    if (widthMatch) {
      const width = parseFloat(widthMatch[1]);
      if (!isNaN(width) && width > 0 && width <= 8) {
        onDimensionChange({ ...currentDesign.dimensions, width });
        setFeedback(`Width set to ${width} meters.`);
        return;
      } else {
        setFeedback("Please specify a valid width between 0 and 8 meters.");
        return;
      }
    }
    
    if (lengthMatch) {
      const length = parseFloat(lengthMatch[1]);
      if (!isNaN(length) && length > 0 && length <= 10) {
        onDimensionChange({ ...currentDesign.dimensions, length });
        setFeedback(`Length set to ${length} meters.`);
        return;
      } else {
        setFeedback("Please specify a valid length between 0 and 10 meters.");
        return;
      }
    }
    
    // Process material changes
    if (lowerCommand.includes("change material to") || lowerCommand.includes("set material to")) {
      if (lowerCommand.includes("wood")) {
        onMaterialChange("wood");
        setFeedback("Material changed to wood.");
        return;
      } else if (lowerCommand.includes("aluminum") || lowerCommand.includes("aluminium")) {
        onMaterialChange("aluminium");
        setFeedback("Material changed to aluminum.");
        return;
      } else if (lowerCommand.includes("iron")) {
        onMaterialChange("iron");
        setFeedback("Material changed to iron.");
        return;
      } else if (lowerCommand.includes("wpc")) {
        onMaterialChange("wpc");
        setFeedback("Material changed to WPC (Wood Plastic Composite).");
        return;
      } else {
        setFeedback("Please specify a valid material: wood, aluminum, iron, or wpc.");
        return;
      }
    }
    
    // Process color changes
    if (lowerCommand.includes("set color to") || lowerCommand.includes("change color to")) {
      const colorMap = {
        "black": "#000000",
        "white": "#FFFFFF",
        "gray": "#808080",
        "silver": "#C0C0C0",
        "red": "#FF0000",
        "blue": "#0000FF",
        "green": "#008000",
        "brown": "#8B4513",
        "dark brown": "#5D4037",
        "light brown": "#A1887F",
        "dark gray": "#404040",
        "light gray": "#D3D3D3"
      };
      
      for (const [colorName, colorHex] of Object.entries(colorMap)) {
        if (lowerCommand.includes(colorName)) {
          onMaterialChange(currentDesign.material, colorHex);
          setFeedback(`Color changed to ${colorName}.`);
          return;
        }
      }
      
      setFeedback("Please specify a valid color like black, white, gray, silver, red, blue, green, or brown.");
      return;
    }
    
    // Process glass commands
    if (lowerCommand.includes("add glass") || lowerCommand.includes("enable glass")) {
      onGlassChange({ ...currentDesign.glass, visible: true, applied: true });
      setFeedback("Glass added to the pergola.");
      return;
    }
    
    if (lowerCommand.includes("remove glass") || lowerCommand.includes("disable glass")) {
      onGlassChange({ ...currentDesign.glass, visible: false, applied: false });
      setFeedback("Glass removed from the pergola.");
      return;
    }
    
    // Process environment changes
    if (lowerCommand.includes("change environment to") || lowerCommand.includes("set environment to")) {
      const environments = [
        "sunset", "dawn", "night", "warehouse", "forest", 
        "apartment", "studio", "city", "park", "lobby"
      ];
      
      for (const env of environments) {
        if (lowerCommand.includes(env)) {
          onEnvironmentChange(env);
          setFeedback(`Environment changed to ${env}.`);
          return;
        }
      }
      
      setFeedback("Please specify a valid environment like sunset, dawn, night, forest, city, etc.");
      return;
    }
    
    // Handle help command
    if (lowerCommand.includes("help") || lowerCommand.includes("what can you do")) {
      setFeedback("Here are some commands you can try:");
      return;
    }
    
    // Handle reset command
    if (lowerCommand.includes("reset design") || lowerCommand.includes("start over")) {
      onCommandRecognized("reset");
      setFeedback("Design has been reset to default.");
      return;
    }
    
    // If no command matched
    setFeedback("Sorry, I didn't understand that command. Try saying 'help' for a list of commands.");
  };

  // Format timestamp for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-40 w-96 bg-black/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <MicrophoneIcon className={`w-5 h-5 mr-2 ${isListening ? 'text-red-500' : 'text-white'}`} />
            Voice Commands
          </h3>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close voice command panel"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Transcript display */}
        <div className="bg-black/40 rounded-lg p-3 mb-4 min-h-[60px] border border-white/10">
          <p className="text-white/80 text-sm">
            {transcript || (isListening ? "Listening..." : "Press the microphone button and speak a command")}
          </p>
        </div>
        
        {/* Feedback display */}
        <div className="mb-4">
          <p className="text-white/90 font-medium">{feedback}</p>
        </div>
        
        {/* Command history */}
        {commandHistory.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white/70 mb-2">Recent Commands:</h4>
            <div className="bg-black/40 rounded-lg border border-white/10 overflow-hidden">
              {commandHistory.map((cmd, index) => (
                <div 
                  key={index} 
                  className="px-3 py-2 text-sm border-b border-white/5 last:border-b-0 flex justify-between"
                >
                  <span className="text-white/80">{cmd.text}</span>
                  <span className="text-white/50 text-xs">{formatTime(cmd.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Supported commands */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white/70 mb-2">Try saying:</h4>
          <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {supportedCommands.map((cmd, index) => (
              <div 
                key={index} 
                className="px-3 py-1.5 text-sm bg-white/5 rounded-md"
              >
                <span className="text-blue-400">{cmd.command}</span>
                <span className="text-white/50 text-xs block">{cmd.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Control buttons */}
      <div className="bg-white/5 p-4 flex justify-between items-center">
        <div className="text-xs text-white/50">
          {isListening ? "Listening for commands..." : "Voice recognition ready"}
        </div>
        
        <button
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600'
          }`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <StopIcon className="w-6 h-6 text-white" />
          ) : (
            <MicrophoneIcon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default VoiceCommandControl;
