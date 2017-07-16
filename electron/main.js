const path = require('path');
const fs = require('fs');
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
let appPath = path.resolve(app.getPath('userData'), 'appDB');

if ( !fs.existsSync( appPath ) ) {
	fs.mkdirSync( appPath );
}

process.env.PMAPP_DB_PATH = path.resolve(appPath, 'db.json');
const CreateDocumentBehaviour = require('./behaviours/createDocument');
// Report crashes to our server.
//electron.crashReporter.start();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

let shouldQuit = app.makeSingleInstance(function() {
  // Someone tried to run a second instance, we should focus our window
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	}
	return true;
});

if (shouldQuit) {
	app.quit();
}

if (process.platform === 'win32' && !process.env.USERDNSDOMAIN.match(/huawei\.com/i)) {
	electron.dialog.showErrorBox('PM APP Security Notice', 'Please log in to the Huawei domain before running PM APP');
	app.quit();
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
	const server = require('./api');
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 1200, height: 850, icon: path.join(__dirname, 'app.ico')});

	// and load the index.html of the app.
	mainWindow.loadURL('http://localhost:3000/');

	const createDocument = new CreateDocumentBehaviour;
	createDocument.attachWindow(mainWindow);
	// Open the DevTools.
	//mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
});