import React from 'react';
import styles from './UserPin.css';
import IconButton from 'components/IconButton/IconButton';
import DropDown from 'components/DropDown/DropDown';
import UserFilterDrop from 'components/UserFilterDrop/UserFilterDrop';
import localise from 'state/localisation';
export default class UserPin extends React.Component {

	static propTypes = {
		onClear: React.PropTypes.func.isRequired,
		onChange: React.PropTypes.func.isRequired,
		member: React.PropTypes.object
	}

	constructor() {
		super();
		this.state = {
			member: {
				name: 'Select User'
			}
		};
	}

	componentWillMount() {
		this.handleMemberFromProps(this.props.member);
	}

	componentWillReceiveProps(newProps) {
		//this.handleMemberFromProps(newProps.member);
	}

	handleMemberFromProps(member) {
		if ( !!member ) {
			this.setState({
				member: member
			});
		} else {
			this.setState({
				member: {
					name: localise('select_user')
				}
			});
		}
	}

	handleUserChange(member) {
		this.setState({member: member});
		!!this.props.onChange && this.props.onChange(member);
	}

	handleOnClear() {
		typeof this.props.onClear === 'function' && this.props.onClear();
	}

	render() {
		return (
			<user-pin class={ styles.UserPin }>
				<pin-detail>
					<detail-name>{ this.state.member.name }</detail-name>
					<detail-actions>
						<UserFilterDrop
							onChange={ this.handleUserChange.bind(this) }
						>
							<IconButton>find_replace</IconButton>
						</UserFilterDrop>
						<IconButton onClick={ this.handleOnClear.bind(this) }>clear</IconButton>
					</detail-actions>
				</pin-detail>
			</user-pin>
		);
	}
}
