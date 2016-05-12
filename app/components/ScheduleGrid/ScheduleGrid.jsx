import React from 'react';
import moment from 'moment';
import styles from './ScheduleGrid.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import Locale from 'state/Localisation';
export default class ScheduleGrid extends React.Component {
	static propTypes = {
		model: React.PropTypes.array.isRequired
	}
	constructor() {
		super();
		this.state = {
			days: [],
			weeks: []
		};
	}

	componentWillMount() {
		this.updateGridDays();
	}

	iterator(count) {
		let array = [];
		for (let i = 0; i < count; i++) {
			array.push(i);
		}
		return array;
	}

	updateGridDays() {
		let minDate = moment('2016-03-11');
		let maxDate = moment('2016-04-18');
		minDate.isoWeekday(1);
		maxDate.isoWeekday(7);
		let weeks = maxDate.diff(minDate, 'weeks');
		this.setState({
			weeks: this.iterator(weeks).map(
				week =>
				minDate.clone().add(week, 'weeks')
			)
		});
	}

	render() {
		return (
			<schedule-grid class={ styles.ScheduleGrid }>
				{
					this.state.weeks.map(
						(week, index) =>
						<grid-block>
							<ComponentHeader
								title={ `${Locale('schd_week')} ${index + 1}` }
								actions={ <block-month>{ week.format('MMMM') }</block-month> }
								class="blue gradient"
							/>
							<block-columns>
								{
									this.iterator(7).map(
										index =>
										<block-column>
											<column-title><span>{ week.clone().add(index, 'days').format('ddd DD') }</span></column-title>
												{
													this.props.model.map(
														deliverable =>
														[
															<column-cell key={ deliverable.id } class="deliverable"/>,
															deliverable.tasks.map(
																task =>
																<column-cell task={ task.id } key={ task.id }/>
															)
														]
													)
												}
										</block-column>
									)
								}
							</block-columns>
						</grid-block>
					)
				}
			</schedule-grid>
		);
	}
}
