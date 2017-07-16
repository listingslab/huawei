import React from 'react';
import Select from 'react-select';
import reactSelectStyles from 'react-select/dist/react-select.css';
import styles from './SelectBox.css';
import PrintArea from 'components/PrintArea/PrintArea';

export default class SelectBox extends React.Component {
	render() {
		return (
			<select-box class={ styles.SelectBox }>
				<Select {...this.props}/>
			</select-box>
		);
	}
}
