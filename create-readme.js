const fs = require('fs');
const path = require('path');

// Create a README file for the Electron app
const readmeContent = `# Hitcraft Desktop Application

This is an Electron-based desktop application for Hitcraft with native desktop notifications.

## Features

- Native desktop notifications for artifact generation when you're not active in the app
- System tray integration for a true native experience
- Cross-platform support (Windows, macOS, Linux)
- Minimizes to tray instead of closing when the window is closed

## Development

### Prerequisites

- Node.js 20.0.0 or higher
- npm 

### Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Run in development mode:
   \`\`\`
   npm run dev
   \`\`\`

3. Test notification system:
   \`\`\`
   npm test
   \`\`\`

### Building

Build for all platforms:
\`\`\`
npm run build
\`\`\`

Build for specific platforms:
\`\`\`
npm run dist:mac
npm run dist:win
npm run dist:linux
\`\`\`

## Notification System

The app provides native desktop notifications when artifacts are generated while you're not actively using the application. Supported artifact types include:

- Audio uploads
- Quantization completion
- Mixing completion
- Stem separation
- Song rendering
- Song composition
- Lyrics writing

## System Tray

The application minimizes to the system tray when closed. You can:
- Double-click the tray icon to show the application
- Right-click for a context menu with options to open or quit the application
`;

// Write the README file
fs.writeFileSync(path.join(__dirname, 'README.md'), readmeContent);

console.log('README.md created successfully.');
