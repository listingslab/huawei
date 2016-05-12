import React from 'react';
import styles from './CommunicationPlan.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import CommunicationEditor from 'components/CommunicationEditor/CommunicationEditor';
import MemberStream from 'streams/Members';
import localise from 'state/localisation';

export default class CommunicationPlan extends React.Component {
	constructor() {
		super();
		this.state = {
			members: []
		};
		this.stream = new MemberStream;
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleStreamUpdate.bind(this)
		);
		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleStreamUpdate(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleMemberUpdate(member, updates) {
		this.stream.update(member.id, { communicationPlan: updates });
	}

	render() {
		return (
			<communication-plan class={ styles.CommunicationPlan }>
				<ProcessHeader/>
				<h3 className="noprint">
					{ localise('guide_work_area') }
				</h3>
				<plan-editors>
					{
						this.state
							.members
							.map(
								member =>
								<CommunicationEditor
									key={ member.id }
									model={ member }
									members={ this.state.members }
									onChange={ this.handleMemberUpdate.bind(this, member) }
								/>
							)
					}
				</plan-editors>
			</communication-plan>
		);
	}
}
