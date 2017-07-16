import React from 'react';
import { PropTypes } from 'react-router';
import styles from './CreateButton.css';
import localise from 'state/localisation.js';

export default class CreateButton extends React.Component {
	static propTypes = {
		createUrl: React.PropTypes.string.isRequired,
	}

	render() {
		return (
			<edit-button class={ styles.CreateButton }>
				<a 	href={ this.props.createUrl }
					target="_blank"
				>
					<label-title>{ localise('cms_create') }</label-title>
					<material-icon>add</material-icon>
				</a>
			</edit-button>
		);
	}
}
