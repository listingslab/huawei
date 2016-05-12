import React from 'react';
import styles from './MonitorProcess.css';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import ProcessList from 'components/ProcessList/ProcessList';
import localise from 'state/localisation';
export default class MonitorProcess extends React.Component {

	constructor() {
		super();
	}

	render() {
		return (
			<monitor-process-view class={ styles.MonitorProcess }>
				<ProcessHeader/>
				<h3>
					{ localise('guide_work_area') }
				</h3>

				<ComponentHeader
					index="1"
					title={ localise('menu_monitor') }
					class="blue"
				/>
				<ProcessList/>

			</monitor-process-view>
		);
	}
}
