import React from 'react';
import styles from './ExpandButton.css';

export default class ExpandButton extends React.Component {

	static propTypes = {
		onClick: React.PropTypes.func.isRequired,
		angle: React.PropTypes.number.isRequired
	}

	static defaultProps = {
		onClick: null,
		angle: 0
	}

	render() {

		let transform = {
			transform: `rotate(${this.props.angle}deg)`
		};

		return (
			<expand-button
				onClick={ this.props.onClick }
				class={ styles.ExpandButton }
			>
				<material-icon
					style={ transform }
				>
					arrow_drop_up
				</material-icon>
			</expand-button>
		);
	}
}
