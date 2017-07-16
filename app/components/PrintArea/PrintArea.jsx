import React from 'react';
import styles from './PrintArea.css';
export default class PrintArea extends React.Component {
	render() {
		return (
			<print-area class={ styles.PrintArea }>
				{ this.props.children }
			</print-area>
		);
	}
}
