import React from 'react';
import _debounce from 'lodash/debounce';
import styles from './DeliverableTask.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import RAMatrix from 'components/RAMatrix/RAMatrix';
import IconButton from 'components/IconButton/IconButton';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import DeliverableActivity from 'components/DeliverableActivity/DeliverableActivity';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import DeliverableStream from 'streams/Deliverables';

export default class DeliverableTask extends React.Component {
	static propTypes = {
		index: React.PropTypes.number,
		task: React.PropTypes.object.isRequired,
		parentId: React.PropTypes.number.isRequired
	}

	static defaultProps = {
		task: {},
		index: '0'
	}

	constructor() {
		super();
		this.state = {
			tasksExpanded: false,
			showRAM: false
		};
		this.stream = new DeliverableStream(false);
	}

	componentWillMount() {

	}

	handleShowActivities() {
		this.setState({
			tasksExpanded: !this.state.tasksExpanded
		});
	}

	handleShowRAM() {
		this.setState({
			showRAM: !this.state.showRAM
		});
	}

	handleAddActivites() {
		this.stream.createActivity(this.props.parentId, this.props.task.id);
	}

	handleDeleteTask() {
		this.stream.deleteTask(this.props.parentId, this.props.task.id);
	}

	handleTaskDescriptionChange(value) {
		this.stream.updateTask(this.props.parentId, this.props.task.id, { title: value });
	}

	handleUpdateTaskRAM(model) {
		this.stream.updateTask(this.props.parentId, this.props.task.id, { responsibilityMatrix: model });
	}

	render() {
		return (
			<deliverable-task class={ styles.DeliverableTask }>
				<ComponentHeader
					title={ <TextScaleArea onChange={ _debounce(this.handleTaskDescriptionChange.bind(this), 250) } value={ this.props.task.title } /> }
					index={ this.props.index }
					actions={ [
						<IconButton key="showRAM" onClick={ this.handleShowRAM.bind(this) }>group_add</IconButton>,
						<DeleteButton
							key="deleteTask"
							messageSlug="confirm_message_task"
							onConfirm={ this.handleDeleteTask.bind(this) }
						/>,
						<ExpandButton
							key="expand"
							angle={ this.state.tasksExpanded ? 0 : 180 }
							onClick={ this.handleShowActivities.bind(this) }
						/>

					] }
				/>

				{
					this.state.showRAM ?
						<RAMatrix
							model={ this.props.task.responsibilityMatrix }
							onChange={ this.handleUpdateTaskRAM.bind(this) }
						/> : null
				}

				<task-activities class={ this.state.tasksExpanded ? 'expanded' : null }>
					<ComponentHeader
						title={ <GuideLabel guideSlug="wbs_activities"/> }
						actions={ <IconButton onClick={ this.handleAddActivites.bind(this) }>playlist_add</IconButton> }
					/>
					{
						this.props.task.activities &&
						this.props.task.activities
						.reverse()
						.map(
							(activity, index) =>
							<DeliverableActivity
								key={ activity.id }
								activity={ activity }
								index={ index + 1 }
							/>
						)
					}
				</task-activities>
			</deliverable-task>
		);
	}
}


