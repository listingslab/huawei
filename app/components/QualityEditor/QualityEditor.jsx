import React from 'react';
import Select from 'components/SelectBox/SelectBox';
import styles from './QualityEditor.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import DueDateAction from 'components/DueDateAction/DueDateAction';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import localise from 'state/localisation';

export default class QualityEditor extends React.Component {
	static propTypes = {
		index: React.PropTypes.number.isRequired,
		model: React.PropTypes.object.isRequired,
		members: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.state = {
		};
	}

	componentWillMount() {
		this.setState(this.props.model);
	}

	handleModelChange(id, value) {
		let newState = {};
		newState[id] = value || null;
		this.propagateChanges(newState);
	}

	handleResponsibliltyChange(value) {
		let responsibility = this.state.responsibilityMatrix;
		responsibility.responsible = value;
		this.propagateChanges({
			responsibilityMatrix: responsibility
		});
	}

	propagateChanges(state) {
		this.props.onChange && this.props.onChange(state);
		this.setState(state);
	}

	getMemberOptions() {
		return this.props
			.members
			.map( member => ({
				value: member.id,
				label: member.name || `Member: ${member.id}`
			}) );
	}

	render() {
		return (
			<quality-editor class={ styles.QualityEditor }>
				<ComponentHeader
					title={ localise('quality_deliverable') }
					class="blue"
					index={ this.props.index }

				/>
				<detail-description>
					{ this.state.description }
				</detail-description>
				<editor-detail>

					<detail-item>
						<item-title>
							<GuideLabel guideSlug="quality_criteria"/>
						</item-title>
						<item-value>
							<TextScaleArea
								onChange={ this.handleModelChange.bind(this, 'qualityCriteria') }
								value={ this.state.qualityCriteria }
							/>
						</item-value>
					</detail-item>
					<detail-item>
						<item-title>
							<GuideLabel guideSlug="quality_issue"/>
						</item-title>
						<item-value>
							<TextScaleArea
								onChange={ this.handleModelChange.bind(this, 'qualityIssue') }
								value={ this.state.qualityIssue }
							/>
						</item-value>
					</detail-item>
					<detail-item>
						<item-title>
							<GuideLabel guideSlug="quality_responsible"/>
						</item-title>
						<item-value>
							<Select
								options={ this.getMemberOptions() }
								onChange={ this.handleResponsibliltyChange.bind(this) }
								value={ this.state.responsibilityMatrix && this.state.responsibilityMatrix.responsible }
							/>
						</item-value>
					</detail-item>
					<detail-item>
						<item-title>
							<title-label>
								<GuideLabel guideSlug="quality_fix"/>
							</title-label>
							<title-action>
								<action-label>{ localise('quality_date_fix') }</action-label>
								<DueDateAction
									onChange={ this.handleModelChange.bind(this, 'fixedWhen') }
									date={ this.state.fixedWhen }
									placeholder={ localise('quality_date') }
								/>
							</title-action>
						</item-title>
						<item-value>
							<TextScaleArea
								onChange={ this.handleModelChange.bind(this, 'fixDescription') }
								value={ this.state.fixDescription }
							/>
						</item-value>
					</detail-item>
					<detail-item>
						<item-title>
							<title-label>
								<GuideLabel guideSlug="quality_approver"/>
							</title-label>
							<title-action>
								<action-label>{ localise('quality_date_approved') }</action-label>
								<DueDateAction
									onChange={ this.handleModelChange.bind(this, 'approvedWhen') }
									date={ this.state.approvedWhen }
									placeholder={ localise('quality_date') }
								/>
							</title-action>
						</item-title>
						<item-value>
							<Select
								options={ this.getMemberOptions() }
								value={ this.state.approved }
								onChange={ this.handleModelChange.bind(this, 'approved') }
							/>
						</item-value>
					</detail-item>
				</editor-detail>
			</quality-editor>
		);
	}
}