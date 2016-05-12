import React from 'react';
import styles from './MemberSelect.css';
import MembersStream from 'streams/Members';
import MemberCard from 'components/MemberCard/MemberCard';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import IconButton from 'components/IconButton/IconButton';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import roles from  'state/memberRoles';
import localise from 'state/localisation';
export default class MemberSelect extends React.Component {

	constructor() {
		super();
		this.state = {
			results: [],
			members: [],
			query: null,
			isFocused: false

		};
		this.stream = new MembersStream;
		this.subscriptions = null;
	}

	componentWillMount() {
		this.stream
			.subscribe(
				this.handleMemberUpdate.bind(this),
				this.handleMemberUpdateError.bind(this)
			);

		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleQueryError(err) {
		console.log(err);
	}

	handleMemberUpdate(res) {
		this.setState({ members: res.body.items });
	}

	handleMemberUpdateError(res) {
		console.error(res);
	}

	handleCreateMember() {
		let defaultRole = this.props.route.state.role === 'stakeholders' ? roles.stakeholders[0] : roles.team[0];
		this.stream.create({ role: defaultRole });
	}

	hanldeMemberCardChange(id, model) {
		this.stream.update(id, model);
	}

	handleDeleteMember(id) {
		this.stream.delete(id);
	}

	filterByMemberRoles(member) {
		return this.getRoles().findIndex(roleItem => roleItem === member.role) > -1;
	}

	filterUniqueMembers(member) {
		return this.state.members.findIndex(currentMember => currentMember.id === member.id) < 0;
	}

	getRoles() {
		return this.props.route.state.role === 'stakeholders' ? roles.stakeholders : roles.team;
	}

	render() {
		return (
			<member-select class={ styles.MemberSelect }>
				<ProcessHeader/>

				<h3 className="noprint">
					{ localise('guide_work_area') }
				</h3>

				<selected-members>
					<ComponentHeader
						class="clear noprint"
						title={
							this.props.route.state.role === 'stakeholders' ?
							localise('member_select_stakeholders_title') : localise('member_select_team_title')
						}
						actions={
							<IconButton onClick={ this.handleCreateMember.bind(this) }>person_add</IconButton>
						}
					/>
					{
						this.state.members
						.filter(this.filterByMemberRoles.bind(this))
						.map(
							(member, index) =>
							<MemberCard
								key={ `${ member.id }_${ index }` }
								index={ index + 1 }
								card={ member }
								onDelete={ this.handleDeleteMember.bind(this, member.id) }
								roles={ this.getRoles().map( role => {
									return {
										title: role,
										value: role
									};
								}) }
								onChange={ this.hanldeMemberCardChange.bind(this, member.id) }
							/>
						)
					}
					<members-blank/>
				</selected-members>
			</member-select>
		);
	}
}
