'use strict';
const ipcMain = require('electron').ipcMain;
const dialog = require('electron').dialog;
const app = require('electron').app;
const shell = require('electron').shell;
const request = require('request');
const fs = require('fs');
const path = require('path');

class CreatePDFBehaviour {
	attachWindow(window) {
		this.mainWindow = window;
		ipcMain.on('onCreatePDF', this.handlePDFRequest.bind(this));
		ipcMain.on('onCreateXLS', this.handleXLSRequest.bind(this));
		ipcMain.on('onOpenGuide', this.handleOpenGuide.bind(this));
	}

	handlePDFRequest(event, fileName) {
		let result = dialog.showSaveDialog(
			this.mainWindow,
			{
				title: 'Save PDF',
				defaultPath: fileName || 'PM APP Report',
				filters: [
					{
						name: 'Portable Document Format (PDF)',
						extensions: ['pdf']
					}
				]
			}
		);

		if (!!result) {
			this.mainWindow.printToPDF({}, function(error, data) {
				if (error) throw error;
				fs.writeFile(result, data, function(error) {
					if (error) {
						throw error;
					}
				});
			});
		}
	}

	handleXLSRequest(event, route) {
		let result = dialog.showSaveDialog(
			this.mainWindow,
			{
				title: 'Save Excel Spreadsheet',
				defaultPath: 'PM App - Schedule',
				filters: [
					{
						name: 'Excel Spreadsheet (xls)',
						extensions: ['xls']
					}
				]
			}
		);

		if (!!result) {
			request(route).pipe(fs.createWriteStream(result));
		}
	}

	handleOpenGuide(ev, fileName) {
		let guidePath = path.join(app.getAppPath(), '../../', fileName);
		shell.openItem(guidePath);
	}
}

module.exports = CreatePDFBehaviour;
