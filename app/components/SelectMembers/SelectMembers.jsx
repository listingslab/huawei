import React from 'react';
import styles from './SelectMembers.css';
import CheckButton from 'components/CheckButton/CheckButton';
import localise from 'state/localisation';
export default class SelectMembers extends React.Component {
	static propTypes = {
		index: React.PropTypes.number,
		roles: React.PropTypes.object.isRequired,
		members: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func.isRequired
	}

	static defaultProps = {
		roles: {}
	}

	constructor() {
		super();
		this.state = {
			roleFilter: {}
		};
	}

	handleCheckBoxClick(role) {
		this.props.roles[role] = !this.props.roles[role];
		if ( typeof this.props.onChange === 'function' ) {
			let selectedRoles = [];

			Object.keys(this.props.roles).forEach( key => {
				if ( this.props.roles[key] ) {
					selectedRoles.push(key);
				}
			});

			this.props.onChange(selectedRoles);
			this.forceUpdate();
		}
	}

	getRoleAmmount( role ) {
		let count = this.props.members.filter( member => member.role === role).length;
		return count > 0 ? count : null;
	}

	render() {
		return (
			<select-members class={ styles.SelectMembers }>
				<member-groups>
					{
						Object.keys(this.props.roles).map( role =>
							<CheckButton
								key={ role }
								onChange={ this.handleCheckBoxClick.bind(this, role) }
								disabled={ this.getRoleAmmount(role) === null }
								checked={ this.props.roles[role] }
							>
								{ localise(`role_${role}`) }
								<i>{ this.getRoleAmmount(role) }</i>
							</CheckButton>
						)
					}
				</member-groups>
				<members-selected>
					{
						Object.keys(this.props.roles)
							.map(
								(role, index) =>
								this.props.roles[role] ?
								this.props.members.map(
									member =>
									member.role === role ?
									<selected-member order={ index } key={ member.id }>{ member.name }</selected-member> :
									null
								) :
								null
							)
					}
				</members-selected>
			</select-members>
		);
	}
}
