'use strict';

function noop() {
	console.debug('IPC only available in Electron Process');
}

let ipcRenderer = null;

if ( !!window.require ) {
	ipcRenderer = require('electron').ipcRenderer;
} else {
	ipcRenderer = {
		on: noop,
		send: noop
	};
}

export default class IPC {
	createPDF(defaultFileName) {
		ipcRenderer.send('onCreatePDF', defaultFileName);
	}

	createXLS(route) {
		ipcRenderer.send('onCreateXLS', route);
	}

	openGuide() {
		ipcRenderer.send('onOpenGuide', window.PMAPP.guideFileName);
	}
}
