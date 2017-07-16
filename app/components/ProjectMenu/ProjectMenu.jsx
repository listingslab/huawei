import React from 'react';
import styles from './ProjectMenu.css';
import menuEnd from './menu-end.svg';
import { PropTypes } from 'react-router';
import menuModel from 'state/menu.json';
import appState from 'state/app';
import Locale from 'state/localisation';
export default class ProjectMenu extends React.Component {

	static defaultProps = {
		menu: Object.keys(menuModel).map((i)=>menuModel[i])
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
		let history = this.context.history;

		return (
			<project-menu class={ styles.ProjectMenu }>
				<menu-header onClick={ this.toRoute.bind(this, 'dashboard') }>{ appState.project && appState.project.title || 'Project...' }</menu-header>
				{
					this.props.menu.map( (menu) => {
						return (
							<menu-item
								key={ this.resolveKey(menu.title) }
								class={ history.isActive(menu.route) ? 'active' : null }
							>
								<item-header
									onClick={ this.toRoute.bind(this, menu.items[0].route) }
								>
									{ Locale(menu.title) }
								</item-header>
								<item-submenu>
									{
										history.isActive(this.prependRoute(menu.route)) ?
										menu.items.map((item) =>
											<submenu-item
												key={ this.resolveKey(item.title) }
												class={ history.isActive(this.prependRoute(item.route)) ? 'active' : null }
												onClick={ this.toRoute.bind(this, item.route) }
											>
												<item-header>
													{ Locale(item.title) }
													<header-end>
														<img src={ menuEnd }/>
													</header-end>
												</item-header>
											</submenu-item>
										) : null
									}
								</item-submenu>
							</menu-item>
						);
					} )
				}
			</project-menu>
		);
	}
}

ProjectMenu.contextTypes = {
	history: PropTypes.history
};
