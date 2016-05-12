import React from 'react';
import styles from './AgendaList.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import NumberStepper from 'components/NumberStepper/NumberStepper';
import DeleteButton from 'components/DeleteButton/DeleteButton';

export default class AgendaList extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		onDelete: React.PropTypes.func.isRequired,
		items: React.PropTypes.array,
		placeholder: React.PropTypes.string
	}

	static defaultProps = {
		items: []
	}

	constructor() {
		super();
		this.state = {
			totalDuration: 0
		};
		this.itemChanges = {};
	}

	componentWillMount() {

	}

	componentWillReceiveProps(props) {
		this.sumTotalDuration(props);
	}

	handleItemChange(id, type, value) {
		(!!this.itemChanges[id]) || (this.itemChanges[id] = { id: id });
		this.itemChanges[id][type] = value;
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(this.itemChanges[id]);
		}

		let model = this.props.items.find(item => item.id === id);
		if (!!model) {
			model[type] = value;
		}

		this.sumTotalDuration();
	}

	handleItemDelete(id) {
		!!this.props.onDelete && this.props.onDelete(id);
	}

	sumTotalDuration(props) {
		let sum = 0;
		props = props || this.props;

		!!props.items.length &&
		props.items.forEach(item => {
			if (typeof item.duration === 'number') {
				sum += item.duration
			}
		});

		let time = `${pad(Math.floor(sum / 60))}:${pad(sum % 60)}`;

		this.setState({ totalDuration: time });

		function pad(int = 0) {
			if (int < 10) {
				return '0' + int;
			}
			return int;
		}
	}

	render() {
		return (
			<agenda-list class={ styles.AgendaList }>
				<ComponentHeader class="blue" title={ this.props.title } index={ this.props.index } actions={ this.props.actions } />
					<list-item>
						{
							!!this.props.items &&
							this.props.items
							.sort((a, b)=> a.id - b.id)
							.map( (item, index)=> {
								return [ <ComponentHeader
									key={ item.id }
									index={ index + 1 }
									title={
										<TextScaleArea
											value={ item.description }
											onChange={ this.handleItemChange.bind(this, item.id, 'description') }
											placeholder={ this.props.placeholder }
										/>
									}
									actions={ [
										<NumberStepper
											key="step"
											value={ item.duration }
											onChange={ this.handleItemChange.bind(this, item.id, 'duration') }
										/>,
										<DeleteButton
											messageSlug="confirm_message_agenda"
											key="delete"
											onConfirm={ this.handleItemDelete.bind(this, item.id) }
										/>
									] }
								/>


								];
							})
						}
					</list-item>
					<list-total>
						<total-description>{ 'Meeting duration' }</total-description>
						<total-duration>{ this.state.totalDuration }</total-duration>
					</list-total>
			</agenda-list>
		);
	}
}
