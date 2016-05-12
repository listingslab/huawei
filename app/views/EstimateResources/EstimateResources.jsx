import React from 'react';
import numeral from 'numeral';
import styles from './EstimateResources.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import ResourceList from 'components/ResourceList/ResourceList';
import localise from 'state/localisation';
import DeliverableStream from 'streams/Deliverables';
export default class EstimateResources extends React.Component {

	// This view became a little over complicated and is modifying its own models
	// It currently works but could lead to problems later.
	// Needs refactoring if time permits


	constructor() {
		super();
		this.state = {
			tasks: [],
			expanded: {},
			totals: {
				budget: 0,
				actual: 0,
				delta: 0
			}
		};
		this.stream = new DeliverableStream;
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleStreamUpdate.bind(this)
		);
		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleStreamUpdate(res) {
		let items = [];
		res.body.items.forEach(item => {
			item.tasks.forEach(task => items.push(task));
		});
		this.updateTotals(items);
		this.setState({
			tasks: items
		});
	}

	updateTotals(tasks) {
		let totals = {
			budget: 0,
			actual: 0,
			delta: 0
		};

		tasks.forEach(task =>{
			task.activities.forEach(activity => {
				totals.budget += activity.resources.budget || 0;
				totals.actual += activity.resources.total || 0;
				totals.delta += activity.resources.delta || 0;
			});
		});
		this.setState({
			totals: totals
		});
	}

	handleExpandItem(index) {
		this.state.expanded[index] = !this.state.expanded[index];
		this.forceUpdate();
	}

	handleResourceEstimateChange(activity, update) {
		this.stream.updateActivity(
			activity.$projectId,
			activity.$taskId,
			activity.id,
			{
				resources: update
			}
		);

		Object.assign(activity.resources, update);
		this.updateTotals(this.state.tasks);
	}

	render() {
		return (
			<estimate-resource class={ styles.EstimateResources }>
				<ProcessHeader/>
				<h3>
					{ localise('guide_work_area') }
				</h3>

				<resource-total>
					<ComponentHeader
						class="blue"
						title={ localise('est_proj_total') }
					/>
					<total-detail>
						<detail-item>
							<item-title>
								<GuideLabel guideSlug="est_budget_cost"/>
							</item-title>
							<item-cost>{ numeral(this.state.totals.budget).format('(0,0.0)') }</item-cost>
						</detail-item>
						<detail-item>
							<item-title>
								<GuideLabel guideSlug="est_actual"/>
							</item-title>
							<item-cost>{ numeral(this.state.totals.actual).format('(0,0.0)') }</item-cost>
						</detail-item>
						<detail-item>
							<item-title>
								<GuideLabel guideSlug="est_und_over"/>
							</item-title>
							<item-cost>{ numeral(this.state.totals.delta).format('(0,0.0)') }</item-cost>
						</detail-item>
					</total-detail>
				</resource-total>

				<resource-tasks>
					<ComponentHeader
						class="blue"
						title={ localise('est_tasks') }
					/>
					{
						this.state.tasks.map(
							(task, index) =>
							<task-breakdown key={ task.id }>
								<ComponentHeader
									title={ task.title }
									index={ index + 1 }
								/>
								<breakdown-activities>
									<ComponentHeader
										class={ task.activities.length > 0 ? 'blue' : null }
										title={ task.activities.length > 0 ? localise('est_activites') : localise('est_add_activities')}
									/>
									{
										task.activities.map(
											(activity, index) =>
											<breakdown-activity key={ activity.id }>
												<ComponentHeader
													index={ index + 1 }
													title={ activity.description }
													actions={
														<ExpandButton
															onClick={ this.handleExpandItem.bind(this, activity.id) }
															angle={ this.state.expanded[activity.id] ? 180 : 0 }
														/>
													}
												/>
												<breakdown-resources
													class={ this.state.expanded[activity.id] && 'expanded' }
												>
													<ResourceList
														model={ activity }
														onChange={ this.handleResourceEstimateChange.bind(this, activity) }
													/>
												</breakdown-resources>
											</breakdown-activity>
										)
									}
								</breakdown-activities>
							</task-breakdown>
						)
					}
				</resource-tasks>

			</estimate-resource>
		);
	}
}
