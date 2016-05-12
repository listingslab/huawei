const electron = !!window.require ? require('electron') : null;
import React from 'react';
import moment from 'moment';
import styles from './Home.css';
import { PropTypes } from 'react-router';
import NavigationCard from 'components/NavigationCard/NavigationCard';
import ProjectDialog from 'components/ProjectDialog/ProjectDialog';
import localise from 'state/localisation';
import history from 'state/browserHistory';
import appState from 'state/app';
import IPC from 'streams/IPC';

export default class Home extends React.Component {

	static contextTypes = {
		history: PropTypes.history
	}

	constructor() {
		super();
		this.state = {
			newProjectDialog: false,
			showLearningDialog: false
		};
		this.ipc = new IPC;
	}

	handleNewProjectDialog(bool) {
		this.setState({
			newProjectDialog: bool
		});
	}

	handleShowLearningDialog(event) {
		event.stopPropagation();
		this.setState({
			showLearningDialog: !this.state.showLearningDialog
		});
	}

	handleForumClick() {
		if ( electron ) {
			electron.shell.openExternal(appState.forumURL);
		}
	}

	handleOpenGuide() {
		this.ipc.openGuide();
	}

	render() {
		return (
			<home-view class={ styles.Home }>
				<view-row>
					<row-item onClick={ ()=>{ this.props.history.pushState(null, '/projects'); } }>
						<NavigationCard
							icon="timeline"
							title={ localise('home_my_projects') }
							hover={ localise('home_my_projects_tip') }
						/>
					</row-item>
					<row-item onClick={ !this.state.newProjectDialog ? this.handleNewProjectDialog.bind(this, true) : ()=>{} }>
						{
							this.state.newProjectDialog ?
								<ProjectDialog
									transitionOnCreate
									onClose={ this.handleNewProjectDialog.bind(this, false) }
								/>
								:
								<NavigationCard
									icon="power_settings_new"
									title={ localise('home_new_project') }
									hover={ localise('home_new_project_tip') }
								/>
						}

					</row-item>
					<row-item onClick={ this.handleOpenGuide.bind(this) }>
						<NavigationCard
							icon="help_outline"
							title={ localise('home_pm_knowledge') }
							hover={ localise('home_pm_knowledge_tip') }
						/>
					</row-item>
				</view-row>
				<view-row>
					{	appState.forumURL &&
						<row-item onClick={ this.handleForumClick.bind(this) }>
							<NavigationCard
								icon="share"
								title={ localise('home_pm_collab') }
								hover={ localise('home_pm_collab_tip') }
							/>
						</row-item>
					}
				</view-row>
				<app-version>{ null || window.PMAPP.version }</app-version>
				<copy-right>Copyright © { moment().format('YYYY') } Huawei Technologies Co., Ltd. All rights reserved</copy-right>
			</home-view>
		);
	}
}
