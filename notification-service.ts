// This file provides a wrapper for the Electron notification API
// It gracefully falls back to browser notifications when running in browser mode

// Type definition for notification data
export interface ArtifactNotificationData {
  type: string;
  message: string;
  artifactId?: string;
}

// Check if running in Electron environment
const isElectron = (): boolean => {
  return window.electron !== undefined;
};

// Function to send a notification
export const sendNotification = (data: ArtifactNotificationData): void => {
  if (isElectron()) {
    // Use Electron's notification system
    window.electron.notifyArtifactGenerated(data);
  } else {
    // Fallback to browser notifications when running in browser
    if ('Notification' in window) {
      // Check if permission is granted
      if (Notification.permission === 'granted') {
        new Notification('Hitcraft', {
          body: data.message,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Hitcraft', {
              body: data.message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  }
};

// Export a notification service object
export const NotificationService = {
  sendNotification,
  isElectron
};
