import React from 'react';
import DropDown from 'components/DropDown/DropDown';
import UserFilter from 'components/UserFilter/UserFilter';

export default class UserFilterDrop extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired
	}

	handleUserChange(userModel) {
		typeof this.props.onChange === 'function' && this.props.onChange(userModel);
	}

	handleUserFilterClose() {
		this.refs.drop.close();
	}

	render() {
		return (
			<user-filter-dropdown>
				<DropDown
					ref="drop"
					content={
						<UserFilter
							onChange={ this.handleUserChange.bind(this) }
							onClose={ this.handleUserFilterClose.bind(this) }
						/>
					}
				>
					{ this.props.children }
				</DropDown>
			</user-filter-dropdown>

		);
	}
}
