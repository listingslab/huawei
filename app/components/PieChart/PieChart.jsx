import React from 'react';
import styles from './PieChart.css';
import d3 from 'd3';
import pie from 'radial-progress-chart';
import localise from 'state/localisation';

export default class PieChart extends React.Component {
	static propTypes = {
		pieId: React.PropTypes.string.isRequired,
		pieTitle: React.PropTypes.string.isRequired,
		piePercent: React.PropTypes.number.isRequired,
		pieLegend: React.PropTypes.node.isRequired,
		pieCenter: React.PropTypes.string.isRequired
	}

	constructor() {
		super();
	}

	componentWillMount() {
		this.data = {
			title: this.props.pieTitle,
			id: this.props.pieId,
			legend: this.props.pieLegend,
			series: [{
				value: this.props.piePercent,
				color: {interpolate: ['#ff0c0c', '#16a085'],
						background: '#ffd61d'}
			}],
			center: {
				content: [ this.props.piePercent + '%', this.props.pieCenter],
				y: -4
			},
			stroke: {width: 8, gap: 10},
			shadow: {width: 0},
			diameter: 75,
			animation: { duration: 4000 },
			round: false
		};
	}

	componentDidMount() {
		this.createPie();
	}

	componentWillReceiveProps(props) {
		this.data.title = props.pieTitle;
		this.data.center.content = [this.props.piePercent + '%', props.pieCenter];
		this.data.legend = props.pieLegend;
		document.getElementById(this.data.id).innerHTML = '';
		this.createPie();
	}

	createPie() {
		this.pie = new pie('#' + this.data.id, this.data);
	}

	render() {
		return (
			<pie-chart class={ styles.PieChart }>
				<pie-chart-title>
					{ this.data.title.toUpperCase() }
				</pie-chart-title>
				<pie-chart-disc>
					<radial-progress id={ this.data.id }></radial-progress>
				</pie-chart-disc>
				<pie-chart-legend>{ this.data.legend }</pie-chart-legend>
			</pie-chart>
		);
	}
}
