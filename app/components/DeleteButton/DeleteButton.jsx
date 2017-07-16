import React from 'react';
import styles from './DeleteButton.css';
import DropDown from 'components/DropDown/DropDown';
import IconButton from 'components/IconButton/IconButton';
import locale from 'state/localisation';
export default class DeleteButton extends React.Component {
	static propTypes = {
		onConfirm: React.PropTypes.func.isRequired,
		messageSlug: React.PropTypes.string
	}

	handleAction(confirm) {
		if (confirm) {
			!!this.props.onConfirm && this.props.onConfirm();
		}

		this.refs.dropdown.close();
	}

	handlClick(event) {
		event.stopPropagation();
	}

	render() {
		return (
			<delete-button class={ styles.DeleteButton }>
				<DropDown
					ref="dropdown"
					position="bottom right"
					content={
						<delete-confirm class={ styles.Confirm }>
							<confirm-message>
								{ this.props.messageSlug && locale(this.props.messageSlug) || locale('confirm_message_resource') }
							</confirm-message>
							<confirm-warning>{ locale('confirm_warning') }</confirm-warning>
							<confirm-actions>
								<button onClick={ this.handleAction.bind(this, true) }>{ locale('confirm_ok') }</button>
								<button onClick={ this.handleAction.bind(this, false) }>{ locale('confirm_cancel') }</button>
							</confirm-actions>
						</delete-confirm>
					}
				>
					<IconButton onClick={ this.handlClick }>delete</IconButton>
				</DropDown>
			</delete-button>
		);
	}
}
