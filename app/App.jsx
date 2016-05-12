/**
	------------------------------------
	App Component
	------------------------------------

	This is the root component.
**/
'use strict';

import 'babel-core/polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import _debounce from 'lodash/debounce';
import styles from './App.css';
import typography from 'fonts/material-icons.css';
import fontDosis from 'fonts/dosis.css';
import fontOpenSans from 'fonts/open-sans.css';

import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn';

import { Router, PropTypes } from 'react-router';
import history from 'state/browserHistory';
import appState from 'state/app';
import Scaffold from 'components/ScaffoldPane/ScaffoldPane';
import ProjectMenu from 'components/ProjectMenu/ProjectMenu';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import DashboardView from 'views/Dashboard/Dashboard';
import WBSView from 'views/WBS/WBS';
import CharterView from 'views/Charter/Charter';
import KickOffView from 'views/KickOff/KickOff';
import HeaderView from 'views/Header/Header';
import HomeView from 'views/Home/Home';
import IntroductionView from 'views/Introduction/Introduction';
import ProjectsView from 'views/Projects/Projects';
import MemberSelectView from 'views/MemberSelect/MemberSelect';
import EstimateResourcesView from 'views/EstimateResources/EstimateResources';
import ScheduleView from 'views/Schedule/Schedule';
import RiskView from 'views/RiskManagement/RiskManagement';
import CommunicationPlanView from 'views/CommunicationPlan/CommunicationPlan';
import QualityPlanView from 'views/QualityPlan/QualityPlan';
import CorrectionsControlView from 'views/CorrectionsControl/CorrectionsControl';
import MonitorProcessView from 'views/MonitorProcess/MonitorProcess';
import ProjectSummaryView from 'views/ProjectSummary/ProjectSummary';
import ManageChangesView from 'views/ManageChanges/ManageChanges';
import ProjectsStream from 'streams/Projects';
import CRUD from 'streams/CRUD';

import Locale from 'state/localisation.js';

export default class App extends React.Component {

	static propTypes = {
		children: React.PropTypes.node.isRequired,
		params: React.PropTypes.object,
		location: React.PropTypes.object
	}

	static contextTypes = {
		history: PropTypes.history
	}

	constructor() {
		super();
		this.state = {
			expandedContentDrawer: false,
			scaffoldMode: 'introduction',
			scaffoldValue: false
		};
		this.projectStream = new ProjectsStream;
		moment.locale(appState.locale);
	}

	componentWillMount() {
		this.projectStream.subscribe(
			this.handleProjectUpdate.bind(this)
		);
		this.handleLocationChange();
		appState.projectId = this.props.params.projectId || null;

		if ( appState.project === null && !!appState.projectId ) {
			this.projectStream.get(appState.projectId);
		}

		// Update the project status when data has been modified.
		// this could be handled on the back end.
		this.CRUDStream = CRUD
			.responseStream
			.filter(
				res =>
				res.method.match(/post|put|delete/i) &&
				!res.collection.match(/projects/i)
			)
			.subscribe(
				_debounce(this.handleProjectChanges.bind(this), 1000)
			);
	}

	componentDidMount() {
		this.handleScaffold(this.props);
	}

	componentWillReceiveProps(props) {
		this.handleScaffold(props);
	}

	componentDidUpdate() {
		this.handleLocationChange();
	}

	componentWillUnmount() {
		this.projectStream.unsubscribe();
	}

	handleProjectChanges(res) {
		this.projectStream.update(appState.projectId, { updated: moment().toISOString() });
	}

	handleProjectUpdate(res) {
		if (!!res.items) { return; }
		appState.project = res.body;
		this.setState({ project: appState.body });
	}

