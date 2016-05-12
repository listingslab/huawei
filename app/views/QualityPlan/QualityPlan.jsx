import React from 'react';
import styles from './QualityPlan.css';
import moment from 'moment';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import QualityEditor from 'components/QualityEditor/QualityEditor';
import DeliverableStream from 'streams/Deliverables';
import MembersStream from 'streams/Members';
import ProjectsStream from 'streams/Projects';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import Select from 'components/SelectBox/SelectBox';
import localise from 'state/localisation';
import DueDateAction from 'components/DueDateAction/DueDateAction';
import appState from 'state/app';
export default class QualityPlan extends React.Component {

	constructor() {
		super();
		this.state = {
			deliverables: [],
			members: [],
			project: {}
		};
		this.deliverableStream = new DeliverableStream;
		this.membersStream = new MembersStream;
		this.projectStream = new ProjectsStream;
	}

	componentWillMount() {
		this.deliverableStream.subscribe(
			this.handleDeliverableUpdate.bind(this)
		);
		this.membersStream.subscribe(
			this.handleMembersUpdate.bind(this)
		);
		this.projectStream.subscribe(
			this.handleProjectUpdate.bind(this)
		);

		this.deliverableStream.read();
		this.membersStream.read();
		this.projectStream.get(appState.projectId);
	}

	componentWillUnmount() {
		this.deliverableStream.unsubscribe();
		this.membersStream.unsubscribe();
		this.projectStream.unsubscribe();
	}

	handleDeliverableUpdate(res) {
		this.setState({
			deliverables: res.body.items
		});
	}

	handleMembersUpdate(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleEditorUpdate(id, updates) {
		this.deliverableStream.updateDeliverable(id, updates);
	}

	handleAcceptanceChanges(id, value) {
		let update = {};
		update[id] = value;
		this.projectStream.update(appState.projectId, update);
	}

	handleProjectUpdate(res) {
		this.setState({
			project: res.body
		});
	}

	render() {
		return (
			<quality-plan class={ styles.QualityPlan }>
				<ProcessHeader/>
				<header>
					<h3 className="noprint">
						{ localise('guide_work_area') }
					</h3>
				</header>
				<plan-area>
					{
						this.state
							.deliverables
							.sort((a, b)=>{
								let dueA = a.due;
								let dueB = b.due;
								if (!dueA) {
									return a.id - b.id;
								}
								if (!dueB) {
									return a.id - b.id;
								}
								return moment(dueB).isAfter(moment(dueA)) ? -1 : 1;
							})
							.map(
								(del, index) =>
								<QualityEditor
									key={ index }
									index={ index + 1 }
									model={ del }
									members={ this.state.members }
									onChange={ this.handleEditorUpdate.bind(this, del.id) }
								/>
							)
					}
					<plan-acceptance>
						<ComponentHeader
							class="blue"
							title={ localise('quality_close_phase') }
							index={ this.state.deliverables.length + 1 }
						/>
						<accpetance-content>
							<accpetance-title>
								<GuideLabel guideSlug="quality_responsible"/>
								<title-date>
									<DueDateAction
										placeholder={ localise('quality_close_date') }
										onChange={ this.handleAcceptanceChanges.bind(this, 'closeDate') }
										date={ this.state.project.closeDate }
									/>
								</title-date>
							</accpetance-title>
							<accpetance-value>
								<Select
									onChange={ this.handleAcceptanceChanges.bind(this, 'closedBy') }
									value={ this.state.project.closedBy }
									options={
										this.state.members
											.map(
												member => ({
													value: member.id,
													label: member.name
												})
											)
									}
								/>
							</accpetance-value>
						</accpetance-content>

					</plan-acceptance>
				</plan-area>
			</quality-plan>
		);
	}
}