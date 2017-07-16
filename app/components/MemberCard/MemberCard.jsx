import React from 'react';
import styles from './MemberCard.css';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import Select from 'components/SelectBox/SelectBox';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';
import localise from 'state/localisation';
export default class MemberCard extends React.Component {
	static propTypes = {
		card: React.PropTypes.object.isRequired,
		index: React.PropTypes.number,
		roles: React.PropTypes.array.isRequired,
		onDelete: React.PropTypes.func,
		onChange: React.PropTypes.func
	}

	constructor() {
		super();
		this.state = {};
	}

	componentWillMount() {
		this.setState(this.props.card);
	}

	handleDelete() {
		if (typeof this.props.onDelete === 'function') {
			this.props.onDelete();
		}
	}

	handleValueChange(key, value) {
		let newState = {};
		if (typeof value === 'string') {
			newState[key] = value;
		} else {
			newState[key] = value.target.value;
		}
		this.propagateState(newState);
	}

	propagateState(state) {
		this.setState(state, () => {
			let changes = Object.assign({}, this.state);
			delete changes.roles;
			!!this.props.onChange && this.props.onChange(changes);
		});
	}

	render() {
		return (
			<member-card class={ styles.MemberCard }>

					<ComponentHeader
						index={ this.props.index }
						title={
							<card-title>
								<h4>{ this.state.name }</h4>
							</card-title>
						}
						actions={
							<DeleteButton
								onConfirm={ this.handleDelete.bind(this) }
								messageSlug="confirm_message_team"
							/> }
					/>

				<card-detail>
					{
						['companyID', 'name', 'email', 'telephone', 'mobile', 'manager']
						.map(
							itemKey =>
							<detail-item key={ itemKey }>
								<item-title>{ localise(`member_card_${itemKey.toLowerCase()}`) }</item-title>
								<item-value>
									<input
										value={ this.state[itemKey] }
										onChange={ this.handleValueChange.bind(this, itemKey) }
									/>
								</item-value>
							</detail-item>
						)
					}
					<detail-item>
						<item-title><GuideLabel guideSlug="guide_role"/></item-title>
						<item-value>
							<Select
								onChange={ this.handleValueChange.bind(this, 'role') }
								value={ this.state.role }
								options={
									this.props.roles.map(
										role => ({
											value: role.value,
											label: localise('role_' + role.title)
										})
									)
								}
							/>
						</item-value>
					</detail-item>
					<detail-item class="full">
						<item-title>{ localise('member_card_department') }</item-title>
						<item-value>
							<TextScaleArea
								value={ this.state.department }
								onChange={ this.handleValueChange.bind(this, 'department') }
							/>
						</item-value>
					</detail-item>
					<detail-item class="full">
						<item-title>{ localise('member_card_skills') }</item-title>
						<item-value>
							<TextScaleArea
								value={ this.props.card.skills }
								onChange={ this.handleValueChange.bind(this, 'skills') }
							/>
						</item-value>
					</detail-item>
				</card-detail>
			</member-card>
		);
	}
}
