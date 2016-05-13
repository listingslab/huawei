import React from 'react';
import styles from './Header.css';
import IconButton from 'components/IconButton/IconButton';
import NotificationButton from 'components/NotificationButton/NotificationButton';
import PrintArea from 'components/PrintArea/PrintArea';
import appState from 'state/app';
import history from 'state/browserHistory';
import localise from 'state/localisation.js';
import menuState from 'state/menu.json';

import IPC from 'streams/IPC';

export default class Header extends React.Component {
	constructor() {
		super();
		this.ipc = new IPC;
	}

	handleFileDownload() {
		// <IconButton onClick={ this.handleFileDownload.bind(this) }>file_download</IconButton>
		if ( window.location.pathname.match(/schedule/) ) {
			this.ipc.createXLS(`${appState.serverURL}/schedule/${appState.projectId}`);
		} else {
			this.ipc.createPDF(`PM App - ${appState.project && appState.project.title || ''} - ${this.getPageTitle()}`);
		}
	}

	togglelocalise() {
		appState.locale = appState.locale === 'en' ? 'zh-cn' : 'en';
		// retain search and hash string on translate button click
		history.push(window.location.pathname + window.location.search + window.location.hash);
	}

	getPageTitle() {
		let location = window.location.pathname;
		let section = Object
			.keys(menuState)
			.find(
				key => !!location.match(menuState[key].route)
			);

		let route = menuState[section] && menuState[section]
			.items
			.find(path => !!location.match(path.route)) || {};

		return route.title && localise(route.title) || 'Report';
	}

	handleOpenGuide() {
		// this.ipc.openGuide();
		window.open(window.PMAPP.guideFileName);
	}

	render() {
		return (
			<header className={ styles.Header }>
				<header-home onClick={ ()=>{ history.push('/'); } }>
					<home-title>
						<material-icon>home</material-icon>
						{ localise('menu_home') }
					</home-title>
				</header-home>
				<header-user></header-user>
				<header-title>
					PM APP
					<PrintArea>
						<header-logo>
							<img src="/img/huawei.png"/>
						</header-logo>
					</PrintArea>
				</header-title>
				<header-actions>
					<a href="#monitor=show">
						<NotificationButton/>
					</a>

					
					<a href="#glossary=ALL">
						<IconButton>import_contacts</IconButton>
					</a>
					<IconButton onClick={ this.handleOpenGuide.bind(this) }>help_outline</IconButton>
					{
						window.PMAPP.enableLocalisation && <IconButton onClick={ this.togglelocalise.bind(this) }>translate</IconButton>
					}
				</header-actions>
				<PrintArea>
					<page-title>
					{ this.getPageTitle() }
					</page-title>
				</PrintArea>
			</header>
		);
	}
}