	handleLocationChange() {
		if ( appState.project === null || !appState.projectId) { return; }
		let route = this.props.location.pathname.replace(/projects\/[0-9]*\//, '');
		let update = {};
		let project = appState.project;
		project.history = project.history || {};
		update[route] = moment().toISOString();
		this.projectStream.update(
			appState.projectId,
			{
				history: Object.assign(project.history, update)
			}
		);
	}

	handleScaffold(props) {
		let needScaffold,
			closeScaffold,
			newScaffoldMode,
			changeScaffoldContent;
		let route = props.routes.slice(-1)[0];
		needScaffold = !!window.location.hash.match(/glossary|guide|monitor/);


		newScaffoldMode = route.props.intro === 'scaffold' ? 'introduction' : 'glossary';
		window.location.hash.match(/guide/) ? newScaffoldMode = 'guide' : null;
		window.location.hash.match(/glossary/) ? newScaffoldMode = 'glossary' : null;
		window.location.hash.match(/monitor/) ? newScaffoldMode = 'monitor' : null;

		if (route.props && route.props.intro !== 'page') {
			// needScaffold = newScaffoldMode === 'introduction';
			newScaffoldMode === 'introduction';
			needScaffold = true;
		}

		if (needScaffold) {
			this.handleExpandToggle(true);
		}

		if (newScaffoldMode !== this.state.scaffoldMode) {
			changeScaffoldContent = true;
		}

		if (props.routes.slice(-1)[0].props) {
			if (props.routes.slice(-1)[0].props.intro === 'page' && !needScaffold) {
				closeScaffold = true;
			}
		}

		if (closeScaffold) {
			this.handleExpandToggle(false);
		}

		if (changeScaffoldContent) {
			this.setState({
				scaffoldMode: newScaffoldMode
			});
		}
	}

	handleExpandToggle(expand) {
		let shouldExpand = typeof expand === 'boolean' ? expand : !this.state.expandedContentDrawer;

		if (this.state.expandedContentDrawer === shouldExpand) { return null; }

		this.setState({
			expandedContentDrawer: shouldExpand
		});

		// if ( !shouldExpand ) {
		// 	window.location.hash = '';
		// }

		let frames = 21;

		function emitResize() {
			if ( frames < 0 ) { return; }
			frames--;
			window.dispatchEvent(new CustomEvent('resize'));
			window.setTimeout(() => {
				window.requestAnimationFrame(emitResize);
			}, 15);
		}

		emitResize();
	}

	getRouteState() {
		let states = this.props.routes.map( (route)=> route.state );
		return Object.assign({}, ...states);
	}

	render() {
		let routeState = this.getRouteState();
		let scaffoldProps = this.props.routes.slice(-1)[0].props;
		return (
			<pm-app class={  `${styles.App} locale-${appState.locale}` }>
				<app-header><HeaderView index/></app-header>
				<app-content>
				{
					routeState.hasMenu && appState.project ? (
						<content-menu>
							<menu-title onClick={ ()=> { this.props.history.pushState(null, '/projects'); } }>
								<material-icon>timeline</material-icon>
								{ Locale('menu_my_projects') }
								<title-arrow>
									<material-icon>arrow_drop_down</material-icon>
								</title-arrow>
							</menu-title>
							<ProjectMenu/>
							<menu-copyright>
								Copyright © { moment().format('YYYY') }
							</menu-copyright>
						</content-menu>
					) : null
				}

					<content-frame>
						{ this.props.children }
					</content-frame>
					{
						routeState.hasDrawer ? (
							<content-drawer class={ this.state.expandedContentDrawer ? 'expanded' : null }>
								<ExpandButton
									angle={ this.state.expandedContentDrawer ? 90 : 270 }
									onClick={ this.handleExpandToggle.bind(this) }
								/>
								<Scaffold
									content={ scaffoldProps }
									mode={ this.state.scaffoldMode }
									location={ this.props.location }
									ref="ScaffoldPane"
								/>

							</content-drawer>
						) : null
					}
				</app-content>
			</pm-app>
		);
	}

}

let routes = [

	{
		path: '/',
		component: App,
		indexRoute: {
			component: HomeView,
			state: {
				hasMenu: false
			},
			props: {
				intro: 'page',
				intro_slug: ''
			}
		},
		childRoutes: [
			{
				path: '/projects',
				state: {
					hasMenu: false
				},
				props: {
					intro: 'page',
					intro_slug: ''
				},
				component: ProjectsView
			},
			{
				component: IntroductionView,
				path: 'help',
				props: {
					intro: 'page',
					intro_slug: 'app_help'
				},
				state: {
					hasMenu: true
				}
			},
			{
				path: '/projects/:projectId',
				childRoutes: [
					{
						component: DashboardView,
						path: 'dashboard',
						state: {
							hasMenu: true,
							hasDrawer: true
						},
						props: {
							intro: 'page',
							intro_slug: 'dashboard'
						}
					},
					{
						path: 'initiate',
						state: {
							hasMenu: true,
							hasDrawer: true
						},
						childRoutes: [
							{
								component: IntroductionView,
								path: 'introduction',
								props: {
									intro: 'page',
									intro_slug: 'initiate_introduction'
								}
							},
							{
								component: CharterView,
								path: 'charter',
								props: {
									intro: 'scaffold',
									intro_slug: 'develop_project_charter'
								}
							},
							{
								component: KickOffView,
								path: 'kick-off',
								props: {
									intro: 'scaffold',
									intro_slug: 'kick_off_meeting'
								}
							},
							{
								component: MemberSelectView,
								path: 'stakeholders',
								state: {
									role: 'stakeholders'
								},
								props: {
									intro: 'scaffold',
									intro_slug: 'identify_stakeholders'
								}
							},
							{
								component: MemberSelectView,
								path: 'team',
								state: {
									role: 'team'
								},
								props: {
									intro: 'scaffold',
									intro_slug: 'identify_project_members'
								}
							}
						]
					},
					{
						path: 'plan',
						state: {
							hasMenu: true,
							hasDrawer: true
						},
						childRoutes: [
							{
								component: IntroductionView,
								path: 'introduction',
								props: {
									intro: 'page',
									intro_slug: 'plan_introduction'
								}
							},
							{
								component: WBSView,
								path: 'wbs',
								props: {
									intro: 'scaffold',
									intro_slug: 'develop_work_breakdown'
								}
							},
							{
								component: EstimateResourcesView,
								path: 'estimate',
								props: {
									intro: 'scaffold',
									intro_slug: 'estimate_resources__duration_and_cost'
								}

							},
							{
								component: ScheduleView,
								path: 'schedule',
								props: {
									intro: 'scaffold',
									intro_slug: 'develop_project_schedule'
								}
							},
							{
								component: RiskView,
								path: 'risk',
								props: {
									intro: 'scaffold',
									intro_slug: 'develop_risk_management_plan'
								}
							},
							{
								component: CommunicationPlanView,
								path: 'communications',
								props: {
									intro: 'scaffold',
									intro_slug: 'develop_communications_plan'
								}
							},
							{
								component: QualityPlanView,
								path: 'quality',
								props: {
									intro: 'scaffold',
									intro_slug: 'develop_quality_plan'
								}
							}
						]
					},

					{
						path: 'emc',
						state: {
							hasMenu: true,
							hasDrawer: true
						},
						childRoutes: [
							{
								component: IntroductionView,
								path: 'introduction',
								props: {
									intro: 'page',
									intro_slug: 'execute_monitor_control_introduction'
								}
							},
							{
								component: IntroductionView,
								path: 'execute',
								props: {
									intro: 'page',
									intro_slug: 'execute_management_actions',
									process: true
								}
							},
							{
								component: MonitorProcessView,
								path: 'monitor',
								props: {
									intro: 'scaffold',
									intro_slug: 'monitor_project_plan'
								}
							},
							{
								component: CorrectionsControlView,
								path: 'control',
								props: {
									intro: 'scaffold',
									intro_slug: 'control_and_correct_project_plan'
								}
							},
							{
								component: ManageChangesView,
								path: 'manage',
								props: {
									intro: 'scaffold',
									intro_slug: 'manage_change_requests'
								}
							}
						]
					},

					{
						path: 'close',
						state: {
							hasMenu: true,
							hasDrawer: true
						},
						childRoutes: [
							{
								component: IntroductionView,
								path: 'introduction',
								props: {
									intro: 'page',
									intro_slug: 'close_introduction'
								}
							},
							{
								component: QualityPlanView,
								path: 'acceptance',
								props: {
									intro: 'scaffold',
									intro_slug: 'project_acceptance'
								}
							},
							{
								component: ProjectSummaryView,
								path: 'summary',
								props: {
									intro: 'scaffold',
									intro_slug: 'project_summary'
								}
							}
						]
					}
				]
			}
		]
	}
];

ReactDom.render(<Router history={ history } routes={ routes } />,  document.getElementById('pm-app'));
