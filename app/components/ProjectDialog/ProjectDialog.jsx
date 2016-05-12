import React from 'react';
import styles from './ProjectDialog.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import IconButton from 'components/IconButton/IconButton';
import ProjectStream from 'streams/Projects';
import history from 'state/browserHistory';
import localise from 'state/localisation';
import appState from 'state/app';

export default class ProjectDialog extends React.Component {
	static propTypes = {
		onClose: React.PropTypes.func.isRequired,
		transitionOnCreate: React.PropTypes.bool
	}

	static defaultProps = {
		onClose: ()=>{ console.log('no `onClose` handler'); }
	}

	constructor() {
		super();

		this.state = {
			projectTitle: null,
			isProjectManager: false,
			isPracticeProject: false
		};
		this.stream = new ProjectStream(false);
		this.dropShow = this.handleDropShow.bind(this);
	}

	componentWillMount() {
		if ( this.props.transitionOnCreate ) {
			this.projectCreationStream = this.stream.responseStream
				.filter(
					res =>
					res.method.match(/post/i)
				)
				.subscribe(
					this.handleProjectPost.bind(this)
				);
		}
	}

	componentDidMount() {
		this.refs.input.focus();
	}

	handleProjectPost(res) {
		this.projectCreationStream.dispose();
		appState.projectId = res.body.success;
		history.push(`/projects/${res.body.success}/dashboard`);
	}

	handleInputChange(event) {
		this.setState({
			projectTitle: event.target.value
		});
	}

	handleCheckboxChange(id, bool) {
		let checkboxState = {};
		checkboxState[id] = bool;
		this.setState(checkboxState);
	}

	handleCreate() {
		if (!this.state.projectTitle) {
			return;
		}

		this.stream.create({
			title: this.state.projectTitle,
			practice: this.state.isPracticeProject
		});

		this.props.onClose();
	}

	handleClose(event) {
		event.stopPropagation();
		this.props.onClose();
	}

	handleEnter(event) {
		if (event.key === 'Enter') {
			this.handleCreate();
		}
	}

	handleDropShow() {
		this.setState({
			projectTitle: null
		});
		this.refs.input.focus();
	}

	render() {
		return (
			<project-dialog class={ styles.ProjectDialog }>
				<dialog-header>
					<ComponentHeader
						title={ localise('home_new_project') }
						actions={
							<IconButton onClick={ this.handleClose.bind(this) }>clear</IconButton>
						}
					/>
				</dialog-header>
				<dialog-input>
					{
					// <CheckButton
					// 	onChange={ this.handleCheckboxChange.bind(this, 'isProjectManager') }
					// >
					// 	I confirm I am the Project Manager
					// </CheckButton>
					}
					<input
						ref="input"
						placeholder="Enter project name here"
						type="text"
						value={ this.state.projectTitle }
						onChange={ this.handleInputChange.bind(this) }
						onKeyDown={ this.handleEnter.bind(this) }
					/>
				</dialog-input>
				<dialog-options>
					{
						// <options-item>
						// 	<CheckButton>Real Project</CheckButton>
						// </options-item>
					}
					{
						// <options-item>
						// 	<CheckButton
						// 		onChange={ this.handleCheckboxChange.bind(this, 'isPracticeProject') }
						// 	>
						// 		Practice Project
						// 	</CheckButton>
						// </options-item>
					}
				</dialog-options>
				<dialog-action
					onClick={ this.handleCreate.bind(this) }
				>
					CREATE
				</dialog-action>
			</project-dialog>
		);
	}
}
