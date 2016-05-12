import React from 'react';
import styles from './RiskDescription.css';
import ReactSelect from 'components/SelectBox/SelectBox';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import IconButton from 'components/IconButton/IconButton';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import Locale from 'state/localisation';
import riskStates from 'state/riskStates';
export default class RiskDescription extends React.Component {
	static propTypes = {
		model: React.PropTypes.object.isRequired,
		members: React.PropTypes.array.isRequired,
		index: React.PropTypes.number,
		onChange: React.PropTypes.func.isRequired,
		onDelete: React.PropTypes.func.isRequired

	}

	static defaultProps = {
		members: [],
		model: {}
	}

	constructor() {
		super();
		this.state = {
			expanded: false,
			model: {}
		};
	}

	componentWillMount() {
		this.setState({
			model: this.props.model,
			expanded: this.props.expanded
		});
	}

	handleExpand() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	handleChange(key, value) {
		if ( key === 'impact' && value[0] !== (this.state.model[key] || '')[0] ) {
			this.state.model.strategy = null;
		}
		this.state.model[key] = value;
		!!this.props.onChange && this.props.onChange(this.state.model);
		this.setState({
			model: this.state.model
		});
	}

	handleDelete() {
		!!this.props.onDelete &&  this.props.onDelete();
	}

	render() {
		return (
			<risk-description class={ styles.RiskDescription }>
				<ComponentHeader
					index={ this.props.index }
					class="blue"
					title={ Locale('risk_plan') }
					actions={
						[
							<DeleteButton
								key="clear"
								messageSlug="confirm_message_risk"
								onConfirm={ this.handleDelete.bind(this) }
							>
								delete
							</DeleteButton>,
							<ExpandButton
								key="expand"
								onClick={ this.handleExpand.bind(this) }
								angle={ this.state.expanded ? -180 : 0 }
							/>
						]
					}
				>
					<TextScaleArea
						value={ this.state.model.description }
						onChange={ this.handleChange.bind(this, 'description') }
					/>
				</ComponentHeader>
				<description-details class={ this.state.expanded ? 'expanded' : null }>
					<detail-item>
						<GuideLabel guideSlug="risk_area"/>
						<ReactSelect
							options={
								riskStates.area.map(
									opt => ({
										value: opt,
										label: Locale(`risk_state_${opt}`)
									})
								)
							}
							value={ this.state.model.area }
							onChange={ this.handleChange.bind(this, 'area') }
						/>
					</detail-item>
					<detail-item>
						<GuideLabel guideSlug="risk_probability"/>
						<ReactSelect
							options={
								riskStates.probability.map(
									opt => ({
										value: opt,
										label: Locale(`risk_state_${opt}`)
									})
								)
							}
							value={ this.state.model.probability }
							onChange={ this.handleChange.bind(this, 'probability') }
						/>
					</detail-item>
					<detail-item>
						<GuideLabel guideSlug="risk_impact"/>
						<ReactSelect
							options={
								riskStates.impact.map(
									opt => ({
										value: opt,
										label: Locale(`risk_state_${opt}`)
									})
								)
							}
							value={ this.state.model.impact }
							onChange={ this.handleChange.bind(this, 'impact') }
						/>
					</detail-item>
					<detail-item>
						<GuideLabel guideSlug="risk_level"/>
						<ReactSelect
							options={
								riskStates.level.map(
									opt => ({
										value: opt,
										label: Locale(`risk_state_${opt}`)
									})
								)
							}
							value={ this.state.model.level }
							onChange={ this.handleChange.bind(this, 'level') }
						/>
					</detail-item>
					<detail-item>
						<GuideLabel guideSlug="risk_response_strategy"/>
						<ReactSelect
							options={
								riskStates[!!this.state.model.impact && this.state.model.impact[0] === '+' ?  'strategyPositive' : 'strategyNegative'].map(
									opt => ({
										value: opt,
										label: Locale(`risk_state_${opt}`)
									})
								)
							}
							value={ this.state.model.strategy }
							onChange={ this.handleChange.bind(this, 'strategy') }
						/>
					</detail-item>
					<detail-item>
						<GuideLabel guideSlug="risk_status"/>
						<ReactSelect
							options={
								riskStates.status.map(
									opt => ({
										value: opt,
										label: Locale(`risk_state_${opt}`)
									})
								)
							}
							value={ this.state.model.status }
							onChange={ this.handleChange.bind(this, 'status') }
						/>
					</detail-item>
					<detail-item>
						<GuideLabel guideSlug="risk_responsible"/>
						<ReactSelect
							options={
								this.props.members.map(
									member => ({
										value: member.id,
										label: member.name
									})
								)
							}
							value={ this.state.model.responsible }
							onChange={ this.handleChange.bind(this, 'responsible') }
						/>
					</detail-item>
					<detail-section>
						<ComponentHeader
							class="blue"
							title={ Locale('risk_response_plan') }
						>
							<TextScaleArea
								value={ this.state.model.plan }
								onChange={ this.handleChange.bind(this, 'plan') }
							/>
						</ComponentHeader>
					</detail-section>

				</description-details>
			</risk-description>
		);
	}
}
