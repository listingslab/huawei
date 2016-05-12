import React from 'react';
import styles from './TrafficLight.css';
import appState from 'state/app';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import localise from 'state/localisation';
import IconButton from 'components/IconButton/IconButton';
import moment from 'moment';

export default class TrafficLight extends React.Component {
	static propTypes = {
		health: React.PropTypes.string.isRequired,
		date: React.PropTypes.string.isRequired,
		time: React.PropTypes.string.isRequired
	}

	constructor() {
		super();
		this.state = {
			expanded: false
		};
		moment.locale(appState.locale);
	}

	componentWillMount() {
	}

	componentDidMount() {
	}

	componentWillReceiveProps(props) {
		moment.locale(appState.locale);
	}

	getSvgURL() {
		let svgUrl = appState.serverURL;
		switch (this.props.health){
			case 'red':
				svgUrl = svgUrl + '/dashboard/TrafficLight_red.svg';
				break;
			case 'yellow':
				svgUrl = svgUrl + '/dashboard/TrafficLight_yellow.svg';
				break;
			case 'green':
				svgUrl = svgUrl + '/dashboard/TrafficLight_green.svg';
				break;
		}
		return svgUrl;
	}

	// handleShowLegend() {
	// 	this.setState({
	// 		expanded: !this.state.expanded
	// 	});
	// }

	render() {
		let svg = this.getSvgURL();
		return (
			<traffic-light class={ styles.TrafficLight }>
			{
				// <ExpandButton
				// 	key="expand"
				// 	angle={ this.state.expanded ? 180 : 90 }
				// 	onClick={ this.handleShowLegend.bind(this) }
				// />
			}
				<traffic-light-title>
					{ localise('dash_trafficlight_title').toUpperCase() }
				</traffic-light-title>

				<traffic-light-graphic>
					<img src={ svg } />
				</traffic-light-graphic>

				<traffic-light-date>
					<div>{ this.props.date }</div>
					<div>{ this.props.time }</div>
				</traffic-light-date>
				<traffic-light-legend>
					<header>
						<label>{ localise('dash_failure_risk') }</label>
						<label>{ localise('dash_action') }</label>
					</header>
					<table>
						<tbody>
							<tr className="red">
								<td>61-100%</td>
								<td>{ localise('dash_action_urgent') }</td>
							</tr>
							<tr className="orange">
								<td>31-60%</td>
								<td>{ localise('dash_action_required') }</td>
							</tr>
							<tr className="green">
								<td>0-30%</td>
								<td>{ localise('dash_action_none') }</td>
							</tr>
						</tbody>
					</table>
				</traffic-light-legend>
			</traffic-light>
		);
		// <IconButton>insert_invitation </IconButton>
	}
}
