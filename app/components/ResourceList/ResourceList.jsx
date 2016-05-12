import React from 'react';
import Numeral from 'numeral';
import styles from './ResourceList.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import IconButton from 'components/IconButton/IconButton';
import ResourceItem from 'components/ResourceItem/ResourceItem';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import Locale from 'state/localisation';

export default class ResourceList extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		model: React.PropTypes.object.isRequired
	}

	constructor() {
		super();
		this.state = {
			hr: [{}],
			or: [{}],
			total: 0,
			budget: 0,
			delta: 0
		};

		this.fields = {
			hr: [{
				title: 'est_description',
				key: 'description'
			},
			{
				title: 'est_man_days',
				key: 'units'
			},
			{
				title: 'est_day_rate',
				key: 'cost'
			}],
			or: [{
				title: 'est_description',
				key: 'description'
			},
			{
				title: 'est_units',
				key: 'units'
			},
			{
				title: 'est_unit_cost',
				key: 'cost'
			}]
		};

		this.fieldStrings = {};
	}

	componentWillMount() {
		this.setState(this.props.model.resources, ()=>{
			this.updateTotal(false);
			this.fieldStrings.budget = this.state.budget;
		});
	}

	onBudgetChange(event) {
		this.fieldStrings.budget = event.target.value.replace(/[a-z]|\s|\,/ig,'');
		this.setState({
			budget: parseFloat(this.fieldStrings.budget)
		}, () => {
			this.updateTotal();
		});
	}

	handleAddResource(array) {
		array.push({});
		this.updateTotal();
	}

	triggerOnChange() {
		!!this.props.onChange && this.props.onChange(this.state);
	}

	handleResourceChange(model, changes) {
		Object.assign(model, changes);
		this.updateTotal();
	}

	handleResourceDelete(array, index) {
		array.splice(index, 1);
		this.updateTotal();
	}

	updateTotal(notifyChange = true) {
		let total = 0;
		Array
			.concat(this.state.hr, this.state.or)
			.forEach(item => {
				let sub = parseFloat(item.units) * parseFloat(item.cost);
				total +=  Number.isNaN(sub) ? 0 : sub;
			});

		let delta = (parseFloat(this.state.budget) - total);
		this.setState({
			total: total,
			delta: Number.isNaN(delta) ? 0 : delta
		}, ()=>{
			if ( notifyChange ) {
				this.triggerOnChange();
			}
		});
	}

	render() {
		return (
			<resource-list class={ styles.ResourceList }>
				<list-section>
					<ComponentHeader
						title={ Locale('est_hr') }
						actions={
							<IconButton
								onClick={ this.handleAddResource.bind(this, this.state.hr) }
							>
								playlist_add
							</IconButton>
						}
					/>
					{
						this.state.hr.map(
							(item, index) =>
							<section-item key={ index }>
								<ResourceItem
									fields={ this.fields.hr }
									model={ item }
									onChange={ this.handleResourceChange.bind(this, item) }
									onDelete={ this.handleResourceDelete.bind(this, this.state.hr, index) }
								/>
							</section-item>
						)
					}
				</list-section>
				<list-section>
					<ComponentHeader
						title={ Locale('est_or') }
						actions={
							<IconButton
								onClick={ this.handleAddResource.bind(this, this.state.or) }
							>
								playlist_add
							</IconButton>
						}
					/>
					{
						this.state.or.map(
							(item, index) =>
							<section-item key={ index }>
								<ResourceItem
									fields={ this.fields.or }
									model={ item }
									onChange={ this.handleResourceChange.bind(this, item) }
									onDelete={ this.handleResourceDelete.bind(this, this.state.or, index) }
								/>
							</section-item>
						)
					}
				</list-section>
				<list-section>
					<ComponentHeader
						title={ Locale('est_summary') }
					/>
					<list-summary>
						<summary-item>
							<item-title>
								<GuideLabel guideSlug="est_budget"/>
							</item-title>
							<item-field>
								<input
									type="text"
									value={ this.fieldStrings.budget }
									onChange={ this.onBudgetChange.bind(this) }
								/>
							</item-field>
						</summary-item>
						<summary-item>
							<item-title>
								<GuideLabel guideSlug="est_actual"/>
							</item-title>
							<item-field>
								<input type="text" disabled value={ Numeral(this.state.total).format('(0,0.00)') }/>
							</item-field>
						</summary-item>
						<summary-item>
							<item-title>
								<GuideLabel guideSlug="est_und_over"/>
							</item-title>
							<item-field>
								<input
									type="text"
									value={ Numeral(this.state.delta).format('(0,0.00)') }
									disabled
								/>
							</item-field>
						</summary-item>
					</list-summary>
				</list-section>
			</resource-list>
		);
	}
}
