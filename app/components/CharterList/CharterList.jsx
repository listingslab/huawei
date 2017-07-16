import React from 'react';
import styles from './CharterList.css';
import moment from 'moment';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import DueDateAction from 'components/DueDateAction/DueDateAction';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import ExpandButton from 'components/ExpandButton/ExpandButton';
import DeleteButton from 'components/DeleteButton/DeleteButton';
export default class CharterList extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		items: React.PropTypes.array,
		placeholder: React.PropTypes.string,
		onDelete: React.PropTypes.func,
		deleteMessageSlug: React.PropTypes.string
	}

	static defaultProps = {
		items: []
	}

	constructor() {
		super();
		this.state = {
			expandedItems: [],
			items: []
		};

		this.itemChanges = {};
	}

	componentWillMount() {
		this.setFirstExpanded(this.props);
	}

	componentWillReceiveProps(props) {
		this.setFirstExpanded(props);
	}

	setFirstExpanded(props) {
		if ( props.items.length === 1 && !this.state.expandedItems[0] ) {
			this.handleItemExpand(0);
		}
	}

	handleItemChange(id, type, value) {
		(!!this.itemChanges[id]) || (this.itemChanges[id] = { id: id });
		this.itemChanges[id][type] = value;
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(this.itemChanges[id], type === 'duedate');
		}
	}

	handleItemExpand(index) {
		let expandedItems = this.state.expandedItems.slice();
		expandedItems[index] = !expandedItems[index];
		this.setState({
			expandedItems: expandedItems
		});
	}

	handleDeleteItem(item) {
		!!this.props.onDelete && this.props.onDelete(item);
	}

	render() {
		return (
			<charter-list class={ styles.CharterList }>
				<ComponentHeader
					title={ this.props.heading }
					index={ this.props.index }
					actions={ this.props.actions }
					class="blue"
				/>
					<list-item>
						{
							this.props.items
							.sort((a, b)=>{
								let dueA = a.due;
								let dueB = b.due;
								if (!dueA) {
									return a.id - b.id;
								}
								if (!dueB) {
									return a.id - b.id;
								}
								return moment(dueB).isAfter(moment(dueA)) ? -1 : 1;
							})
							.map( (item, index)=> {
								return [ <ComponentHeader
									key={ 'charter-list-item-' + item.id }
									index={ index + 1 }
									title={
										<TextScaleArea
											value={ item.value }
											onChange={ this.handleItemChange.bind(this, item.id, 'value') }
											placeholder={ this.props.placeholder }
										/>
									}
									actions={
										[
											<DueDateAction
												onChange={ this.handleItemChange.bind(this, item.id, 'duedate') }
												date={ item.due }
												key="duedate"
											/>,

											<DeleteButton
												key="delete"
												onConfirm={ this.handleDeleteItem.bind(this, item) }
												messageSlug={ this.props.deleteMessageSlug }
											/>,

											<ExpandButton
												key="expB"
												onClick={ this.handleItemExpand.bind(this, index) }
												angle={ this.state.expandedItems[index] ? 0 : 180 }
											/>
										]
									}
								/>,

								<list-input class={ this.state.expandedItems[index] ? 'expanded' : '' }>
									{
										Object.keys(item.subview).map( key => [
											<h4>{ item.subview[key].title }</h4>,
											<TextScaleArea
												value={ item.subview[key].value }
												placeholder={ item.subview[key].placeholder }
												onChange={ this.handleItemChange.bind(this, item.id, key) }
											/>
										])
									}
								</list-input>

								];
							})
						}
					</list-item>
			</charter-list>
		);
	}
}
