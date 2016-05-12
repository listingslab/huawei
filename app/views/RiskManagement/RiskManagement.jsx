import React from 'react';
import styles from './RiskManagement.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import RiskDescription from 'components/RiskDescription/RiskDescription';
import IconButton from 'components/IconButton/IconButton';
import RisksStream from 'streams/Risks';
import localise from 'state/localisation';

export default class RiskManagement extends React.Component {

	constructor() {
		super();
		this.stream = new RisksStream;
		this.state = {
			riskItems: [],
			members: []
		};
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleSubscriptionUpdate.bind(this)
		);
		this.stream.read();
		this.stream.getMembers();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleSubscriptionUpdate(res) {
		let collectionHandler = {
			risks: () => {
				this.setState({
					riskItems: res.body.items.reverse()
				});
			},
			members: () => {
				this.setState({
					members: res.body.items
				});
			}
		};
		collectionHandler[res.collection]();
	}

	handleAddNewRisk() {
		this.stream.create();
	}

	handleRiskUpdate(id, changes) {
		this.stream.update(id, changes);
	}

	handleDeleteRisk(id) {
		this.stream.delete(id);
	}


	render() {
		return (
			<risk-management class={ styles.RiskManagement }>
				<ProcessHeader/>
				<header>
					<h3 className="noprint">
						{ localise('guide_work_area') }
					</h3>
				</header>
				<management-items>
					{
						this.state.riskItems
						.sort((a, b)=> a.id - b.id)
						.map(
							(item, index) =>
							<RiskDescription
								index={ index + 1 }
								key={ item.id }
								model={ item }
								expanded={ index + 1 === this.state.riskItems.length }
								members={ this.state.members }
								onChange={ this.handleRiskUpdate.bind(this, item.id) }
								onDelete={ this.handleDeleteRisk.bind(this, item.id) }
							/>
						)
					}
				</management-items>
				<footer>
					<add-item>
						<IconButton onClick={ this.handleAddNewRisk.bind(this) }>playlist_add</IconButton>
					</add-item>
				</footer>
			</risk-management>
		);
	}
}