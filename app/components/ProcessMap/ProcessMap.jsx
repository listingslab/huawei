import React from 'react';
import styles from './ProcessMap.css';
import { PropTypes } from 'react-router';
import menuModel from 'state/menu.json';
import appState from 'state/app';
import localise from 'state/localisation';

export default class ProcessMap extends React.Component {

	static defaultProps = {
		// menu: React.PropTypes.object.isRequired,
		menu: Object.keys(menuModel).map((i)=>menuModel[i])
	}

	constructor() {
		super();
	}

	resolveKey(text) {
		return 'menu--' + text.toLowerCase().replace(/\W/g, '_');
	}

	toRoute(route) {
		this.context.history.pushState(null, this.prependRoute(route));
	}

	prependRoute(route) {
		return `/projects/${appState.projectId}/${route}`;
	}

	render() {
		// let history = this.context.history;
		let count = 0;
		return (
			<process-map class={ styles.ProcessMap }>
				<h2>
					{ localise('dash_process_map').toUpperCase() }
					<sub>{ localise('dash_process_instructions') }</sub>
				</h2>
				<process-menu>
					<refresh>
						<material-icon>sync</material-icon>
					</refresh>
				{

					this.props.menu.map( (menu) => {
						count ++;
						return (
							<process-col key={ menu.title }>
								<process-header>
									<process-number>{ count }</process-number>
									<process-title>{ localise(menu.title) }</process-title>
								</process-header>
								{ menu.items.map((item) =>{
									return (
										<sub-item
											onClick={ this.toRoute.bind(this, item.route) }
											key={ this.resolveKey(item.title) } >
										{ localise(item.title) }
										</sub-item>
									);
								}) }
							</process-col>
						);
					 })
				}
				</process-menu>
				<process-bottom />
			</process-map>
		);
	}
}

ProcessMap.contextTypes = {
	history: PropTypes.history
};
