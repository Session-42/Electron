// Test script to verify the Electron app functionality
// This will help us test the notification system

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;
let testWindow;

function createMainWindow() {
  // Create the main browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  // Open DevTools
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTestWindow() {
  // Create a test window for simulating notifications
  testWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load test HTML
  testWindow.loadFile(path.join(__dirname, 'test', 'test.html'));
  
  // Open DevTools
  testWindow.webContents.openDevTools();

  // Emitted when the window is closed
  testWindow.on('closed', () => {
    testWindow = null;
  });
}

// Create windows when Electron has finished initialization
app.whenReady().then(() => {
  createMainWindow();
  createTestWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      createTestWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Forward test notifications to the main window
ipcMain.on('test-notification', (event, artifactData) => {
  if (mainWindow) {
    mainWindow.webContents.send('test-artifact-generated', artifactData);
  }
});
