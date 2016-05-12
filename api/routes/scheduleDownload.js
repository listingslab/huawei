'use strict';
let fs = require('fs');
let moment = require('moment');
let handlebars = require('handlebars');
let source = fs.readFileSync(__dirname + '/../scheduleTemplate.xml');
let template = handlebars.compile(source.toString());

let CollectionController = require('../collections/controller');
let Collection = new CollectionController('deliverables');

function route(app) {
	app
	.route('/schedule/:projectId')
	.get(function* (next) {
		let projectId = parseInt(this.params.projectId, 10);
		let deliverables = Collection.readAll({$projectId: projectId});
		let sheetMap = [];
		deliverables
			.forEach(
				del => {
					sheetMap.push({
						description: del.description,
						charLength: 0 || del.description && del.description.length,
						endDate: del.due,
						startDate: null,
						index: 1
					});
					del.tasks.forEach(
						task => {
							sheetMap.push({
								description: task.title,
								charLength: 0 || task.title && task.title.length,
								startDate: task.startDate,
								endDate: task.endDate,
								index: 2
							});
						}
					);
				}
			);

		let dates = {
			min: null,
			max: null,
			days: null,
			list: []
		};

		sheetMap.forEach(
			item => {
				if (!!item.startDate) {
					if ( moment(item.startDate).isBefore(dates.min) || dates.min === null ) {
						dates.min = moment(item.startDate);
					}
				}
				if (!!item.endDate) {
					if ( moment(item.endDate).isAfter(dates.max) || dates.max === null ) {
						dates.max = moment(item.endDate);
					}
				}
				dates.days = moment(dates.max).diff(dates.min, 'days');
			}
		);

		for (let i = 0; i <= dates.days; i++) {
			dates.list.push(dates.min.clone().add(i, 'days'));
		}

		let columnOffset = 3;

		let spreadSheet = {
			columns: dates.list.length + columnOffset,
			days: dates.list.length,
			dates: dates.list.map( date => date.format('YYYY-MM-DDTHH:mm:ss') ),
			rows: sheetMap.map(
					row => {
						let start = dates.list.findIndex( date => date.isSame(row.startDate));
						let end = dates.list.findIndex( date => date.isSame(row.endDate));
						return {
							text: row.description,
							height: Math.max(25, 16 * Math.ceil(row.charLength / 50)),
							validDates: start > -1 && end > -1,
							dates: {
								start: start + columnOffset,
								end: (end + columnOffset) - (start + columnOffset)
							},
							cellIndex: row.index,
							cellMerge: row.index === 2 ? 0 : 1
						};
					}
				),
			rowLength: sheetMap.length + 1
		};

		this.set('Content-disposition', 'attachment; filename=' + 'schedule.xls');
		this.set('Content-type', 'application/excel');

		this.body = template(spreadSheet);
		yield next;
	});
}
module.exports = route;