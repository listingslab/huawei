import React from 'react';
import styles from './RAMatrix.css';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import IconButton from 'components/IconButton/IconButton';
import SelectBox from 'components/SelectBox/SelectBox';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import MembersStream from 'streams/Members';
import localise from 'state/localisation';

export default class RAMatrix extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		model: React.PropTypes.object.isRequired
	}

	constructor() {
		super();
		this.state = {
			approves: null,
			responsible: null,
			informed: [],
			assists: [],
			members: []
		};

		this.stream = new MembersStream;
	}

	componentWillMount() {
		this.setState({
			approves: this.props.model.approves || null,
			responsible: this.props.model.responsible || null,
			informed: this.props.model.informed || [],
			assists: this.props.model.assists || []
		});

		this.stream.subscribe(
			this.handleMembersUpdate.bind(this)
		);
		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleAddPerson(type, value) {
		this.state[type].push(null);
		this.forceUpdate();
		this.handleStateChange();
	}

	handleRemovePerson(index, array) {
		array.splice(index, 1);
		this.forceUpdate();
		this.handleStateChange();
	}

	handleMemberChange(index, array, value) {
		array[index] = value;
		this.handleStateChange;
	}

	handleSingleMemberChange(key, value) {
		let update = {};
		update[key] = value || null;
		this.setState(update, () => {
			this.handleStateChange();
		});
	}

	handleMembersUpdate(res) {
		this.setState({
			members: res.body.items
		});
	}

	handleStateChange() {
		!!this.props.onChange &&
		this.props.onChange({
			approves: this.state.approves,
			responsible: this.state.responsible,
			informed: this.state.informed,
			assists: this.state.assists
		});
	}

	render() {
		return (
			<responsiblity-matrix class={ styles.RAM }>
				<matrix-group>
					<GuideLabel guideSlug="matrix_approves"/>
					<SelectBox
						placeholder={ localise('select_box') }
						value={ this.state.approves }
						onChange={ this.handleSingleMemberChange.bind(this, 'approves') }
						options={
							this.state.members
							.map(
								member =>
								({
									value: member.id,
									label: member.name
								})
							)
						}
					/>
					<GuideLabel guideSlug="matrix_responsible"/>
					<SelectBox
						placeholder={ localise('select_box') }
						value={ this.state.responsible }
						onChange={ this.handleSingleMemberChange.bind(this, 'responsible') }
						options={
							this.state.members
							.map(
								member =>
								({
									value: member.id,
									label: member.name
								})
							)
						}
					/>
				</matrix-group>
				<matrix-group>
					<GuideLabel guideSlug="matrix_informed"/>
					{
						this.state.informed.map(
							(member, index) =>
							<select-group key={ `inf-${index}${member}` }>
								<SelectBox
									placeholder={ localise('select_box') }
									value={ member }
									onChange={ this.handleMemberChange.bind(this, index, this.state.informed) }
									options={
										this.state.members
										.map(
											member =>
											({
												value: member.id,
												label: member.name
											})
										)
									}
								/>
								<DeleteButton onConfirm={ this.handleRemovePerson.bind(this, index, this.state.informed) }/>
							</select-group>
						)
					}
					<group-add>
						<IconButton onClick={ this.handleAddPerson.bind(this, 'informed')}>person_add</IconButton>
					</group-add>
				</matrix-group>
				<matrix-group className="large">
					<GuideLabel guideSlug="matrix_assists"/>
					{
						this.state.assists.map(
							(member, index) =>
							<select-group key={ `ass-${index}${member}` }>
								<SelectBox
									placeholder={ localise('select_box') }
									value={ member }
									onChange={ this.handleMemberChange.bind(this, index, this.state.assists) }
									options={
										this.state.members
										.map(
											member =>
											({
												value: member.id,
												label: member.name
											})
										)
									}
								/>
								<DeleteButton onConfirm={ this.handleRemovePerson.bind(this, index, this.state.assists) }/>
							</select-group>
						)
					}
					<group-add>
						<IconButton onClick={ this.handleAddPerson.bind(this, 'assists')}>person_add</IconButton>
					</group-add>
				</matrix-group>
			</responsiblity-matrix>
		);
	}
}
