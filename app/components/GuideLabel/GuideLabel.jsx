import React from 'react';
import { PropTypes } from 'react-router';
import styles from './GuideLabel.css';
import localise from 'state/localisation.js';

export default class GuideLabel extends React.Component {
	static propTypes = {
		guideSlug: React.PropTypes.string.isRequired
	}

	constructor() {
		super();
		
	}

	componentWillMount() {
		this.state = {
			label:localise(this.props.guideSlug)
		}
		if (this.state.label.includes('*')){
			console.log('NO LOCALE for ' + this.props.guideSlug);
		}
	}

	componentWillReceiveProps(props) {
		this.state = {
			label:localise(props.guideSlug)
		}
	}

	render() {
		return (
			<guide-label class={ styles.GuideLabel }>
				<a href={ `#guide=${this.props.guideSlug}` }>
					<label-title>{ this.state.label } </label-title>
					<material-icon>chat</material-icon>
				</a>
			</guide-label>
		);
	}
}
