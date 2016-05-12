'use strict';
require('./util');
let koa = require('koa');
let serve = require('koa-static');
let routing = require('koa-routing');
let body = require('koa-better-body');
let clear =  require('clear');
let app  = koa();
let db =  require('./db');
let content =  require('./content');

app.use(serve(__dirname + '/public'));
app.use(serve(__dirname + '/build'));

app.use(function* (next) {
	yield next;
	this.set('Access-Control-Allow-Origin', '*');
	this.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST');
	this.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
	this.set('Content-Type', 'application/json');
});

app.use(body());
app.use(routing(app));

app.route('*')
	.options(function* (next) {
		this.status = 200;
		yield next;
	});

// Load both databases before starting
db.loadDatabase({}, () => {
	content.loadDatabase({}, () => {
		require('./routes/dashboard')(app);
		require('./routes/projects')(app);
		require('./routes/charter')(app);
		require('./routes/content')(app);
		require('./routes/guide')(app);
		require('./routes/glossary')(app);
		require('./routes/deliverables')(app);
		require('./routes/deliverable-tasks')(app);
		require('./routes/deliverable-activites')(app);
		require('./routes/milestones')(app);
		require('./routes/members')(app);
		require('./routes/meetings')(app);
		require('./routes/topics')(app);
		require('./routes/introductions')(app);
		require('./routes/risks')(app);
		require('./routes/controls')(app);
		require('./routes/summary')(app);
		require('./routes/changes')(app);
		require('./routes/reload-content')(app, content);
		require('./routes/scheduleDownload.js')(app);
		app.listen(3000);
		clear();
		console.log('~~~~~~~~~~~~~~~~| Listening on port 3000 |~~~~~~~~~~~~~~~~');
	});
});


