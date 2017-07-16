import React from 'react';
import styles from './ScheduleTasks.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import ScheduleEditor from 'components/ScheduleEditor/ScheduleEditor';
import DevliverableStream from 'streams/Deliverables';
import MembersStream from 'streams/Members';
import MilestonesStream from 'streams/Milestones';
import localise from 'state/localisation';

export default class ScheduleTasks extends React.Component {
	static propTypes = {
		model: React.PropTypes.array.isRequired
	}

	constructor() {
		super();
		this.state = {
			members: [],
			milestones: [],
			expandedTasks: {}
		};
	}

	componentWillMount() {
		this.stream = new DevliverableStream(false);
		this.milestonesStream = new MilestonesStream(false);
		this.membersStream = new MembersStream();

		this.milestonesStream.subscribe(
			this.handleMilestoneUpdates.bind(this)
		);

		this.membersStream.subscribe(
			this.handleMembersUpdate.bind(this)
		);
		this.membersStream.read();
		this.milestonesStream.read();
	}

	componentWillUnmount() {
		this.milestonesStream.unsubscribe();
		this.membersStream.unsubscribe();
	}

	handleMilestoneUpdates(res) {
		this.setState({
			milestones: res.body.items
		});
	}

	handleMembersUpdate(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleSchduleChange(task, changes) {
		this.stream.updateTask(task.$deliverableId, task.id, changes);
	}

	handleExpandTask(id) {
		this.state.expandedTasks[id] = !this.state.expandedTasks[id];
		this.setState({
			expandedTasks: this.state.expandedTasks
		},
		()=>{
			window.dispatchEvent(new CustomEvent('resize'));
		});
	}

	render() {
		return (
			<schedule-tasks class={ styles.ScheduleTasks }>
				<tasks-header>
					<ComponentHeader
						title={ localise('sch_tasks') }
						actions={ [
							<label key="open" className="open">{ localise('sch_open') }</label>,
							<label key="pending" className="pending">{ localise('sch_pending') }</label>,
							<label key="closed" className="closed">{ localise('sch_closed') }</label>
						] }
					/>
				</tasks-header>
				{
					this.props.model.map(
						(deliverable, dIndex)=>
						<tasks-block key={ deliverable.id }>
							<ComponentHeader
								index={ dIndex + 1 }
								title={ deliverable.description }
								class="deliverable"
							/>
							{
								deliverable.tasks.map(
									(task, tIndex) =>
									<task-item task={ task.id } key={ task.id }>
										<ComponentHeader
											title={ task.title }
											index={ tIndex + 1 }
											actions={
												<ExpandButton
													onClick={ this.handleExpandTask.bind(this, task.id) }
													angle={ this.state.expandedTasks[task.id] ? 0 : -180 }
												/>
											}
										/>
										{
											<item-options class={ this.state.expandedTasks[task.id] && 'expanded'}>
												<ScheduleEditor
													milestones={ this.state.milestones }
													members={ this.state.members }
													task={ task }
													onChange={ this.handleSchduleChange.bind(this, task) }
												/>
											</item-options>
										}
									</task-item>
								)
							}


						</tasks-block>
					)
				}
			</schedule-tasks>
		);
	}
}
