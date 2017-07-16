import React from 'react';
import styles from './CheckButton.css';
import { PropTypes } from 'react-router';

import IconButton from 'components/IconButton/IconButton';

export default class CheckButton extends React.Component {

	static defaultProps = {
		onChange: ()=>{ console.log('onChange handler'); }
	}

	static propTypes = {
		disabled: React.PropTypes.bool,
		checked: React.PropTypes.bool,
		onChange: React.PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.state = {
			checked: false
		};
	}

	componentWillMount() {
		this.setState({
			checked: this.props.checked
		});
	}

	handleClick() {
		let update = !this.state.checked;
		this.setState({
			checked: update
		});
		this.props.onChange(update);
	}

	render() {
		return (
			<check-button
				class={ styles.CheckButton }
				disabled={ this.props.disabled }
				onClick={ this.handleClick.bind(this) }
				checked={ this.state.checked }
			>
				<button-icon>
					<material-icon>
						{
							this.state.checked ? 'check_box' : 'check_box_outline_blank'
						}
					</material-icon>
				</button-icon>
				<button-title>{ this.props.children }</button-title>
			</check-button>
		);
	}
}
