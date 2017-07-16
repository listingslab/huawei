import React from 'react';
import underscored from 'underscore.string/underscored';
import styles from './CommunicationEditor.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import Select from 'components/SelectBox/SelectBox';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import communicationGroups from 'state/communicationGroups';
import localise from 'state/localisation';

export default class CommunicationEditor extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		model: React.PropTypes.object.isRequired,
		members: React.PropTypes.array.isRequired
	}

	constructor() {
		super();
		this.state = {};
	}

	componentWillMount() {
		!!this.props.model.communicationPlan &&
		this.setState(this.props.model.communicationPlan);
	}

	handleHeaderSelection(groupKey, event) {
		let checked = event.target.checked;
		let newState = {};
		communicationGroups[groupKey]
			.forEach(
				item => newState[item] = checked
			);
		this.propagateState(newState);
	}

	handleOptionSelection(optionKey, event) {
		let checked = event.target.checked;
		let newState = {};
		newState[optionKey] = checked;
		this.propagateState(newState);
	}

	handleSelectChange(key, value) {
		let newState = {};
		newState[key] = value;
		this.propagateState(newState);
	}

	handleExpand() {
		let newState = {
			expanded: !this.state.expanded
		};
		this.setState(newState);
	}

	propagateState(state) {
		this.setState(
			state,
			() => {
				let changes = Object.assign({}, this.state);
				delete changes.expanded;
				!!this.props.onChange && this.props.onChange(changes);
			}
		);
	}

	shouldHeaderBeChecked(headerKey) {
		return communicationGroups[headerKey]
		.every(
			item => !!this.state[item]
		);
	}

	render() {
		return (
			<communication-editor class={ styles.CommunicationEditor }>
				<ComponentHeader
					title={ this.props.model.name }
					class="blue"
					actions={
						<ExpandButton
							angle={ this.state.expanded ? -180 : 0 }
							onClick={  this.handleExpand.bind(this) }
						/>
					}
				/>
				<editor-member>
					<member-info>
						<info-title>
							{ localise('comms_info_id') }
						</info-title>
						<info-value>
							{ this.props.model.companyId }
						</info-value>
					</member-info>
					<member-info>
						<info-title>
							{ localise('comms_info_mobile') }
						</info-title>
						<info-value>
							{ this.props.model.mobile }
						</info-value>
					</member-info>
					<member-info>
						<info-title>
							{ localise('comms_info_email') }
						</info-title>
						<info-value>
							{ this.props.model.email }
						</info-value>
					</member-info>
					<member-info>
						<info-title>
							{ localise('comms_info_role') }
						</info-title>
						<info-value>
							{ localise('role_' + this.props.model.role) }
						</info-value>
					</member-info>
				</editor-member>
				<editor-row>
					<span><GuideLabel guideSlug="comms_info_responsible"/></span>
					<Select
						value={ this.state.responsibleId }
						onChange={ this.handleSelectChange.bind(this, 'responsibleId') }
						options={
							this.props.members.map(
								member => ({
									value: member.id,
									label: member.name
								})
							)
						}
					/>
				</editor-row>
				<editor-row>
					<span><GuideLabel guideSlug="comms_info_frequency"/></span>
					<Select
						value={ this.state.frequency }
						onChange={ this.handleSelectChange.bind(this, 'frequency') }
						options={
							[
								{
									value: 'day',
									label: localise('comms_day')
								},
								{
									value: 'week',
									label: localise('comms_week')
								}
							]
						}
					/>
				</editor-row>
				<editor-options class={ this.state.expanded ? 'expanded' : null }>
					<header><GuideLabel guideSlug="comms_project_updates"/></header>
					{
						Object
							.keys(communicationGroups)
							.map(
								group =>
								<editor-option key={ group }>
									<option-title>
										<label>
											<input
												type="checkbox"
												checked={ this.shouldHeaderBeChecked(group) }
												onChange={ this.handleHeaderSelection.bind(this, group) }
											/>
											{ localise( `comms_${underscored(group)}` ) }
										</label>
									</option-title>
									{
										communicationGroups[group].map(
											option =>
											<option-item key={ option }>
												<label>
													<input
														checked={ this.state[option] }
														type="checkbox"
														onChange={ this.handleOptionSelection.bind(this, option) }
													/>
													{ localise( `comms_${underscored(option)}` ) }
												</label>
											</option-item>
										)
									}
								</editor-option>
							)
					}
				</editor-options>
			</communication-editor>
		);
	}
}
