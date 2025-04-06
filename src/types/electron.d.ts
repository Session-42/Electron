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

declare module 'electron' {
  export const ipcRenderer: {
    send: (channel: string, ...args: any[]) => void;
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
    removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
  };
}
