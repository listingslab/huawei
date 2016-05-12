import React from 'react';
import styles from './Projects.css';
import ProjectCard from 'components/ProjectCard/ProjectCard';
import ProjectStream from 'streams/Projects';
import DropDown from 'components/DropDown/DropDown';
import ProjectDialog from 'components/ProjectDialog/ProjectDialog';
import localise from 'state/localisation';
export default class Projects extends React.Component {
	constructor() {
		super();
		this.state = {
			projects: []
		};
	}

	componentWillMount() {
		this.stream = new ProjectStream;
		this.stream.subscribe(
			this.handleProjectsUpdate.bind(this)
		);

		this.stream.read();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleProjectsUpdate(res) {
		if (!res.body.items) { return; }
		this.setState({
			projects: res.body.items
		});
	}

	handleDialogClose() {
		this.refs.dropdown.close();
	}

	handleDeleteProject(project) {
		this.stream.delete(project.id);
	}

	render() {
		return (
			<projects-view class={ styles.Projects }>
				<view-gutter class="left">
					<DropDown
						ref="dropdown"
						content={
							<ProjectDialog
								onClose={ this.handleDialogClose.bind(this) }
							/>
						}
						position="bottom left"
					>
						<new-project-button>
							<material-icon>
								add_circle_outline
							</material-icon>
							<button-title>{ localise('home_new_project') }</button-title>
						</new-project-button>
					</DropDown>
					<projects-legend>
						<legend-active>{ localise('legend_active') }</legend-active>
						<legend-complete>{ localise('legend_complete') }</legend-complete>
						{ /* <legend-practice>Practice</legend-practice> */ }
					</projects-legend>
				</view-gutter>
				<view-content>
					<content-center>
						{
							this.state.projects.map(
								(project) =>
								<ProjectCard
									key={`project-${ project.id }`}
									project={ project }
									onDelete={ this.handleDeleteProject.bind(this) }
								/>
							)
						}
						<project-fill/>
						<project-fill/>
						<project-fill/>
					</content-center>
				</view-content>
			</projects-view>
		);
	}
}
