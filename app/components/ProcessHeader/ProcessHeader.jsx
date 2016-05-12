import React from 'react';
import styles from './ProcessHeader.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import FlowChart from 'components/FlowChart/FlowChart';
import ProcessChart from 'components/ProcessChart/ProcessChart';
import Locale from 'state/localisation';

export default class ProcessHeader extends React.Component {
	parseLocation() {
		let parts = (
			window
				.location
				.pathname
				.split('/')
				.filter( part => !!part )
		);

		return parts;
	}

	render() {
		let location = this.parseLocation();
		return (
			<process-header class={ styles.ProcessHeader }>
				<header-flow>
					<ComponentHeader
						title={ Locale('ph_process_flow') }
						class="blue"
					/>
					<flow-diagram>
						<ProcessChart
							path={ location[2] }
							name="cycle"
						/>
					</flow-diagram>
				</header-flow>
				<header-sub class={ location[2] }>
					<ComponentHeader
						title={ Locale('ph_sub_flow') }
						class="blue"
					/>
					<ProcessChart
						path={ location[2] }
						name={ location[3] }

					/>
				</header-sub>
			</process-header>
		);
	}
}
