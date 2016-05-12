import React from 'react';
import styles from './CharterInput.css';

export default class CharterInput extends React.Component {

	render() {
		return (
			<charter-input class={ styles.CharterInput }>
				<input-area contentEditable></input-area>
			</charter-input>
		);
	}

}
