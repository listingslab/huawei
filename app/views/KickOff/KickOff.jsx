import React from 'react';
import _uniq from 'lodash/uniq';
import styles from './KickOff.css';
import { PropTypes } from 'react-router';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import DueDateAction from 'components/DueDateAction/DueDateAction';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import AgendaList from 'components/AgendaList/AgendaList';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import SelectMembers from 'components/SelectMembers/SelectMembers';
import IconButton from 'components/IconButton/IconButton';
import rolesState from 'state/memberRoles';
import localise from 'state/localisation';
import MeetingsStream from 'streams/Meetings';
import TopicsStream from 'streams/Topics';
import MembersStream from 'streams/Members';

export default class KickOff extends React.Component {
	static contextTypes = {
		history: PropTypes.history
	}

	constructor() {
		super();
		this.state = {
			meeting: {},
			members: [],
			topics: []
		};
		this.stream = new MeetingsStream;
		this.topicsStream = new TopicsStream;
		this.membersStream = new MembersStream;
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleSubscriptionUpdate.bind(this)
		);
		this.topicsStream.subscribe(
			this.handleTopicsUpdate.bind(this)
		);
		this.membersStream.subscribe(
			this.handleMembersUpdate.bind(this)
		);

		this.stream.read();
		this.membersStream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
		this.topicsStream.unsubscribe();
		this.membersStream.unsubscribe();
	}

	handleMembersUpdate(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleMemberSelection(roleArray) {
		this.stream.update({
			attendingGroups: roleArray
		});
	}

	handleSubscriptionUpdate(res) {
		let meeting = res.body;
		let roles = {};

		_uniq(Array.concat(rolesState.stakeholders, rolesState.team))
			.forEach(role => {
				roles[role] = !!meeting.attendingGroups.find(roleName => roleName === role);
			});

		this.setState({
			meeting: meeting,
			roles: roles,
			topics: meeting.topics
		});

		if ( meeting.topics.length === 0 ) {
			this.handleAddTopic();
		}
	}

	handleTopicsUpdate(res) {
		this.setState({
			topics: res.body.items
		});
	}

	updateValue(key, value) {
		let model = {};
		model[key] = value;
		this.updateMeeting(model);
	}

	updateMeeting(model) {
		this.stream.update(model);
	}

	updateTopicItem(model) {
		this.topicsStream.update(model.id, model);
	}

	handleAddTopic() {
		this.topicsStream.create();
	}

	handleTopicItemDelete(id) {
		this.topicsStream.delete(id);
	}

	render() {
		return (
			<kickoff-view class={ styles.KickOff }>
				<ProcessHeader/>
				<h3 className="noprint">
					{ localise('guide_work_area') }
				</h3>

				<kickoff-detail>
					<kickoff-item class="date">
						<ComponentHeader
							class="blue"
							index="1"
							title={ <GuideLabel guideSlug="kick_set_datetime"/> }
							actions={
								<DueDateAction
									style="light"
									date={ this.state.meeting.startTime }
									placeholder={ localise('kick_select') }
									onChange={ this.updateValue.bind(this, 'startTime') }
								/>
							}
						/>
						<item-text>
							<TextScaleArea
								onChange={ this.updateValue.bind(this, 'location') }
							>
								{ this.state.meeting.location }
							</TextScaleArea>
						</item-text>
					</kickoff-item>
					<kickoff-item>
						<ComponentHeader
							class="blue"
							index="2"
							title={ <GuideLabel guideSlug="kick_set_obj"/> }
						/>
						<item-text>
							<TextScaleArea
								onChange={ this.updateValue.bind(this, 'objectives') }
							>
								{ this.state.meeting.objectives }
							</TextScaleArea>
						</item-text>
					</kickoff-item>
					<kickoff-item>
						<ComponentHeader
							class="blue"
							index="3"
							title={ <GuideLabel guideSlug="kick_select_att"/> }
						/>
						<SelectMembers
							members={ this.state.members }
							roles={ this.state.roles }
							onChange={ this.handleMemberSelection.bind(this) }
						/>
					</kickoff-item>
					<kickoff-item>
						<AgendaList
							index="4"
							title={ <GuideLabel guideSlug="kick_dev_agenda"/> }
							actions={ <IconButton onClick={ this.handleAddTopic.bind(this) }>playlist_add</IconButton> }
							items={
								!!this.state.topics && this.state.topics
							}
							onChange={ this.updateTopicItem.bind(this) }
							onDelete={ this.handleTopicItemDelete.bind(this) }
						/>
					</kickoff-item>
				</kickoff-detail>
			</kickoff-view>
		);
	}
}
