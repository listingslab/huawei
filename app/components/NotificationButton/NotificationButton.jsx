import React from 'react';
import styles from './NotificationButton.css';
import monitorStates from 'state/monitorStates';
import moment from 'moment';
import appState from 'state/app';

export default class NotificationButton extends React.Component {

	static propTypes = {
		onClick: React.PropTypes.func
	}

	isLate(route) {
		if ( appState.project && appState.project.history ) {
			let date = moment(appState.project.history[route]);
			if (!date.isValid()) { return false; }
			let diff = Math.abs(date.diff(Date.now(), 'days'));
			return diff > 10;
		}
		return false;
	}

	getLateCount() {
		return monitorStates.filter(
			state =>
			this.isLate(state.route)
		).length;
	}

	render() {
		return (
			<notification-button
				class={ styles.NotificationButton }
				onClick={ this.props.onClick }
			>
				<button-badge
					class={ this.getLateCount() > 0 ? 'show-count' : null }
				>
					{ this.getLateCount() }
				</button-badge>
				<material-icon>notifications</material-icon>
			</notification-button>
		);
	}
}