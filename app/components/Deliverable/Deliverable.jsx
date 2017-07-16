import React from 'react';
import _debounce from 'lodash/debounce';
import styles from './Deliverable.css';

import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import RAMatrix from 'components/RAMatrix/RAMatrix';
import IconButton from 'components/IconButton/IconButton';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import DueDate from 'components/DueDateAction/DueDateAction';
import DeliverableTask from 'components/DeliverableTask/DeliverableTask';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import DeliverableStream from 'streams/Deliverables';

export default class Deliverable extends React.Component {

	constructor() {
		super();
		this.state = {
			expanded: false,
			showRAM: false,
			tasksExpanded: null
		};
		this.stream = new DeliverableStream(false);
	}

	componentWillMount() {
		this.setState({
			expanded: this.props.autoExpand,
			tasksExpanded: this.props.autoExpand
		});
	}

	handlesShowTasks() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	handleShowRAM() {
		this.setState({
			showRAM: !this.state.showRAM
		});
	}

	handleShowActivities(index) {
		let tasksState = this.state.tasksExpanded.slice();
		tasksState[index] = !tasksState[index];
		this.setState({
			tasksExpanded: tasksState
		});
	}

	handleAddTask() {
		this.stream.createTask(this.props.model.id);
	}

	handleValueChange(key, value) {
		let changes = {};
		changes[key] = value;
		Object.assign(this.props.model, changes);
		this.stream.updateDeliverable(this.props.model.id, changes);
	}

	handleUpdateRAM(model) {
		this.stream.updateDeliverable(this.props.model.id, { responsibilityMatrix: model });
	}

	handleDeleteAction(id) {
		this.stream.delete(id);
	}

	render() {
		return (
			<deliverable-frame class={ styles.Deliverable }>
				<deliverable-header>
					<ComponentHeader
						class="blue"
						title="Deliverable"
						index={ (this.props.index + 1) }
						actions={ [
							<DueDate
								style="light"
								key="date"
								placeholder="Due date"
								date={ this.props.model.due }
								onChange={ this.handleValueChange.bind(this, 'due') }
							/>,
							<DeleteButton
								key="delete"
								messageSlug="confirm_message_deliverable"
								onConfirm={ this.handleDeleteAction.bind(this, this.props.model.id) }
							/>,
							<ExpandButton
								key="expand"
								angle={ this.state.expanded ? 0 : 180 }
								onClick={ this.handlesShowTasks.bind(this) }
							/>
						] }
					>
						<header-description>
							<ComponentHeader
								title={ <TextScaleArea onChange={ _debounce(this.handleValueChange.bind(this, 'description'), 250) } value={ this.props.model.description } /> }
								actions={
									<IconButton
										class={ this.state.showRAM ? styles.ramActive : '' }
										onClick={ this.handleShowRAM.bind(this) }
									>
										group_add
									</IconButton>
								}
							/>
						</header-description>
					</ComponentHeader>
					</deliverable-header>
				<deliverable-ram>
					{
						this.state.showRAM ?
						<RAMatrix
							model={ this.props.model.responsibilityMatrix }
							onChange={ this.handleValueChange.bind(this, 'responsibilityMatrix') }
						/> : null
					}
				</deliverable-ram>
				<deliverable-tasks class={ this.state.expanded ? 'expanded' : null }>
					<ComponentHeader
						title={ <GuideLabel guideSlug="deliverable_tasks"/> }
						actions={ <IconButton onClick={ this.handleAddTask.bind(this) }>playlist_add</IconButton> }
					/>
					{
						this.props.model.tasks &&
						this.props.model.tasks.reverse().map( (task, index) => <DeliverableTask key={ task.id } task={ task } parentId={ this.props.model.id } index={ index + 1 } /> )
					}
				</deliverable-tasks>


			</deliverable-frame>
		);
	}
}
