import React from 'react';
import styles from './ManageChanges.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import IconButton from 'components/IconButton/IconButton';
import ChangeRequest from 'components/ChangeRequest/ChangeRequest';
import ChangeStream from 'streams/Changes';
import MemberStream from 'streams/Members';
import localise from 'state/localisation';

export default class ManageChanges extends React.Component {
	constructor() {
		super();
		this.state = {
			members: [],
			changeRequests: []

		};
		this.stream = new ChangeStream;
		this.memberStream = new MemberStream;
	}

	componentWillMount() {
		this.stream
			.subscribe(
				this.handleStreamUpdates.bind(this)
			);
		this.stream.read();
		this.memberStream
			.subscribe(
				this.handleMemberUpdates.bind(this)
			);
		this.memberStream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
		this.memberStream.unsubscribe();
	}

	handleStreamUpdates(res) {
		this.setState({
			changeRequests: res.body.items
		});
	}

	handleCreateRequest() {
		this.stream.create();
	}

	handleMemberUpdates(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleRequestChange(id, changes) {
		this.stream.update(id, changes);
	}

	render() {
		return (
			<manage-changes class={ styles.ManageChanges }>
				<ProcessHeader/>
				<header>
					<h3 className="noprint">
						{ localise('guide_work_area') }
					</h3>
				</header>
				{
					this.state.changeRequests
					.sort( (a, b) => a.id - b.id )
					.map(
						(req, index) =>
						<ChangeRequest
							key={ req.id }
							index={ index + 1 }
							onChange={ this.handleRequestChange.bind(this, req.id) }
							members={ this.state.members }
							model={ req }
						/>
					)
				}
				<footer>
					<IconButton
						onClick={ this.handleCreateRequest.bind(this) }
					>
						playlist_add
					</IconButton>
				</footer>
			</manage-changes>
		);
	}
}
