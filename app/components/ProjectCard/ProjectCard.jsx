import React from 'react';
import styles from './ProjectCard.css';
import moment from 'moment';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import history from 'state/browserHistory';
import appState from 'state/app';
export default class ProjectCard extends React.Component {

	static propTypes = {
		project: React.PropTypes.object.isRequired,
		onDelete: React.PropTypes.func.isRequired
	}

	static defaultProps = {
		project: {},
		onDelete: ()=>{}
	}

	handleDeleteAction(event) {
		this.props.onDelete(this.props.project);
	}

	transitionToProject() {
		appState.project = this.props.project;
		appState.projectId = this.props.project.id;
		history.push(`/projects/${this.props.project.id}/dashboard`);
	}

	getDate() {
		return [
			<date-updated key="updated">Updated: { moment(this.props.project.updated).fromNow() }</date-updated>,
			<date-created key="created">Created: { this.props.project.created && moment(this.props.project.created).format('MMMM Do YYYY HH:mm') }</date-created>
		];
	}

	render() {
		let projectState = !!this.props.project.closeDate && this.props.project.closeBy !== null ? 'closed' : 'active';
		if ( this.props.project.practice ) {
			projectState = 'practice';
		}
		return (
			<project-card class={ `${styles.ProjectCard} ${projectState}` }>
				<card-detail onClick={ this.transitionToProject.bind(this) }>
					<detail-title>
						{ this.props.project.title }
					</detail-title>
					<detail-close>
						<DeleteButton onConfirm={ this.handleDeleteAction.bind(this) }/>
					</detail-close>
					<detail-date>
						{
							this.getDate()
						}
					</detail-date>
				</card-detail>
				<card-thumbnails>
					{
						this.props.project.members.map(
							member =>
							<thumbnail-item
								title={ member.name }
								key={ member.id }
							>
								{ typeof member.name === 'string' && member.name[0] || null }
							</thumbnail-item>
						)
					}
				</card-thumbnails>
			</project-card>
		);
	}
}
