import React from 'react';
import styles from './LinkButton.css';

export default class LinkButton extends React.Component {
	render() {
		return (
			<link-button class={ styles.LinkButton }>
				<material-icon>{ this.props.icon }</material-icon>
				<button-label>{ this.props.children }</button-label>
			</link-button>
		);
	}
}
