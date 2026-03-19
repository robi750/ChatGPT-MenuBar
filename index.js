const { app, BrowserWindow, Tray, Menu, nativeImage, shell, screen } = require('electron');
const path = require('path');

let tray = null;
let win = null;

app.on('ready', () => {
  // Load and resize tray icon
  let iconPath = path.join(__dirname, 'images/icon.png');
  let trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 20, height: 20 });

  // Create Tray
  tray = new Tray(trayIcon);

  // Create hidden BrowserWindow
  win = new BrowserWindow({
    width: 630,  // requested width
    height: 630, // requested height
    show: false,
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Keep window on all desktops / spaces
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Load ChatGPT
  win.loadURL('https://chat.openai.com/');

  // Fix zoom & padding to prevent list numbers being cut off
  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomLevel(-1); // slightly smaller
    win.webContents.insertCSS(`
      body {
        padding-left: 8px !important;
      }
      ol, ul {
        margin-left: 8px !important;
      }
    `);
  });

  // Left-click: toggle ChatGPT window
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      const display = screen.getPrimaryDisplay();
      const { width: screenWidth } = display.workArea;

      // Position top-right corner
      const x = screenWidth - win.getBounds().width - 10; // 10px margin
      const y = 10; // 10px margin from top
      win.setBounds({ x, y, width: 500, height: 630 });
      win.show();
      win.focus();
    }
  });

  // Right-click: context menu (Quit / GitHub)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About / GitHub',
      click: () => shell.openExternal('https://github.com/robi750/ChatGPT-MenuBar')
    },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ]);

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });

  tray.setToolTip('ChatGPT MenuBar');
});