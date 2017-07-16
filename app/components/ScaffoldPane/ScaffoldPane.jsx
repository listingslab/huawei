import React from 'react';
import localise from 'state/localisation.js';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import styles from './ScaffoldPane.css';
import Glossary from 'components/Glossary/Glossary';
import Guide from 'components/Guide/Guide';
import ScaffoldIntro from 'components/ScaffoldIntro/ScaffoldIntro';
import ScaffoldMonitor from 'components/ScaffoldMonitor/ScaffoldMonitor';

export default class ScaffoldPane extends React.Component {

	static propTypes = {
		location: React.PropTypes.object.isRequired
	}

	constructor() {
		super();
		this.state = {
			mode: 'introduction',
			title: 'introduction'
		};
	}

	componentWillMount() {
		this.initScaffold(this.props.mode);
	}

	componentWillReceiveProps(props) {
		this.initScaffold(props.mode);
	}

	initScaffold(mode) {
		let hashParts = window.location.hash.slice(1).split('=');
		if (!!hashParts[0]) {
			let workArea = false;
			if (hashParts[0] === 'guide'){
				if (hashParts[1] === 'guide_work_area' || hashParts[1] === 'work_area_title'){
					this.switchTo('introduction', 'menu_introduction');
					workArea = true;
				}
			}
			if (hashParts[0] === 'monitor'){
				this.switchTo('monitor', 'menu_monitor');
				workArea = true;
			}
			if (!workArea) {
				this.switchTo(...hashParts);
			}
		} else {
			switch (mode) {
			case 'glossary':
				this.switchTo('glossary', 'glossary');
				break;
			case 'introduction':
				this.switchTo('introduction', 'menu_introduction');
				break;
			default: break;
			}
		}
	}

	switchTo(mode, title) {
		if (!mode) { return; }
		this.setState({
			mode: mode,
			title: mode === 'glossary' ? localise('glossary_title') : localise(title)
		});
	}

	render() {
		return (
			<scaffold-pane class={ styles.ScaffoldPane }>
				<ComponentHeader title={ this.state.title.toUpperCase() } />
				<pane-content>
					{
						this.state.mode === 'glossary' ? (
							<Glossary location={ this.props.location } ref="Glossary"/>
						) : null
					}
					{
						this.state.mode === 'guide' ? (
							<Guide
								location={ this.props.location }
								guideSlug={ this.state.title }
								ref="Guide"/>
						) : null
					}
					{
						this.state.mode === 'introduction' ? (
							<ScaffoldIntro
								location={ this.props.location }
								introSlug={ this.props.content.intro_slug }
								ref="ScaffoldIntro"/>
						) : null
					}
					{
						this.state.mode === 'monitor' ? (
							<ScaffoldMonitor
								ting={ {foo:'bar'} }
								ref="ScaffoldMonitor"/>
						) : null
					}
				</pane-content>
			</scaffold-pane>
		);
	}
}