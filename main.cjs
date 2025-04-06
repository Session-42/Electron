// This file enhances the main Electron process with additional notification features

const { app, BrowserWindow, ipcMain, Notification, Menu, Tray, shell, session } = require('electron');
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
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        transparent: true,
        visualEffectState: 'active',
        vibrancy: 'under-window',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.cjs'),
            enableBlinkFeatures: 'OverlayScrollbars',
            overlayScrollbars: true
        },
        icon: path.join(__dirname, 'assets/icons/mac.icns'),
        backgroundColor: '#ffffff',
        trafficLightPosition: { x: 20, y: 20 }
    });

    mainWindow.setMenu(null);

    // Handle navigation
    mainWindow.webContents.on('will-navigate', (event, url) => {
        console.log('Navigation:', url);
        
        if (url.includes('/login')) {
            session.defaultSession.cookies.get({})
                .then(cookies => {
                    const hasAuthCookie = cookies.some(cookie => 
                        cookie.domain === '.hitcraft.ai' && 
                        (cookie.name === 'sessionToken' || cookie.name.includes('auth'))
                    );
                    
                    if (hasAuthCookie) {
                        event.preventDefault();
                        mainWindow.loadURL('https://app.hitcraft.ai');
                    }
                });
        }
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.includes('accounts.google.com') || 
            url.includes('auth.hitcraft.ai') ||
            url.includes('app.hitcraft.ai')) {
            return { action: 'allow' };
        }
        shell.openExternal(url);
        return { action: 'deny' };
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173/login');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL('https://hitcraft.ai/login');
    }

    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
        return true;
    });

    mainWindow.webContents.on('did-navigate', (event, url) => {
        console.log('URL changed:', url);
        if (url.includes('/login')) {
            session.defaultSession.cookies.get({})
                .then(cookies => {
                    const hasAuthCookie = cookies.some(cookie => 
                        cookie.domain === '.hitcraft.ai' && 
                        (cookie.name === 'sessionToken' || cookie.name.includes('auth'))
                    );
                    
                    if (hasAuthCookie) {
                        mainWindow.loadURL('https://app.hitcraft.ai');
                    }
                });
        }
    });

    mainWindow.webContents.on('page-title-updated', (event, title) => {
        logDebug('Page title updated:', title);
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        logDebug('Page failed to load:', errorCode, errorDescription);
    });

    mainWindow.on('focus', () => isAppFocused = true);
    mainWindow.on('blur', () => isAppFocused = false);

    // Apply only the scrollbar styling
    mainWindow.webContents.on('did-finish-load', () => {
        // Add only scrollbar styling - no header/padding changes
        mainWindow.webContents.insertCSS(`
            /* Basic scrollbar that works with your app */
            ::-webkit-scrollbar {
                width: 8px;
                background-color: transparent;
            }
            
            ::-webkit-scrollbar-track {
                background-color: transparent;
            }
            
            /* Scrollbar thumb with 40px gap at top */
            ::-webkit-scrollbar-thumb {
                background-color: transparent;
                border-radius: 4px;
                height: calc(100% - 40px);
                margin-top: 40px;
            }
            
            /* Show scrollbar only when scrolling or hovering */
            :hover::-webkit-scrollbar-thumb,
            .scrolling::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.15);
            }
        `);

        // Just the scroll detection
        mainWindow.webContents.executeJavaScript(`
            // Track scrolling state for styling
            let scrollTimeout;
            
            function handleScroll() {
                document.body.classList.add('scrolling');
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    document.body.classList.remove('scrolling');
                }, 1000);
            }
            
            // Attach to document scroll
            document.addEventListener('scroll', handleScroll, { passive: true });
        `);
    });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets/icons/mac.icns');
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

app.whenReady().then(() => {
  createWindow();
  createTray();

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, 'assets/icons/mac.icns'));
  }

  session.defaultSession.clearStorageData({ storages: ['cookies'] });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else {
        mainWindow.show();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('artifact-generated', (event, artifactData) => {
  if (!isAppFocused) {
    const notification = new Notification({
      title: 'New Artifact Generated',
      body: artifactData.message || 'A new artifact has been generated',
      icon: path.join(__dirname, 'assets/icons/mac.icns')
    });
    
    notification.show();
    
    notification.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
          mainWindow.show();
        }
        mainWindow.focus();
      }
    });
  }
});