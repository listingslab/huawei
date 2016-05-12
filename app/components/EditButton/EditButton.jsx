import React from 'react';
import { PropTypes } from 'react-router';
import styles from './EditButton.css';
import localise from 'state/localisation.js';
import appState from 'state/app';

export default class EditButton extends React.Component {
	static propTypes = {
		editUrl: React.PropTypes.string.isRequired,
	}

	constructor (){
		super ();
	}

	render() {
		if (appState.editLinks){
			return (
				<edit-button class={ styles.EditButton }>
					<a 	href={ this.props.editUrl }
						target="_blank"
					>
						<label-title>{ localise('cms_edit') }</label-title>
						<material-icon>edit</material-icon>
					</a>
				</edit-button>
			);
		}else{
			return (null);
		}
	}
}
