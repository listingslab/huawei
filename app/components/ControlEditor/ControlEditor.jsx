import React  from 'react';
import moment from 'moment';
import Select from 'components/SelectBox/SelectBox';
import styles from './ControlEditor.css';
import GuideLabel from  'components/GuideLabel/GuideLabel';
import TextScaleArea from  'components/TextScaleArea/TextScaleArea';
import ComponentHeader from  'components/ComponentHeader/ComponentHeader';
import DeleteButton from  'components/DeleteButton/DeleteButton';
import controlStates from 'state/controlStates';
import localise from 'state/localisation';

export default class ControlEditor extends React.Component {
	static defaultProps = {
		members: []
	}

	static propTypes = {
		model: React.PropTypes.object.isRequired,
		members: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func.isRequired,
		onDelete: React.PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.state = {
		};
	}

	componentWillMount() {
		this.setState(this.props.model);
	}

	componentWIllReceiveProps(props) {
		this.setState(props.model);
	}

	handleValueChanges(id, value) {
		let newState = {};
		newState[id] = value;
		this.props.onChange && this.props.onChange(newState);
		this.setState(newState);
	}

	propagateDelete() {
		this.props.onDelete && this.props.onDelete();
	}

	render() {
		return (
			<control-editor class={ styles.ControlEditor }>
				<ComponentHeader
					title={ localise('ctrled_ctrl_plan') }
					class="blue"
					index={ this.props.index }
					actions={
						<DeleteButton messageSlug="confirm_message_control" onConfirm={ this.propagateDelete.bind(this) }/>
					}
				/>
					<editor-content>
						<editor-items>
							<editor-item>
								<item-title>
									{ localise('ctrled_date_time') }
								</item-title>
								<item-value>
									{
										moment(this.state.created)
											.format("LLL")

									}
								</item-value>
							</editor-item>
							<editor-item>
								<item-title>
									<GuideLabel guideSlug="ctrled_plan"/>
								</item-title>
								<item-value>
									<Select
										clearable={ false }
										value={ this.state.plan }
										onChange={ this.handleValueChanges.bind(this, 'plan') }
										options={
											controlStates.plan.map(
												opt => ({
													value: opt,
													label: localise(`menu_${opt}`)
												})
											)
										}
									/>
								</item-value>
							</editor-item>
							<editor-item>
								<item-title>
									<GuideLabel guideSlug="ctrled_status"/>
								</item-title>
								<item-value>
									<Select
										clearable={ false }
										value={ this.state.status }
										onChange={ this.handleValueChanges.bind(this, 'status') }
										options={
											controlStates.status.map(
												opt => ({
													value: opt,
													label: localise(`tsk_state_${opt}`)
												})
											)
										}
									/>
								</item-value>
							</editor-item>
							<editor-item>
								<item-title>
									<GuideLabel guideSlug="ctrled_responsible"/>
								</item-title>
								<item-value>
									<Select
										clearable={ false }
										value={ this.state.responsible }
										onChange={ this.handleValueChanges.bind(this, 'responsible') }
										options={
											this.props.members
												.map(
													member => ({
														value: member.id,
														label: member.name
													})
												)
										}
									/>
								</item-value>
							</editor-item>
						</editor-items>
						<editor-text>
							<text-item>
								<item-title>
									<GuideLabel guideSlug="ctrled_plan_deviation"/>
								</item-title>
								<item-value>
									<TextScaleArea
										onChange={ this.handleValueChanges.bind(this, 'deviation') }
										value={ this.state.deviation }
									/>
								</item-value>
							</text-item>
							<text-item>
								<item-title>
									<GuideLabel guideSlug="ctrled_corrective_actions"/>
								</item-title>
								<item-value>
									<TextScaleArea
										value={ this.state.action }
										onChange={ this.handleValueChanges.bind(this, 'action') }
									/>
								</item-value>
							</text-item>
							<text-item>
								<item-title>
									<GuideLabel guideSlug="ctrled_lessons_learned"/>
								</item-title>
								<item-value>
									<TextScaleArea
										value={ this.state.lesson }
										onChange={ this.handleValueChanges.bind(this, 'lesson') }
									/>
								</item-value>
							</text-item>
						</editor-text>
					</editor-content>
			</control-editor>
		);
	}
}
