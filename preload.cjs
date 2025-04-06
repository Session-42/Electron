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
    }
  }
);
