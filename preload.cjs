// This file provides a more comprehensive preload script for Electron
// It exposes necessary APIs to the renderer process in a secure way

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    // Notification API
    notifyArtifactGenerated: (artifactData) => {
      ipcRenderer.send('artifact-generated', artifactData);
    },
    
    // App info API
    getAppVersion: () => {
      return process.env.npm_package_version;
    },
    
    // Platform info
    getPlatform: () => {
      return process.platform;
    },
    
    // Check if app is in development mode
    isDev: () => {
      return process.env.NODE_ENV === 'development';
    },
    
    // Add scrollbar configuration
    setScrollbarStyle: () => {
      const style = document.createElement('style');
      style.textContent = `
        /* Always reserve space for scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        /* Show scrollbar when scrolling */
        *:hover::-webkit-scrollbar,
        *:focus::-webkit-scrollbar,
        *:active::-webkit-scrollbar,
        *:focus-within::-webkit-scrollbar {
          opacity: 1;
        }
        
        /* Scrollbar track */
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        /* Scrollbar thumb */
        ::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.15);
          border-radius: 4px;
          height: 15px; /* 1.5cm height */
        }
        
        /* Scrollbar thumb on hover */
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.25);
        }
        
        /* Horizontal scrollbar */
        ::-webkit-scrollbar:horizontal {
          height: 8px;
        }
        
        /* Vertical scrollbar */
        ::-webkit-scrollbar:vertical {
          width: 8px;
        }

        /* Add scroll event listener to show scrollbar while scrolling */
        * {
          scrollbar-gutter: stable;
        }
      `;
      document.head.appendChild(style);
    }
  }
);
