import React from 'react';
import styles from './ProcessChart.css';
export default class ProcessChart extends React.Component {
	static propTypes = {
		name: React.PropTypes.string.isRequired,
		path: React.PropTypes.string.isRequired
	}
	render() {
		return (
			<process-chart class={ styles.ProcessChart }>
				<img src={ `/charts/${this.props.path}/${this.props.name}.svg` }/>
			</process-chart>
		);
	}
}
