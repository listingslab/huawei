import React from 'react';
import d3 from 'd3';
import moment from 'moment';
import styles from './ScheduleGridD3.css';
import scales from './ScheduleGridScale';

export default class ScheduleGridD3 extends React.Component {

	static propTypes = {
		model: React.PropTypes.array.isRequired,
		onDisplay: React.PropTypes.func
	}

	constructor() {
		super();
		this.svgElements = {};
	}

	componentWillMount() {
		this._resizeHandler = this.handleWindowResize.bind(this);
		window.addEventListener('resize', this._resizeHandler);
	}

	componentDidMount() {
		this.createGroups();
		this.updateView();
	}

	componentDidUpdate() {
		this.updateView();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this._resizeHandler);
	}

	handleWindowResize() {
		this.updateScales();
		this.updatePlots();
		this.brush.extent(this.currentExtent);
		this.svgElements.brush.call(this.brush);
	}

	handleEventPopup(show, model) {
		!!this.props.onDisplay && this.props.onDisplay(show ? model : null);
	}

	updateView() {
		this.updateScales();
		this.currentExtent = this.currentExtent || scales.x.domain();
		this.brush.x(scales.x);
		this.brush.extent(this.currentExtent);
		this.svgElements.brush.call(this.brush);
		this.updatePlots();
	}

	updateScales() {
		let tasks = this.props.model.filter( item => !!item.startDate && !!item.endDate );
		let minDate = moment.min(tasks.map(task => moment(task.startDate)));
		let maxDate = moment.max(tasks.map(task => moment(task.endDate)));
		if ( !!minDate && !!maxDate ) {
			scales.x.domain([minDate.subtract(5, 'days').toDate(), maxDate.add(5, 'days').toDate()]);
		} else {
			scales.x.domain([moment().subtract(1, 'month').toDate(), maxDate.add(1, 'days').toDate()]);
		}
		scales.x.range([10, this.refs.svg.parentElement.offsetWidth - 10]);
	}

	createGroups() {
		let svg = d3.select(this.refs.svg);
		this.svgElements.svg = svg;
		this.svgElements.grid = svg.append('g').attr('id', 'axis-lines');
		this.svgElements.today = svg.append('rect').attr('id', 'today');
		this.svgElements.header = svg.append('rect').attr('id', 'header');
		this.svgElements.names = svg.append('g').attr('id', 'axis-names');
		this.svgElements.bars = svg.append('g').attr('id', 'bars');
		this.svgElements.shadows = svg.append('g').attr('id', 'shadows');
		this.svgElements.brush = svg.append('g').attr('id', 'brush');
		this.brush = d3.svg.brush()
		.x(scales.x)
		.on('brush', () => {
			let days = Math.abs(
				moment(this.brush.extent()[0])
					.diff(this.brush.extent()[1], 'days')
			);
			if ( days >= 7 ) {
				this.currentExtent = this.brush.extent();
			} else {
				this.brush.extent(this.currentExtent);
				this.svgElements.brush.call(this.brush);
			}

			this.updatePlots();
		});
	}

	updatePlots() {
		let scale = scales.x.copy();
		scale.domain(this.brush.extent());
		let dayDiff = moment(scale.domain()[1]).diff(moment(scale.domain()[0]), 'days');
		let frameWidth = this.refs.svg.parentElement.offsetWidth;
		let frameHeight = this.refs.svg.parentElement.offsetHeight;

		this.svgElements.svg.selectAll('g#axis-lines *').remove();
		this.svgElements.svg.selectAll('g#axis-names *').remove();

		this.svgElements.header.attr('x', 0);
		this.svgElements.header.attr('y', 0);
		this.svgElements.header.attr('height', 40);
		this.svgElements.header.attr('width', frameWidth);

		let todayStart = moment().hours(0).minutes(0).seconds(0);
		let todayEnd = moment().hours(24).minutes(0).seconds(0);

		this.svgElements.today.attr('height', '100%');
		this.svgElements.today.attr('width', Math.max(scale(todayEnd) - scale(todayStart), 4));
		this.svgElements.today.attr('x', scale(todayStart) );

		let axisGrid = d3.svg.axis();
		axisGrid.scale(scale);
		// axisGrid.ticks(d3.time.day, 1);
		axisGrid.tickSize(frameHeight, 0);
		this.svgElements.grid.call(axisGrid);

		let axisNames = d3.svg.axis();
		axisNames.scale(scale);
		axisNames.outerTickSize(0);
		axisNames.innerTickSize(16);
		this.svgElements.names.call(axisNames);

		let rect = this.svgElements.bars.selectAll('rect').data(
			this.props.model.filter( item => !!item.startDate && !!item.endDate )
		);

		rect.enter().append('rect');
		let rectHeight = 15;
		// svg:rect x="0" y="0" width="0" height="0" rx="0" ry="0"
		rect.attr('x', (d) => scale(moment(d.startDate)));
		rect.attr('y', (d) => {
			let pos = this.getTaskPos(d.id);
			let y = (pos.top - this.refs.svg.parentElement.offsetTop ) + (pos.height / 2) - (rectHeight / 2);
			return y;
		});
		rect.attr('class', (d) => d.statusId);
		rect.attr('height', rectHeight);
		rect.attr('width', (d) => scale(moment(d.endDate)) - scale(moment(d.startDate)) || 0);
		rect.on('mouseenter', this.handleEventPopup.bind(this, true));
		rect.on('mouseleave', this.handleEventPopup.bind(this, false));
		rect.exit().remove();

		let progRect = this.svgElements.shadows.selectAll('rect').data(
			this.props.model.filter( item => !!item.startDate && !!item.endDate )
		);
		progRect.enter().append('rect');
		// svg:rect x="0" y="0" width="0" height="0" rx="0" ry="0"
		progRect.attr('x', (d) => scale(moment(d.startDate)));
		progRect.attr('y', (d) => {
			let pos = this.getTaskPos(d.id);
			let y = (pos.top - this.refs.svg.parentElement.offsetTop ) + (pos.height / 2) - (rectHeight / 2);
			return y;
		});
		progRect.attr('height', rectHeight);
		progRect.attr('width',
			(d) =>
			Math.min(
				Math.max( scale(moment()) - scale(moment(d.startDate)), 0),
				scale(moment(d.endDate)) - scale(moment(d.startDate))
			)
		);
		progRect.on('mouseenter', this.handleEventPopup.bind(this, true));
		progRect.on('mouseleave', this.handleEventPopup.bind(this, false));
		progRect.exit().remove();
	}

	getTaskPos(id) {
		let el = document.querySelector(`task-item[task="${id}"] component-header`);
		return {
			height: el.offsetHeight,
			top: el.offsetTop
		};
	}

	render() {
		return (
			<schedule-grid-d3
				class={ styles.ScheduleGridD3 }
			>
				<svg ref="svg">
					<filter id="dropShadow">
						<feGaussianBlur in="SourceAlpha" stdDeviation="4" />
						<feOffset dx="2" dy="4" />
						<feMerge>
							<feMergeNode />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</svg>
			</schedule-grid-d3>
		);
	}
}
