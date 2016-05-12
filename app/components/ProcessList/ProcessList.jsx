import React from 'react';
import styles from './ProcessList.css';
import moment from 'moment';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import IconButton from 'components/IconButton/IconButton';
import monitorStates from 'state/monitorStates';
import localise from 'state/localisation';
import appState from 'state/app';
import browserHistory from 'state/browserHistory';
import ProjectStream from 'streams/Projects';

export default class ProcessList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			mode: this.props.mode,
			history: {}
		};
		this.stream = new ProjectStream;
	}

	componentWillMount() {
		this.stream.subscribe(
				this.handleStreamUpdates.bind(this)
			);

		this.stream.get();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleRoute(route) {
		let fullRoute = `/projects/${appState.projectId}${route}`;
		browserHistory.push(fullRoute + '#monitor=show');
	}

	handleStreamUpdates(res) {
		this.setState({
			history: null || res.body.history
		});
	}

	isLate(route) {
		let date = moment(this.state.history[route] && this.state.history[route]);
		if (!date.isValid()) { return false; }
		let diff = Math.abs(date.diff(Date.now(), 'days'));
		return diff > 10;
	}

	render() {
		return (
			<process-list class={ `${styles.ProcessList} ${this.state.mode}` }>
				{
					monitorStates.map(
						(item, index) =>
						<list-item key={ index } class={ this.isLate(item.route) ? 'late' : null }>
							<ComponentHeader
								title={
									<process-title>
										<GuideLabel guideSlug={ item.titleId }/>
										<IconButton
											onClick={ this.handleRoute.bind(this, item.route) }
										>
											launch
										</IconButton>
									</process-title>
								}
								actions={
									<process-history>
										<history-title>{ localise('mon_last_monitored') }</history-title>
										<history-value>
											{
												this.state.history &&
												this.state.history[item.route] ?
													moment(this.state.history[item.route]).fromNow() :
													'----'
											}
										</history-value>
									</process-history>
								}
							/>
						</list-item>
					)
				}
			</process-list>
		);
	}
}
