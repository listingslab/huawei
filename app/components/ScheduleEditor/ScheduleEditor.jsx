import React from 'react';
import moment from 'moment';
import styles from './ScheduleEditor.css';
import DropDown from 'components/DropDown/DropDown';
import IconButton from 'components/IconButton/IconButton';
import DueDateAction from 'components/DueDateAction/DueDateAction';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import SelectBox from 'components/SelectBox/SelectBox';
import localise from 'state/localisation';
import taskStates from 'state/taskStates';


export default class ScheduleEditorContent extends React.Component {

	static propTypes = {
		members: React.PropTypes.array.isRequired,
		milestones: React.PropTypes.array.isRequired,
		task: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired
	}

	static defaultProps = {
		task: {}
	}

	constructor() {
		super();
		this.state = {
			totalDays: 0
		};
	}

	componentWillMount() {
		this.setState(this.props.task);
	}

	componentDidMount() {
		this.countDays();
	}

	handleModelChange(key, value) {
		let modelState = {};
		modelState[key] = value;
		this.setState(modelState, ()=>{
			let model = Object.assign({}, this.state);
			delete model.totalDays;
			!!this.props.onChange && this.props.onChange(model);
			this.countDays();
		});
	}

	handleMemberChange(member) {
		let matrix = Object.assign({}, this.props.task.responsibilityMatrix);
		matrix.responsible = member;
		this.handleModelChange('responsibilityMatrix', matrix);
	}

	handleClose() {
		this.props.onClose();
	}

	countDays() {
		if (!!this.state.startDate && !!this.state.endDate) {
			this.setState({
				totalDays: moment(this.state.endDate).diff(moment(this.state.startDate), 'days')
			});
		}
	}

	render() {
		return (
			<schedule-editor class={ styles.ScheduleEditor } ref="editor">
				<editor-close><IconButton onClick={ this.handleClose.bind(this) }>clear</IconButton></editor-close>
				<editor-group >
					<editor-title>{ localise('sch_responsible') }</editor-title>
					<editor-item class="full">
						<item-value>
							{
								<SelectBox
									onChange={ this.handleMemberChange.bind(this) }
									value={ this.state.responsibilityMatrix.responsible }
									options={
										this
											.props
											.members
											.map(
												member => ({ value: member.id, label: member.name })
											)
									}
								/>
							}
						</item-value>
					</editor-item>
				</editor-group>

				<editor-group class="dates">
					<editor-title>{ localise('sch_duration') }</editor-title>
					<editor-item>
						<item-title>
							<GuideLabel guideSlug="sch_start_date"/>
						</item-title>
						<item-value>
							<DueDateAction
								date={ this.state.startDate }
								onChange={ this.handleModelChange.bind(this, 'startDate') }
							/>
						</item-value>
					</editor-item>
					<editor-item>
						<item-title>
							<GuideLabel guideSlug="sch_end_date"/>
						</item-title>
						<item-value>
							<DueDateAction
								date={ this.state.endDate }
								onChange={ this.handleModelChange.bind(this, 'endDate') }
							/>
						</item-value>
					</editor-item>
					<editor-item>
						<item-title>
							<GuideLabel guideSlug="sch_total_days"/>
						</item-title>
						<item-value class="totaldays">{ this.state.totalDays > 0 ? this.state.totalDays : null }</item-value>
					</editor-item>
				</editor-group>

				<editor-group>
					<editor-title>{ localise('sch_actions') }</editor-title>
				</editor-group>
					<editor-item class="full">
						<item-title>
							<GuideLabel guideSlug="sch_milestone"/>
						</item-title>
						<item-value>
							<SelectBox
								value={ this.state.milestoneId }
								options={
									this.props.milestones
										.map(
											milestone =>
											({
												value: milestone.id,
												label: milestone.description
											})
										)
								}
								onChange={ this.handleModelChange.bind(this, 'milestoneId') }
							/>
						</item-value>
					</editor-item>
					<editor-item class="full">
						<item-title>
							<GuideLabel guideSlug="sch_task_status"/>
						</item-title>
						<item-value>
							<SelectBox
								value={ this.state.statusId }
								onChange={ this.handleModelChange.bind(this, 'statusId') }
								options={
									taskStates.map(
										state =>
										({
											value: state,
											label: localise(`tsk_state_${state}`)
										})
									)
								}
							/>
						</item-value>
					</editor-item>
			</schedule-editor>
		);
	}
}


class ScheduleEditor extends React.Component {

	static propTypes = {
		milestones: React.PropTypes.array.isRequired,
		members: React.PropTypes.array.isRequired,
		task: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired
	}

	static defaultProps = {
		task: {}
	}

	componentDidMount() {}

	handleBeforeClose() {
		return !!this.close;
	}

	passChanges(model) {
		!!this.props.onChange && this.props.onChange(model);
	}

	handleClose() {
		this.close = true;
		this.refs.dropdown.close();
		this.close = false;
	}

	render() {
		return (
				<DropDown
					ref="dropdown"
					beforeClose={ this.handleBeforeClose.bind(this) }
					position="right bottom"
					content={
						<ScheduleEditorContent
							milestones={ this.props.milestones }
							members={ this.props.members }
							task={ this.props.task }
							onClose={ this.handleClose.bind(this) }
							onChange={ this.passChanges.bind(this) }
						/>
					}
				>
					<IconButton>more_vert</IconButton>
				</DropDown>

		);
	}
}
