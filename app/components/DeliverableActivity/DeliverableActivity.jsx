import React from 'react';
import styles from './DeliverableActivity.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import RAMatrix from 'components/RAMatrix/RAMatrix';
import IconButton from 'components/IconButton/IconButton';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import DeliverableStream from 'streams/Deliverables';
export default class DeliverableActivity extends React.Component {
	static propTypes = {
		index: React.PropTypes.number,
		activity: React.PropTypes.object.isRequired,
	}

	static defaultProps = {
		activity: {}
	}

	constructor() {
		super();

		this.state = {
			showRAM: false
		};

		this.stream = new DeliverableStream(false);
	}

	handleDescriptionChange(value) {
		let activity = this.props.activity;
		this.stream.updateActivity(activity.$projectId, activity.$taskId, activity.id, { description: value });
	}

	handleShowRAM() {
		this.setState({
			showRAM: !this.state.showRAM
		});
	}

	handleDeleteActivity() {
		let activity = this.props.activity;
		this.stream.deleteActivity(activity.$projectId, activity.$taskId, activity.id);
	}

	handleUpdateActivityRAM(model) {
		let activity = this.props.activity;
		this.stream.updateActivity(activity.$projectId, activity.$taskId, activity.id, { responsibilityMatrix: model });
	}

	render() {
		let activity = this.props.activity;

		return (
			<deliverable-activity key={ 'act' + activity.id } class={ styles.DeliverableActivity }>
				<ComponentHeader
					title={
						<TextScaleArea
							value={ activity.description }
							onChange={ this.handleDescriptionChange.bind(this) }
						/>
					}
					index={ this.props.index }
					actions={ [
						<IconButton onClick={ this.handleShowRAM.bind(this) } key="add_activity">group_add</IconButton>,
						<DeleteButton
							key="delete_activity"
							messageSlug="confirm_message_activity"
							onConfirm={ this.handleDeleteActivity.bind(this) }
						/>
					] }
				/>
				{
					this.state.showRAM ?
						<RAMatrix
							model={ activity.responsibilityMatrix }
							onChange={ this.handleUpdateActivityRAM.bind(this) }
						/> : null
				}

			</deliverable-activity>
		);
	}
}
