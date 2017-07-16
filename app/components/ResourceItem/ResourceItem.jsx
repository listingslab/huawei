import React from 'react';
import numeral from 'numeral';
import styles from './ResourceItem.css';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import localise from 'state/localisation';
export default class ResourceItem extends React.Component {
	static propTypes = {
		fields: React.PropTypes.array.isRequired,
		model: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired,
		onDelete: React.PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.state = {};
	}

	componentWillMount() {
		let state = {};
		this.props.fields.forEach(field => {
			state[field.key] = this.props.model[field.key];
		});

		this.setState(state);
	}

	handleInputUpdate(key, event) {
		let state = {};

		state[key] = key !== 'description' ?
			event.target.value.replace(/[a-z]|\,/ig, '') :
			event.target.value;

		this.setState(state, ()=>{
			!!this.props.onChange && this.props.onChange(this.state);
		});
	}

	handleDeleteItem() {
		!!this.props.onDelete && this.props.onDelete();
	}

	getTotal() {
		let total = parseFloat(this.state.units) * parseFloat(this.state.cost);
		if ( Number.isFinite(total) ) {
			return numeral(total).format('(0,0.00)');
		}
		return 0;
	}

	render() {
		return (
			<resource-item class={ styles.ResourceItem }>
				{
					this.props.fields.map(
						(field, index) =>
							<item-field key={ index }>
								<field-title>
									<GuideLabel guideSlug={ field.title }/>
								</field-title>
								<input
									onChange={ this.handleInputUpdate.bind(this, field.key) }
									type="text"
									value={ this.props.model[field.key] }
								/>
							</item-field>
					)
				}
				<item-field>
					<field-title>{ localise('est_sub_total') }</field-title>
					<input value={ this.getTotal() || '0.00' } disabled/>
				</item-field>
				<item-delete>
					<DeleteButton messageSlug="confirm_message_resource" onConfirm={ this.handleDeleteItem.bind(this) }/>
				</item-delete>
			</resource-item>
		);
	}
}
