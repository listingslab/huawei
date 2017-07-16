import React from 'react';
import styles from './NumberStepper.css';
import IconButton from 'components/IconButton/IconButton';

export default class NumberStepper extends React.Component {
	static propTypes = {
		step: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		value: React.PropTypes.number,
		onChange: React.PropTypes.func.isRequired
	}

	static defaultProps = {
		step: 5,
		min: 0,
		max: 60,
		value: 15
	}

	constructor() {
		super();
		this.state = {
			value: 0
		};
	}

	componentWillMount() {
		this.setState({ value: this.props.value });
	}

	handleStepValue(inc) {
		let step = parseInt(this.props.step, 10);
		let value = inc ? this.state.value + step : this.state.value - step;
		if ( value > parseInt(this.props.max, 10) || value < parseInt(this.props.min, 10) ) {
			return;
		}
		this.setState({ value: value }, ()=>{ !!this.props.onChange && this.props.onChange(value); });
	}

	render() {
		return (
			<number-stepper class={ styles.NumberStepper }>
				<stepper-dec>
					<IconButton onClick={ this.handleStepValue.bind(this, false) }>remove_circle</IconButton>
				</stepper-dec>
				<stepper-value>{ this.state.value }</stepper-value>
				<stepper-inc>
					<IconButton onClick={ this.handleStepValue.bind(this, true) }>add_circle</IconButton>
				</stepper-inc>
			</number-stepper>
		);
	}
}
