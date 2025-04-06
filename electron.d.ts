// This file provides TypeScript definitions for the Electron APIs exposed through preload.js
interface ElectronAPI {
  notifyArtifactGenerated: (artifactData: {
    type: string;
    message: string;
    artifactId?: string;
  }) => void;
}

interface Window {
  electron: ElectronAPI;
}
