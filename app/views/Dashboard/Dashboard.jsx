import React from 'react';
import numeral from 'numeral';
import styles from './Dashboard.css';
import localise from 'state/localisation.js';
import DashboardStream from 'streams/Dashboard';
import TrafficLight from 'components/TrafficLight/TrafficLight';
import PieChart from 'components/PieChart/PieChart';
import ProcessList from 'components/ProcessList/ProcessList';
import ProcessMap from 'components/ProcessMap/ProcessMap';
import appState from 'state/app';
import moment from 'moment';

export default class Dashboard extends React.Component {

	static propTypes = {
	}

	constructor(props) {
		super(props);
		this.dashboard = null;
		this.stream = new DashboardStream;
		this.stream.subscribe(
			this.handleStreamResponse.bind(this)
		);
		this.stream.getDashboardData(appState.projectId);
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillReceiveProps() {
		this.processDashboard();
	}

	componentWillUnmount() {
		this.mounted = false;
		this.stream.unsubscribe();
	}

	processDashboard() {
		moment.locale(appState.locale);
		let	d = this.dashboard;
		d.now = moment();
		d.title = d.raw.project.title;
		d.updated = `${localise('dashboard_started')} ${moment(d.raw.project.updated).fromNow()}`;

	// TASKS
		d.tasks_identified = d.raw.tasks.length;
		d.tasks_assigned = 0;
		d.tasks_open = 0;
		d.tasks_closed = 0;
		for (let i = 0; i < d.raw.tasks.length; i++) {
			if (d.raw.tasks[i].hasOwnProperty('assigned')) {
				d.tasks_assigned ++;
			}
			if (d.raw.tasks[i].status === 'open') {
				d.tasks_open ++;
			}
			if (d.raw.tasks[i].status === 'closed') {
				d.tasks_closed ++;
			}
		}
		d.tasks_caption_identified = localise('dashboard_pie_identified') + ' ' + d.tasks_identified;
		d.tasks_caption_assigned = localise('dashboard_pie_assigned') + ' ' + d.tasks_assigned;
		d.tasks_caption_open = localise('dashboard_pie_open') + ' ' + d.tasks_open;
		d.tasks_legend = [d.tasks_caption_identified, d.tasks_caption_assigned, d.tasks_caption_open];

		d.tasks_percent_assigned = Math.floor((d.tasks_assigned / d.tasks_identified) * 100) || 0;
		d.tasks_percent_open = Math.floor((d.tasks_open / d.tasks_identified) * 100) || 0;

	// DELIVERABLES
		d.deliverables_total = d.raw.deliverables.length;
		d.deliverables_due = 0;
		d.deliverables_approved = 0;
		for (let i = 0; i < d.raw.deliverables.length; i++) {
			if (d.raw.deliverables[i].due !== null) {
				if (moment().isBefore(d.raw.deliverables[i].due) && !(!!d.raw.deliverables[i].approved && !!d.raw.deliverables[i].approvedWhen)) {
					d.deliverables_due++;
				}
			}
			if (!!d.raw.deliverables[i].approved && !!d.raw.deliverables[i].approvedWhen) {
				d.deliverables_approved++;
			}
		}

		d.deliverables_percent_scheduled = Math.floor((d.deliverables_due / d.deliverables_total) * 100) || 0;
		d.deliverables_percent_open = 100 - Math.floor(d.deliverables_approved / d.deliverables_total * 100) || 0;
		d.deliverables_caption_scheduled = localise('dashboard_pie_scheduled') + ' ' + d.deliverables_percent_scheduled + '%';
		d.deliverables_caption_actual = localise('dashboard_pie_open') + ' ' + d.deliverables_percent_open + '%';
		d.deliverables_percent_done = Math.floor(d.deliverables_approved / d.deliverables_total * 100);
		d.deliverables_legend = [d.deliverables_caption_actual, d.deliverables_caption_scheduled];

	// BUDGET
		d.budget_total = d.raw.budget.total;
		d.budget_actual = d.raw.budget.actual;
		d.project_start = moment();
		d.project_end = moment();

		for (let i = 0; i < d.raw.tasks.length; i++) {
			if (d.raw.tasks[i].startDate !== null) {
				if (
						d.project_start === null ||
						moment(d.raw.tasks[i].startDate).isBefore(d.project_start)
					) {
					d.project_start = moment(d.raw.tasks[i].startDate);
				}
			}
			if (d.raw.tasks[i].endDate !== null) {
				if (
						d.project_end === null ||
						moment(d.raw.tasks[i].endDate).isAfter(d.project_end)
					) {
					d.project_end = moment(d.raw.tasks[i].endDate);
				}
			}
		}

		d.project_days = d.project_end.diff(d.project_start, 'days');
		d.project_days_elapsed = moment().diff(d.project_start, 'days');
		d.project_days_elapsed_percent = Math.floor((d.project_days_elapsed / d.project_days) * 100) || 0;
		d.budget_dailyspend_planned = Math.round( (d.budget_total / d.project_days) * 100 ) / 100;
		d.budget_dailyspend_actual = Math.round( (d.budget_actual / d.project_days_elapsed) * 100 ) / 100;
		d.budget_spend_percentage = Math.round(d.budget_dailyspend_planned / d.budget_dailyspend_actual * 100) || 0;
		d.budget_caption_planned = `${localise('dashboard_pie_planned')} ¥${numeral(d.budget_dailyspend_planned || 0).format('(0,0.0)')}${localise('dashboard_pie_perday')}`;
		d.budget_caption_actual = `${localise('dashboard_pie_actual')} ¥${numeral(d.budget_dailyspend_actual || 0).format('(0,0.0)')}${localise('dashboard_pie_perday')}`;
		d.budget_legend = [d.budget_caption_planned, d.budget_caption_actual];

	// RISK MANAGEMENT
		d.risks_total = d.raw.risks.length;
		d.risks_open = 0;
		d.risks_pending = 0;
		d.risks_closed = 0;
		for (let i = 0; i < d.raw.risks.length; i++) {
			switch (d.raw.risks[i].status) {
			case 'open':
				d.risks_open ++;
				break;
			case 'pending':
				d.risks_pending ++;
				break;
			case 'closed':
				d.risks_closed ++;
				break;
			default:
			}
		}
		d.health_risks_percentage = Math.floor((d.risks_closed / d.risks_total) * 100) || 0;
		d.health_risks_legend = [localise('dashboard_pie_identified') + ' ' + d.risks_total, localise('dashboard_pie_closed') + ' ' + d.risks_closed];

	// CHANGE MANAGEMENT
		d.changes_total = d.raw.changes.length;
		d.changes_accepted = 0;
		d.changes_moved = 0;
		for (let i = 0; i < d.raw.changes.length; i++) {
			if (d.raw.changes[i].decision === 'accept') {
				d.changes_accepted ++;
			}
			if (d.raw.changes[i].followUp === 'move_change_charter') {
				d.changes_moved ++;
			}
		}
		d.health_changes_accepted_percentage = Math.floor((d.changes_moved / d.changes_accepted) * 100) || 0;
		d.health_changes_legend = [
			localise('dashboard_pie_requests') + ' ' + d.changes_total,
			localise('dashboard_pie_accepted') + ' ' + d.changes_accepted,
			localise('dashboard_pie_moved') + ' ' + d.changes_moved
		];

	// PROJECT HEALTH
		d.health_current_date = moment().format('YYYY-MM-DD');
		d.health_current_time = moment().format('h:mm A');

		d.health_tasks_closed_percentage = Math.floor((d.tasks_closed / d.tasks_identified) * 100);
		d.health_risks_closed_percentage = Math.floor((d.risks_closed / d.risks_total) * 100);
		d.health_changes_moved_percentage = Math.floor((d.changes_moved / d.changes_total) * 100);
		d.health_deliverables_percentage = this.dashboard.deliverables_percent_scheduled;

		d.health_spend_percentage = d.budget_spend_percentage || 0;
		d.health_average_percentage = Math.floor((d.health_tasks_closed_percentage + d.health_risks_closed_percentage + d.health_changes_moved_percentage + d.health_deliverables_percentage + d.health_spend_percentage) / 5) || 0;
		d.health = 'red';
		if (d.health_average_percentage > 30) {
			d.health = 'yellow';
		}
		if (d.health_average_percentage > 60) {
			d.health = 'green';
		}

	// UPDATE
		if (this.mounted) {
			this.forceUpdate();
		}
	}

	handleStreamResponse(res) {
		this.dashboard = {};
		this.dashboard.raw = res.body;
		this.processDashboard();
	}

	render() {
		let projectClosed = appState.project && appState.project.closedBy && appState.project.closeDate;
		if (this.dashboard !== null) {
			return (
				<dashboard-view class={ styles.Dashboard }>
					<dashboard-header class={
						projectClosed && 'closed'
					}>

						<project-title>{ this.dashboard.title }</project-title>
						{	!!appState.project &&
							<project-info>
								<section>{ projectClosed ? `${localise('tsk_state_closed')} ${moment(appState.project.closeDate).format('dddd, MMMM Do YYYY')}` : this.dashboard.updated }</section>
								<section key="created">Created: { appState.project.created && moment(appState.project.created).format('MMMM Do YYYY HH:mm') }</section>
							</project-info>
						}
					</dashboard-header>
					<dashboard-body>
						<TrafficLight
							health = { this.dashboard.health }
							date = { this.dashboard.health_current_date }
							time = { this.dashboard.health_current_time }
						/>
						<PieChart
							pieId= "pie_tasks"
							pieTitle={ localise('dashboard_tasks') }
							piePercent={ this.dashboard.tasks_percent_assigned }
							pieLegend={ this.dashboard.tasks_legend }
							pieCenter={ localise('dashboard_pie_assigned') }
						/>
						<PieChart
							pieId= "pie_deliverables"
							pieTitle={ localise('dashboard_deliverables') }
							piePercent={ this.dashboard.deliverables_percent_done }
							pieLegend={ this.dashboard.deliverables_legend }
							pieCenter={ localise('dashboard_pie_done') }
						/>
						<PieChart
							pieId= "pie_budget"
							pieTitle={ localise('dashboard_budget') }
							piePercent={ this.dashboard.budget_spend_percentage }
							pieLegend={ this.dashboard.budget_legend }
							pieCenter={ localise('dashboard_pie_spent') }
						/>
						<PieChart
							pieId= "pie_risk"
							pieTitle={ localise('dashboard_riskmanagement') }
							piePercent={ this.dashboard.health_risks_percentage }
							pieLegend={ this.dashboard.health_risks_legend }
							pieCenter={ localise('dashboard_pie_closed') }
						/>
						<PieChart
							pieId= "pie_change"
							pieTitle={ localise('dashboard_changemanagement') }
							piePercent={ this.dashboard.health_changes_accepted_percentage }
							pieLegend={ this.dashboard.health_changes_legend }
							pieCenter={ localise('dashboard_pie_moved') }
						/>
						<dashboard-bottom />
						<process-section>
							<h2>{ localise('menu_monitor') }</h2>
							<ProcessList />
						</process-section>
						<ProcessMap />
					</dashboard-body>
					{
						window.DEBUG && this.renderDebugVariables()
					}

				</dashboard-view>
			);
		}else {
			return (null);
		}
	}

	renderDebugVariables() {
		return (
			<debug-variables>
				<b>TASKS</b>
				// All Assigned Tasks as a percentage of all Identified Tasks
				<br/>Assigned <b>{ this.dashboard.tasks_percent_assigned }%</b>
				// All Open Tasks as a percentage of all Identified Tasks
				<br/>Open <b>{ this.dashboard.tasks_percent_open }%</b>
				// Caption Identified [number]
				<br/>Caption: <b>{ this.dashboard.tasks_caption_identified }</b>
				// Caption Assigned [number]
				<br/>Caption: <b>{ this.dashboard.tasks_caption_assigned }</b>
				// Caption Open [number]
				<br/>Caption: <b>{ this.dashboard.tasks_caption_open }</b>
				<br/><br/>

				<b>DELIVERABLES</b>
				// Scheduled progress. number of Deliverables due on Today’s date as a percentage of all project Deliverables
				<br/>Scheduled Progress <b>{ this.dashboard.deliverables_percent_scheduled }%</b>
				// Actual Progress. number of Deliverables approved on Today’s date as a percentage of all project Deliverables
				<br/>Actual Progress <b>{ this.dashboard.deliverables_percent_open }%</b>
				// Total Deliverables
				<br/>Total <b>{ this.dashboard.deliverables_total }</b>
				// Due Deliverable
				 Due <b>{ this.dashboard.deliverables_due }</b>
				// Approved Deliverable
				 Approved <b>{ this.dashboard.deliverables_approved }</b>
				<br/><br/>

				<b>BUDGET</b>
				// Total project budget
				<br/>Total Budget <b>¥{ this.dashboard.budget_total }</b>
				// Actual project budget
				<br/>Actual Budget <b>¥{ this.dashboard.budget_actual }</b>
				// Earliest Task Start Date
				<br/>First Task Start Date <b>{ moment(this.dashboard.project_start).format("DD-MM-YYYY") }</b>
				// Latest Task Start Date
				<br/>Last Task End Date <b>{ moment(this.dashboard.project_end).format("DD-MM-YYYY") }</b>
				// Todays Date
				<br/>Today\'s Date <b>{ moment(this.dashboard.now).format("DD-MM-YYYY") }</b>
				// Project length in days
				<br/>Project Total days <b>{ this.dashboard.project_days }</b>
				// Elapsed project days
				<br/>Elapsed project days <b>{ this.dashboard.project_days_elapsed }</b>
				// Elapsed project days as percentage
				<br/>Elapsed project days as percentage <b>{ this.dashboard.project_days_elapsed_percent }%</b>
				// Planned spend per day
				<br/>Planned CNY per day <b>¥{ this.dashboard.budget_dailyspend_planned }</b>
				// Actual spend per day
				<br/>Actual spend per day <b>¥{ this.dashboard.budget_dailyspend_actual }</b>
				// Caption Planned spend per day
				<br/>Caption: <b>{ this.dashboard.budget_caption_planned }</b>
				// Caption Actual spend per day
				<br/>Caption: <b>{ this.dashboard.budget_caption_actual }</b>
				<br/><br/>

				<b>RISK MANAGEMENT</b>
				// Total number of Risks that have been identified
				<br/>Total number of Risks <b>{ this.dashboard.risks_total }</b>
				<br/>Open <b>{ this.dashboard.risks_open }</b>
				 Pending <b>{ this.dashboard.risks_pending }</b>
				 Closed <b>{ this.dashboard.risks_closed }</b>
				<br/><br/>

				<b>CHANGE MANAGEMENT</b>
				// Total number of Change Requests
				<br/>Total number of Change Requests  <b>{ this.dashboard.changes_total }</b>
				<br/>Accepted Change Requests  <b>{ this.dashboard.changes_accepted }</b>
				<br/>Changes Moved to Charter Deliverables  <b>{ this.dashboard.changes_moved }</b>
				<br/><br/>

				<b>PROJECT HEALTH</b>
				<br/>Current Date  <b>{ this.dashboard.health_current_date }</b>
				<br/>Current Time  <b>{ this.dashboard.health_current_time }</b>
				// Identified Tasks that have been Closed
				<br/>A) Percentage of Tasks that have been Closed <b>{ this.dashboard.health_tasks_closed_percentage }%</b>
				// Identified Risks that have been Closed
				<br/>B) Percentage of Risks that have been Closed <b>{ this.dashboard.health_risks_closed_percentage }%</b>
				// Accepted Change Requests that have been Moved to Deliverables
				<br/>C) Percentage of Change Requests that have been Moved to Deliverables <b>{ this.dashboard.health_changes_moved_percentage }%</b>
				// Scheduled Deliverables that have been Delivered
				<br/>D) Percentage of Scheduled Deliverables that have been Delivered <b>{ this.dashboard.health_deliverables_percentage }%</b>
				// Planned Spend per Day that has been Actually Spent
				<br/>E) Planned Spend per Day that has been Actually Spent <b>{ this.dashboard.health_spend_percentage }%</b>
				<br/>Average Percentage <b>{ this.dashboard.health_average_percentage }%</b>
				<br/>Traffic Light Colour <b>{ this.dashboard.health }</b>
			</debug-variables>
		);
	}
}
