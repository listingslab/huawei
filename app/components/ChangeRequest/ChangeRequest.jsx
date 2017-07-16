import React from 'react';
import styles from './ChangeRequest.css';
import Select from 'components/SelectBox/SelectBox';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import IconButton from 'components/IconButton/IconButton';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import ChangeStream from 'streams/Changes';
import localise from 'state/localisation';

export default class ChangeRequest extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		members: React.PropTypes.array.isRequired,
		model: React.PropTypes.object.isRequired,
		index: React.PropTypes.number
	}

	constructor() {
		super();
		this.state = {
			expanded: false,
			impact: {}
		};
		this.stream = new ChangeStream(false);
	}

	componentWillMount() {
		this.setState(this.props.model);
	}

	control = [
		'accept',
		'pending',
		'reject'
	]

	followUp = [
		'move_change_charter',
		'pending',
		'none'
	]

	impactValues = [
		'objectives',
		'risk',
		'time',
		'cost',
		'scope',
		'quality'
	]

	handleExpand() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	handleImpactChoice(value, event) {
		let selections = (
			Object
				.keys(this.state.impact)
				.filter( key => this.state.impact[key] )
				.length
		);

		if ( selections < 4 || !event.target.checked ) {
			this.state.impact[value] = event.target.checked;
			this.propagateChanges({
				impact: this.state.impact
			});
		}
	}

	handleValueChange(key, value) {
		let newState = {};
		newState[key] = value || null;
		this.propagateChanges(newState);
	}

	handleDeleteRequest() {
		this.stream.delete(this.props.model.id);
	}

	propagateChanges(updates) {
		this.setState(updates);
		!!this.props.onChange && this.props.onChange(updates);
	}

	getMembers() {
		return this.props.members
			.map(
				member =>
				({
					value: member.id,
					label: member.name
				})
			);
	}

	render() {
		return (
			<change-request
				class={
					`${styles.ChangeRequest} ${ this.state.expanded ? 'expanded' : '' }`
				}
			>
				<ComponentHeader
					index={ this.props.index }
					class="blue"
					title={ localise('chgreq_change_request') }
					actions={ [
						<DeleteButton
							key="del"
							messageSlug="confirm_message_change"
							onConfirm={ this.handleDeleteRequest.bind(this) }
						/>,
						<ExpandButton
							key="exp"
							onClick={ this.handleExpand.bind(this) }
							angle={ this.state.expanded ? 0 : -180 }
						/>
					] }
				/>
				<request-detail>
					<request-field>
						<GuideLabel guideSlug="chgreq_description"/>
						<TextScaleArea
							value={ this.state.description }
							onChange={ this.handleValueChange.bind(this, 'description') }
						/>
					</request-field>
					<hidden-fields>
						<request-field>
							<GuideLabel guideSlug="chgreq_impact"/>
							<field-group>
								{
									this.impactValues
										.map(
											value =>
											<label key={ value }>
												<input
													checked={ !!this.state.impact[value] }
													type="checkbox"
													onClick={ this.handleImpactChoice.bind(this, value) }
												/>
												{ localise(`chgreq_${value}`) }
											</label>
										)
								}
							</field-group>
						</request-field>
						<request-field>
							<GuideLabel guideSlug="chgreq_decision"/>
							<Select
								value={ this.state.decision }
								onChange={ this.handleValueChange.bind(this, 'decision') }
								options={
									this.control.map(
										value =>
										({
											value: value,
											label: localise(`chgreq_${value}`)
										})
									)
								}
							/>
						</request-field>
						<request-field>
							<GuideLabel guideSlug="chgreq_reason"/>
							<TextScaleArea
								value={ this.state.reason }
								onChange={ this.handleValueChange.bind(this, 'reason') }
							/>
						</request-field>
						<request-field>
							<GuideLabel guideSlug="chgreq_follow_up"/>
							<Select
								value={ this.state.followUp }
								onChange={ this.handleValueChange.bind(this, 'followUp') }
								options={
									this.followUp.map(
										value =>
										({
											value: value,
											label: localise(`chgreq_${value}`)
										})
									)
								}
							/>
						</request-field>
						<request-group>
							<request-field>
								<GuideLabel guideSlug="chgreq_requester"/>
								<Select
									value={ this.state.requesterId }
									options={ this.getMembers() }
									onChange={ this.handleValueChange.bind(this, 'requesterId') }
								/>
							</request-field>
							<request-field>
								<GuideLabel guideSlug="chgreq_responsible"/>
								<Select
									value={ this.state.responsibleId }
									options={ this.getMembers() }
									onChange={ this.handleValueChange.bind(this, 'responsibleId') }
								/>
							</request-field>
						</request-group>
					</hidden-fields>
				</request-detail>
			</change-request>
		);
	}
}
