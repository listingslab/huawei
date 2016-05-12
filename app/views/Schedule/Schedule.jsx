import React from 'react';
import moment from 'moment';
import styles from './Schedule.css';
import ScheduleGridD3 from 'components/ScheduleGridD3/ScheduleGridD3';
import ScheduleTasks from 'components/ScheduleTasks/ScheduleTasks';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import DeliverableStream from 'streams/Deliverables';
import localise from 'state/localisation.js';

export default class Schedule extends React.Component {
	constructor() {
		super();
		this.state = {
			taskDeliverables: [],
			gridTasks: []
		};
		this.stream = new DeliverableStream;
	}

	componentWillMount() {
		this.stream
			.subscribe(
				this.handleStreamUpdate.bind(this)
			);
		this.stream.read();

		this.putSub = this.stream.responseStream
			.filter(
				res =>
				res.method.match(/put/i)
			)
			.subscribe(
				this.stream.read
			);
	}

	componentDidUpdate() {
		let tasks = this.refs.view.querySelectorAll('task-item');
		for (let i = tasks.length - 1; i >= 0; i--) {
			let task = tasks[i];
			let taskHeight = task.offsetHeight;
			let taskId = task.getAttribute('task');
			let cells = this.refs.view.querySelectorAll(`column-cell[task="${taskId}"]`);
			for (let c = cells.length - 1; c >= 0; c--) {
				cells[c].style.height = `${taskHeight}px`;
			}
		}
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
		this.putSub.dispose();
	}

	handleStreamUpdate(res) {
		this.setState({
			taskDeliverables: res.body.items,
			gridTasks: this.parseTasksFromDeliverables( res.body.items )
		});
	}

	parseTasksFromDeliverables(items) {
		return items.map(
			del =>
			del.tasks
		).reduce((a, b) => a.concat(b), []);
	}

	handleStreamPutUpdates(res) {
		this.setState({
			gridTasks: this.parseTasksFromDeliverables( res.body.items )
		});
	}

	handlePopout(model) {
		this.setState({
			showPopout: !!model,
			popout: !!model ?
				<pop-dates>
					<label>{ moment(model.startDate).format('dddd, MMMM Do YYYY') }</label>
					<label>{ moment(model.endDate).format('dddd, MMMM Do YYYY') }</label>
				</pop-dates> : this.state.popout
		});
	}

	render() {
		return (
			<schedule-view ref="view" class={ styles.Schedule }>
				<ProcessHeader/>
				<h3>
					{ localise('guide_work_area') }
				</h3>
				{
					this.state.gridTasks.length ?
					<view-frame>
						<view-tasks>
							<ScheduleTasks model={ this.state.taskDeliverables }/>
						</view-tasks>
						<view-grid>
							<ScheduleGridD3
								model={ this.state.gridTasks }
								onDisplay={ this.handlePopout.bind(this) }
							/>
						</view-grid>
					</view-frame> :
					<view-notice>
						{
							localise('sch_add_tasks')
						}
					</view-notice>
				}

				<view-popout
					class={ !!this.state.showPopout ? 'show' : 'hide' }
				>
					{ this.state.popout }
				</view-popout>
			</schedule-view>
		);
	}
}
