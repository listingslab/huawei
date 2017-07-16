import React from 'react';
import styles from './WBS.css';
import moment from 'moment';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import Deliverable from 'components/Deliverable/Deliverable';
import DeliverableStream from 'streams/Deliverables';
import IconButton from 'components/IconButton/IconButton';
import localise from 'state/localisation';

export default class WBS extends React.Component {
	constructor() {
		super();

		this.state = {
			deliverables: []
		};

		this.stream = new DeliverableStream;
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleDeliverablesUpdated.bind(this),
			this.handleDeliverableUpdateFail.bind(this)
		);

		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleDeliverableUpdateFail(res) {
		console.log('update failed', res);
	}

	handleDeliverablesUpdated(res) {
		this.setState({ deliverables: res.body.items });
	}

	handleAddDeliverable() {
		this.stream.createDeliverable();
	}

	render() {
		return (
			<wbs-area class={ styles.WBS }>
				<ProcessHeader/>
				<header>
					<h3 className="noprint">
						{ localise('guide_work_area') }
					</h3>
				</header>

				{
					this.state.deliverables
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
					.map(
						(deliverable, index) =>
						<Deliverable
							key={deliverable.id}
							model={ deliverable }
							index={ index }
							autoExpand={ index + 1 === this.state.deliverables.length }
						/>
					)
				}
				<wbs-add>
					<IconButton onClick={ this.handleAddDeliverable.bind(this) }>playlist_add</IconButton>
				</wbs-add>
			</wbs-area>
		);
	}
}
