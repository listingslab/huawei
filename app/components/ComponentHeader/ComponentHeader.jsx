import React from 'react';
import styles from './ComponentHeader.css';
import classnames from 'classnames';
export default class ComponentHeader extends React.Component {
	render() {
		let className = {};
		className[styles.ComponentHeader] = true;
		className[this.props.class] = !!this.props.class;
		return (
			<component-header class={ classnames(className) }>
				{
					this.props.index ? <header-index>{ this.props.index }</header-index> : null
				}
				<header-content>
					<header-detail>
						<header-title>{ this.props.title }</header-title>
						<header-actions>
							{
								this.props.actions
							}
						</header-actions>
					</header-detail>
					<header-extra>{ this.props.children }</header-extra>
				</header-content>
			</component-header>
		);
	}
}
