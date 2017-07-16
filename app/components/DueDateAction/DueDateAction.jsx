import React from 'react';
import styles from './DueDateAction.css';
import dpStyles from 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
export default class DueDateAction extends React.Component {

	static propTypes = {
		date: React.PropTypes.string,
		onChange: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		onFocus: React.PropTypes.func,
		onBlur: React.PropTypes.func
	}

	resolveDate() {
		if (!!this.props.date) {
			return moment(this.props.date);
		}
		return null;
	}

	handleFocus() {
		let el = this.refs.date;
		let inputArr = el.getElementsByTagName('input');
		inputArr[0].focus();
		!!this.props.onFocus && this.props.onFocus();
	}

	handleDateChange(date) {
		typeof this.props.onChange === 'function' &&
		this.props.onChange(date.format());
		!!this.props.onBlur && this.props.onBlur();
		this.updateInputSize();
	}

	updateInputSize() {
		let input = this.refs.date.getElementsByTagName('input')[0];
		let contents = input.value || input.getAttribute('placeholder');
		input.setAttribute('size', contents.length || '');
	}

	componentDidUpdate() {
		this.updateInputSize();
	}

	componentDidMount() {
		this.updateInputSize();
	}

	render() {
		return (
			<due-date ref="date" onClick={ this.handleFocus.bind(this) } class={ styles.DueDate } data-style={ this.props.style }>
				<date-action>
					<material-icon>event</material-icon>
					<DatePicker
						readOnly
						onChange={ this.handleDateChange.bind(this) }
						placeholderText={ this.props.placeholder || 'Date' }
						popoverAttachment={ 'bottom center' }
						popoverTargetAttachment={ 'top left' }
						selected={ this.resolveDate() }
					/>
				</date-action>
			</due-date>
		);
	}
}
