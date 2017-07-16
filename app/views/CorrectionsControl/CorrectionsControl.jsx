'use strict';
import React  from 'react';
import styles from './CorrectionsControl.css';
import localise from 'state/localisation';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import ControlEditor from 'components/ControlEditor/ControlEditor';
import IconButton from 'components/IconButton/IconButton';
import ControlsStream from 'streams/Controls';
import MembersStream from 'streams/Members';

export default class CorrectionsControl extends React.Component {
	constructor() {
		super();
		this.state = {
			controls: []
		};
		this.stream = new ControlsStream;
		this.memberStream = new MembersStream;
	}

	componentWillMount() {
		this.stream
			.subscribe(
				this.handleStreamUpdate.bind(this)
			);

		this.memberStream
			.subscribe(
				this.handleMemberStreamUpdate.bind(this)
			);

		this.memberStream.read();
		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
		this.memberStream.unsubscribe();
	}

	handleAddControl() {
		let now = new Date();
		this.stream.create({
			created: now.toISOString()
		});
	}

	handleControlUpdate(id, update) {
		this.stream.update(id, update);
	}

	handleControlDelete(id) {
		this.stream.delete(id);
	}

	handleMemberStreamUpdate(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleStreamUpdate(res) {
		this.setState({
			controls: res.body.items
		});
	}


	render() {
		return (
			<corrections-control class={ styles.CorrectionsControl }>
				<ProcessHeader/>
				<header>
				<h3 className="noprint">
					{ localise('guide_work_area') }
				</h3>
				</header>
				<control-area>
					{
						this.state.controls
							.sort( (a, b) => a.id - b.id )
							.map(
								(control, index) =>
								<ControlEditor
									index={ index + 1 }
									key={ control.id }
									model={ control }
									members={ this.state.members }
									onChange={ this.handleControlUpdate.bind(this, control.id) }
									onDelete={ this.handleControlDelete.bind(this, control.id) }
								/>
							)
					}
				</control-area>
				<footer>
					<IconButton onClick={ this.handleAddControl.bind(this) }>playlist_add</IconButton>
				</footer>
			</corrections-control>
		);
	}
}
