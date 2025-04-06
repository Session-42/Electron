// This file enhances the main Electron process with additional notification features

const { app, BrowserWindow, ipcMain, Notification, Menu, Tray } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let tray = null;
let isQuitting = false;

// Track if the app is in focus
let isAppFocused = true;

function logDebug(message, ...args) {
    console.log(`[DEBUG] ${message}`, ...args);
}

function createWindow() {
    logDebug('Creating window with environment:', process.env.NODE_ENV);
    logDebug('Current directory:', __dirname);
    logDebug('App path:', app.getAppPath());
    logDebug('Resource path:', process.resourcesPath);

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        icon: path.join(__dirname, 'icon.icns')
    });

    // Add console logging to the renderer process
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        logDebug('Renderer Console:', { level, message, line, sourceId });
    });

    // Add error handling
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        logDebug('Failed to load:', { errorCode, errorDescription });
    });

    if (isDev) {
        logDebug('Loading dev server URL');
        mainWindow.loadURL('http://localhost:5173');
    } else {
        // Try multiple paths in order
        const possiblePaths = [
            path.join(__dirname, 'dist', 'index.html'),
            path.join(app.getAppPath(), 'dist', 'index.html'),
            path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html'),
            path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html')
        ];

        logDebug('Checking possible index.html locations:');
        possiblePaths.forEach(p => {
            logDebug(`- ${p} exists:`, fs.existsSync(p));
            if (fs.existsSync(p)) {
                logDebug(`Directory contents of ${path.dirname(p)}:`, fs.readdirSync(path.dirname(p)));
            }
        });

        const indexPath = possiblePaths.find(p => fs.existsSync(p));
        
        if (indexPath) {
            logDebug('Loading index.html from:', indexPath);
            mainWindow.loadFile(indexPath, {
                search: `timestamp=${Date.now()}`  // Prevent caching
            }).catch(err => {
                logDebug('Error loading index.html:', err);
            });
        } else {
            logDebug('Could not find index.html in any location');
            mainWindow.webContents.openDevTools();
        }
    }

    // Always open DevTools for debugging
    mainWindow.webContents.openDevTools();

    // Log page title changes
    mainWindow.webContents.on('page-title-updated', (event, title) => {
        logDebug('Page title updated:', title);
    });

    // Log navigation events
    mainWindow.webContents.on('did-start-loading', () => {
        logDebug('Page started loading');
    });

    mainWindow.webContents.on('did-finish-load', () => {
        logDebug('Page finished loading');
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        logDebug('Page failed to load:', errorCode, errorDescription);
    });

    mainWindow.on('focus', () => isAppFocused = true);
    mainWindow.on('blur', () => isAppFocused = false);

    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
        return true;
    });
}

// Create tray icon and menu
function createTray() {
  const iconPath = path.join(__dirname, 'icon.icns');
  if (!fs.existsSync(iconPath)) {
    console.error('Tray icon not found at:', iconPath);
    return;
  }

  try {
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: 'Open HitCraft', 
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        } 
      },
      { 
        label: 'Quit', 
        click: () => {
          isQuitting = true;
          app.quit();
        } 
      }
    ]);
    
    tray.setToolTip('HitCraft');
    tray.setContextMenu(contextMenu);
    
    // Double-click on tray icon to show the app
    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (error) {
    console.error('Failed to create tray:', error);
  }
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle the quit event properly
app.on('before-quit', () => {
  isQuitting = true;
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle artifact generation notifications
ipcMain.on('artifact-generated', (event, artifactData) => {
  if (!isAppFocused) {
    const notification = new Notification({
      title: 'New Artifact Generated',
      body: artifactData.message || 'A new artifact has been generated',
      icon: path.join(__dirname, 'icon.icns')
    });
    
    notification.show();
    
    notification.on('click', () => {
      // Focus the window when notification is clicked
      if (mainWindow) {
        if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
          mainWindow.show();
        }
        mainWindow.focus();
      }
    });
  }
});
