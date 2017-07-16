import React from 'react';
import styles from './ScaffoldMonitor.css';
import ProcessList from 'components/ProcessList/ProcessList';

export default class ScaffoldMonitor extends React.Component {
	render() {
		return (
			<monitor-scaffold class={ styles.ScaffoldMonitor }>
				<ProcessList mode="scaffold" />
			</monitor-scaffold>
		);
	}
}
