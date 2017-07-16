import React from 'react';
import styles from './Charter.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import CharterItem from 'components/CharterItem/CharterItem';
import CharterList from 'components/CharterList/CharterList';
import IconButton from 'components/IconButton/IconButton';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import CharterStream from 'streams/Charter';
import localise from 'state/localisation.js';

export default class Charter extends React.Component {

	constructor() {
		super();
		this.state = {
			model: {}
		};
		this.dataModel = {};
		this.charterStream = new CharterStream();
		this.subscription = null;
	}

	componentWillMount() {
		this.charterStream.subscribe(
			({ body })=>{
				this.setState({
					model: body
				});
			},
			(error)=>{
				console.log(error, 'error?');
			}
		);
	}

	componentDidMount() {
		this.charterStream.read();
	}

	componentWillUnmount() {
		this.charterStream.unsubscribe();
	}

	handleNewDeliverable() {
		this.charterStream.createDeliverable();
	}

	handleDeleteDeliverable(deliverable) {
		this.charterStream.deleteDeliverable(deliverable.id);
	}

	handleDeleteMilestone(milestone) {
		this.charterStream.deleteMilestone(milestone.id);
	}

	handleDeliverableChange(model, refresh) {
		this.charterStream.updateDeliverable(
			model.id,
			{
				description: model.value,
				due: model.duedate,
				note: model.note,
				qualityCriteria: model.qualityCriteria
			}
		);
		window.setTimeout(
			()=>{
				refresh && this.charterStream.read();
			}, 100
		);
	}

	handleNewMilestone() {
		this.charterStream.createMilestone();
	}

	handleNewMilestoneChange(model, refresh) {
		this.charterStream.updateMilestone(
			model.id,
			{
				description: model.value,
				due: model.duedate,
				note: model.note
			}
		);
		window.setTimeout(
			()=>{
				refresh && this.charterStream.read();
			}, 100
		);
	}

	handleItemChange(inputName, data) {
		let state = { model: this.state.model || {} };
		this.state.model[inputName] = data;
		this.putChanges(this.state.model);
		// this.setState(state, this.putChanges.bind(this));
	}

	putChanges() {
		this.charterStream.update(this.state.model);
	}

	render() {
		return (
			<charter-view class={ styles.Charter }>
				<ProcessHeader/>

				<h3 className="noprint">
					{ localise('guide_work_area') }
				</h3>
				<charter-form>
					<CharterItem
						heading={<GuideLabel guideSlug="guide_business_need"/>}
						placeholder={ localise('dpc_business_need_placeholder') }
						index="1"
						onChange={ this.handleItemChange.bind(this, 'businessNeed') }
					>
						{ this.state.model.businessNeed }
					</CharterItem>

					<CharterItem
						heading={ <GuideLabel guideSlug="guide_objectives"/> }
						index="2"
						onChange={ this.handleItemChange.bind(this, 'objectives') }
						placeholder={ localise('dpc_objectives_placeholder') }
					>
						{ this.state.model.objectives }
					</CharterItem>

					<CharterList
						actions={ <IconButton onClick={ this.handleNewDeliverable.bind(this) }>playlist_add</IconButton> }
						heading={ <GuideLabel guideSlug="guide_deliverables"/> }
						onChange={ this.handleDeliverableChange.bind(this) }
						placeholder={ localise('deliverable_placeholder') }
						onDelete={ this.handleDeleteDeliverable.bind(this) }
						deleteMessageSlug="confirm_message_deliverable"
						index="3"
						items={
							this.state.model.deliverables &&
							this.state.model.deliverables.map( (deliverable) => {
								return {
									id: deliverable.id,
									value: deliverable.description,
									due: deliverable.due,
									subview: {
										qualityCriteria: {
											value: deliverable.qualityCriteria,
											title: 'Quality Criteria',
											placeholder: 'Describe your Quality Criteria...'
										},
										note: {
											value: deliverable.note,
											title: 'Note',
											placeholder: 'Enter any notes about your deliverable...'
										}

									}
								};
							})
						}
					/>

					<CharterItem
						heading={ <GuideLabel guideSlug="guide_pre_approach" /> }
						index="4"
						onChange={ this.handleItemChange.bind(this, 'approach') }
					>
						{ this.state.model.approach }
					</CharterItem>

					<CharterList
						actions={ <IconButton onClick={ this.handleNewMilestone.bind(this) }>playlist_add</IconButton> }
						onChange={ this.handleNewMilestoneChange.bind(this) }
						onDelete={ this.handleDeleteMilestone.bind(this) }
						heading={ <GuideLabel guideSlug="guide_milestones" /> }
						index="5"
						placeholder={ localise('milestone_placeholder') }
						items={
							this.state.model.milestones &&
							this.state.model.milestones.map( (milestone) => {
								return {
									id: milestone.id,
									value: milestone.description,
									due: milestone.due,
									subview: {
										note: {
											value: milestone.note,
											title: localise('milestone_note_title'),
											placeholder: localise('milestone_note_placeholder')
										}
									}
								};
							})
						}
					/>

					<CharterItem
						heading={ <GuideLabel guideSlug="guide_assumptions"/> }
						index="6"
						onChange={ this.handleItemChange.bind(this, 'assumptionsConstraints') }
					>
						{ this.state.model.assumptionsConstraints }
					</CharterItem>
				</charter-form>
			</charter-view>
		);
	}
}
