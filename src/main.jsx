import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'
import './styles/scrollbar.css'

// Error handling for React rendering
const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      // Removing StrictMode as it can cause double-rendering and issues with Three.js
      <App />
    );
  } catch (error) {
    console.error('Error rendering application:', error);
    // Display fallback UI in case of critical error
    document.getElementById('root').innerHTML = `
      <div style="padding: 20px; text-align: center; color: white;">
        <h2>Something went wrong</h2>
        <p>Please refresh the page to try again.</p>
        <pre style="text-align: left; margin-top: 20px; font-size: 12px; color: #ff6b6b;">${error.message}</pre>
      </div>
    `;
  }
};

// Initialize the application
renderApp();
