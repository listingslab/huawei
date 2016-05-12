import React from 'react';
import { PropTypes } from 'react-router';
import styles from './GlossaryHotspot.css';

export default class GlossaryHotspot extends React.Component {

	static propTypes = {
		location: React.PropTypes.object.isRequired
	}

	static contextTypes = {
		history: PropTypes.history
	}

	handleClick() {
		this.context.history.replaceState(
			null, 
			window.location.pathname, 
			this.props.location
		);
	}

	render() {
		return (
			<glossary-hotspot 
				onClick={ this.handleClick.bind(this) } 
				class={ styles.GlossaryHotspot }>
					{ this.props.children }
			</glossary-hotspot>
		);
	}
}