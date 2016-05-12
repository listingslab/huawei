import React from 'react';
import styles from './NavigationCard.css';

export default class NavigationCard extends React.Component {
	render() {
		return (
			<navigation-card class={ styles.NavigationCard }>
				<card-icon>
					<material-icon>{ this.props.icon }</material-icon>
				</card-icon>
				<card-title>
					<main>{ this.props.title }</main>
					<sub>{ this.props.hover }</sub>
				</card-title>
			</navigation-card>
		);
	}
}
