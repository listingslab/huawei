import React from 'react';
import ReactDom from 'react-dom';
import styles from './UserFilter.css';
import MembersStream from 'streams/Members';

export default class UserFilter extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		onClose: React.PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.state = {
			results: [],
			filteredResults: [],
			query: '',
			selected: null
		};
		this.stream = new MembersStream;
		this.subscription = null;
		this.dropShow = this._dropShow.bind(this);
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleSubscriptionUpdate.bind(this),
			this.handleSubscriptionUpdateError.bind(this)
		);
		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	_dropShow() {
		this.clearQuery();
		window.requestAnimationFrame(()=>{ this.refs.input.focus(); });
	}

	clearQuery() {
		this.refs.input.value = '';
		this.setState({
			query: '',
			filteredResults: this.filterResults(''),
			selected: null
		});
	}

	handleSubscriptionUpdate(res) {
		this.setState({
			results: res.body.items,
			filteredResults: res.body.items
		});
	}

	handleSubscriptionUpdateError() {

	}

	handleInputChange(event) {
		this.setState({
			query: event.target.value,
			filteredResults: this.filterResults(event.target.value),
			selected: null
		});
	}

	handleSelectMember(member) {
		typeof this.props.onChange === 'function' && this.props.onChange(member);
		typeof this.props.onClose === 'function' && this.props.onClose();
	}

	handleKeyboardControl(event) {
		switch (event.key.toLowerCase()) {
		case 'escape':
			typeof this.props.onClose === 'function' && this.props.onClose();
			break;

		case 'arrowdown':
			event.preventDefault();
			let selectedIndexA = (typeof this.state.selected === 'number' && this.state.selected + 1) || 0;
			this.setState(
				{ selected: selectedIndexA < this.state.filteredResults.length ? selectedIndexA : this.state.filteredResults.length - 1 },
				this.updateScrollPosition
			);
			break;

		case 'arrowup':
			event.preventDefault();
			let selectedIndexB = (typeof this.state.selected === 'number' && this.state.selected - 1);
			this.setState(
				{ selected: selectedIndexB > -1 ? selectedIndexB : null },
				this.updateScrollPosition
			);
			break;

		case 'enter':
			this.handleSelectMember(this.state.filteredResults[this.state.selected]);
		}
	}

	updateScrollPosition() {
		if (this.refs.selected) {
			this.refs.results.scrollTop = this.refs.selected.offsetTop - this.refs.selected.offsetHeight - 10;
		}
	}

	filterResults(value) {
		return this.state.results
			.filter( member => member.name && member.name.match(new RegExp(value, 'i')) );
	}


	render() {
		return (
			<user-filter ref="filter" class={ styles.UserFilter } onKeyDown={ this.handleKeyboardControl.bind(this) }>
				<input type="text" ref="input" placeholder={ (this.state.filteredResults[this.state.selected] || {}).name } onChange={ this.handleInputChange.bind(this) }/>
				<filter-results ref="results">
					{
						this.state.filteredResults.map(
							(member, index) =>
							<result-item
								ref={ index === this.state.selected ? 'selected' : null }
								key={ 'user-filter-' + index }
								class={ index === this.state.selected ? 'selected' : null }
								onClick={ this.handleSelectMember.bind(this, member) }
							>
								<item-title> { member.name }</item-title>
							</result-item>
						)
					}
				</filter-results>
			</user-filter>
		);
	}
}
