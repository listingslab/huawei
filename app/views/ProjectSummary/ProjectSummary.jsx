import React from 'react';
import Select from 'components/SelectBox/SelectBox';
import numeral from 'numeral';
import styles from './ProjectSummary.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import IconButton from 'components/IconButton/IconButton';
import DueDateAction from 'components/DueDateAction/DueDateAction';
import localise from 'state/localisation';
import SummaryStream from 'streams/Summary';
import MembersStream from 'streams/Members';
import DeliverablesStream from 'streams/Deliverables';
import appState from 'state/app';

export default class ProjectSummary extends React.Component {

	constructor() {
		super();
		this.state = {
			members: [],
			summary: {},
			deliverables: [],
			costs: {},
			specialMembers: {}
		};
		this.memberState = {};
		this.stream = new SummaryStream;
		this.memberStream = new MembersStream;
		this.deliverablesStream = new DeliverablesStream;
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleStreamUpdate.bind(this)
		);
		this.memberStream.subscribe(
			this.handleMembersUpdate.bind(this)
		);
		this.deliverablesStream.subscribe(
			this.handleDelverablesUpdate.bind(this)
		);
		this.stream.read();
		this.memberStream.read();
		this.deliverablesStream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
		this.memberStream.unsubscribe();
		this.deliverablesStream.unsubscribe();
	}

	memberFields = [
		{
			label: 'sum_pm',
			key: 'projectManager'
		},
		{
			label: 'sum_sponsor',
			key: 'sponsor'
		},
		{
			label: 'sum_prepared_by',
			key: 'prepared'
		},
		{
			label: 'sum_reviewed_by',
			key: 'reviewer'
		}
	]

	handleMembersUpdate(res) {
		let memberModels = res.body.items;
		let self = this;
		function getMemberByRole(role) {
			return (
				memberModels
					.find(
						member =>
						member.role === role
					) || {}
			);
		}

		this.setState({
			members: memberModels,
			specialMembers: {
				sponsor: getMemberByRole('sponsor').id,
				projectManager: getMemberByRole('project_manager').id
			}
		});
	}

	handleStreamUpdate(res) {
		this.setState({
			summary: res.body || {}
		});
	}

	handleDelverablesUpdate(res) {
		let deliverables = res.body.items || [];
		let totals = {
			budget: 0,
			actual: 0,
			delta: 0
		};

		if ( deliverables.length > 0 ) {
			let tasks = (
				deliverables
				.map(
					deliverable => deliverable.tasks
				)
				.reduce(
					(a, b) => a.concat(b)
				)
			);
			tasks.forEach(task =>{
				task.activities.forEach(activity => {
					totals.budget += activity.resources.budget || 0;
					totals.actual += activity.resources.total || 0;
					totals.delta += activity.resources.delta || 0;
				});
			});

			Object
				.keys(totals)
				.forEach(
					total =>
					totals[total] = numeral(totals[total]).format('-0,0.0')
				);
		}

		this.setState({
			deliverables: deliverables,
			costs: totals
		});
	}

	handleDelverableSummaryUpdate(model, value) {
		model.summary = value;
		this.deliverablesStream.updateDeliverable(model.id, { summary: value });
		this.setState({
			deliverableUpdated: Date.now()
		});
	}

	handleValueChange(key, value) {
		this.state.summary[key] = value || null;
		this.setState({
			summaryUpdated: Date.now()
		});
		let model = {};
		model[key] = this.state.summary[key];
		this.stream.update(model);
	}

	getActualDeliverables() {
		return this.state.deliverables
			.filter(
				deliverable =>
				!!deliverable.approved
			);
	}

	// summaryDate: null,
	// projectManager: null,
	// sponsor: null,
	// reviewer: null,
	// prepared: null,
	// startDate: null,
	// finishDatePlanned: null,
	// finishDateActual: null,
	// scheduleDeviation: null,
	// costPlanned: null,
	// costActual: null,
	// costDeviation: null,
	// scopePlannedDeliverables: null,
	// scopeActualDeliverables: null,
	// scopeDeviation: null,
	// lessonsLearned: null

	render() {
		return (
			<project-summary class={ styles.ProjectSummary }>
				<ProcessHeader/>
				<h3 className="noprint">
					{ localise('guide_work_area') }
				</h3>
				<summary-detail>
					<detail-information>
						<ComponentHeader
								title={ <GuideLabel guideSlug="sum_information"/> }
								class="blue"
								index="1"
							/>
						<section-group>
							<section>
								<section-title>{ localise('sum_project_name') }</section-title>
								<section-field><b>{ appState.project && appState.project.title }</b></section-field>
							</section>
							<section>
								<section-title>{ localise('sum_summary_date') }</section-title>
								<section-field>
									<DueDateAction
										date={ this.state.summary.summaryDate }
										onChange={ this.handleValueChange.bind(this, 'summaryDate') }
									/>
								</section-field>
							</section>

							{
								this.memberFields.map(
									input =>
									<section key={ input.key }>
										<section-title>{ localise(input.label) }</section-title>
										<section-field>
											<Select
												value={ this.state.summary[input.key] || this.state.specialMembers[input.key] }
												onChange={ this.handleValueChange.bind(this, input.key) }
												options={
													this.state.members
														.map(
															member =>
															({
																value: member.id,
																label: member.name
															})
														)
												}
											/>
										</section-field>
									</section>
								)
							}
						</section-group>
					</detail-information>

					<ComponentHeader
							title={ localise('sum_review_analysis') }
							class="blue"
							index="2"
						/>
					<section-list>
						<ComponentHeader
							title={ <GuideLabel guideSlug="sum_schedule"/> }
							index="1"
						/>
						<section-group>
							<section>
								<section-title>{ localise('sum_start_date') }</section-title>
								<section-field>
									<DueDateAction
										date={ this.state.summary.startDate }
										onChange={ this.handleValueChange.bind(this, 'startDate') }
									/>
								</section-field>
							</section>
							<section>
								<section-title>{ localise('sum_plan_finish_date') }</section-title>
								<section-field>
									<DueDateAction
										date={ this.state.summary.finishDatePlanned }
										onChange={ this.handleValueChange.bind(this, 'finishDatePlanned') }
									/>
								</section-field>
							</section>
							<section>
								<section-title>{ localise('sum_act_finish_date') }</section-title>
								<section-field>
									<DueDateAction
										date={ this.state.summary.finishDateActual }
										onChange={ this.handleValueChange.bind(this, 'finishDateActual') }
									/>
								</section-field>
							</section>
						</section-group>
						<section>
							<section-title>
								<GuideLabel guideSlug="sum_sch_deviation"/>
							</section-title>
							<section-field>
								<TextScaleArea
									value={ this.state.summary.scheduleDeviation }
									onChange={ this.handleValueChange.bind(this, 'scheduleDeviation') }
								/>
							</section-field>
						</section>

						<ComponentHeader
							title={ <GuideLabel guideSlug="sum_cost"/> }
							index="3"
						/>
						<section-group>
							<section>
								<section-title>{ localise('sum_planned_cost') }</section-title>
								<section-field>
									<TextScaleArea
										value={ this.state.summary.costPlanned || this.state.costs.budget }
										onChange={ this.handleValueChange.bind(this, 'costPlanned') }
									/>
								</section-field>
							</section>
							<section>
								<section-title>{ localise('sum_actual_cost') }</section-title>
								<section-field>
									<TextScaleArea
										value={ this.state.summary.costActual || this.state.costs.actual }
										onChange={ this.handleValueChange.bind(this, 'costActual') }
									/>
								</section-field>
							</section>
						</section-group>
						<section>
							<section-title>
								<GuideLabel guideSlug="sum_cost_deviation"/>
							</section-title>
							<section-field>
								<TextScaleArea
									value={ this.state.summary.costDeviation }
									onChange={ this.handleValueChange.bind(this, 'costDeviation') }
								/>
							</section-field>
						</section>

						<ComponentHeader
							title={ localise('sum_scope') }
							index="4"
						/>
						<section>
							<section-title>
								<GuideLabel guideSlug="sum_planned_deliverables"/>
							</section-title>
							{
								this.state.deliverables
									.map(
										model =>
										<section-field key={ model.id }>
											<TextScaleArea
												value={ model.summary || model.description }
												onChange={ this.handleDelverableSummaryUpdate.bind(this, model) }
											/>
											<IconButton
												onClick={ this.handleDelverableSummaryUpdate.bind(this, model, null) }
											>
												undo
											</IconButton>
										</section-field>
									)
							}
						</section>
						<section>
							<section-title>
								<GuideLabel guideSlug="sum_actual_deliverables"/>
							</section-title>
							{
								this.getActualDeliverables()
									.map(
										model =>
										<section-field key={ model.id }>
											<TextScaleArea
												value={ model.summary || model.description }
												onChange={ this.handleDelverableSummaryUpdate.bind(this, model) }
											/>
											<IconButton
												onClick={ this.handleDelverableSummaryUpdate.bind(this, model, null) }
											>
												undo
											</IconButton>
										</section-field>
									)
							}
						</section>
						<section>
							<section-title>
								<GuideLabel guideSlug="sum_scope_deviation"/>
							</section-title>
							<section-field>
								<TextScaleArea
									value={ this.state.summary.scopeDeviation }
									onChange={ this.handleValueChange.bind(this, 'scopeDeviation') }
								/>
							</section-field>
						</section>
						<ComponentHeader
							title={ <GuideLabel guideSlug="sum_lessons_learned"/> }
							index="5"
						/>
						<section>
							<section-title>{ localise('sum_lessons') }</section-title>
							<section-field>
								<TextScaleArea
									value={ this.state.summary.lessons }
									onChange={ this.handleValueChange.bind(this, 'lessons') }
								/>
							</section-field>
						</section>
					</section-list>
				</summary-detail>
			</project-summary>
		);
	}
}
