
var env			= process.env;
var colors		= require('colors');
var clear		= require('clear');
var fs			= require('fs-extra');
var serve		= require('koa-static');
var routing		= require('koa-routing');
var body		= require('koa-better-body');
var request 	= require('koa-request');
var koa			= require('koa');
var loki		= require('lokijs')

var db = new loki('content.json');
db.loadDatabase({}, function () {
	if (db.getCollection('content') === null){
		var content = db.addCollection('content');
		db.saveDatabase();
		console.log('New Loki Database created!! /content.json'.bgYellow);
	}
});

var app = koa();
app.use(function* (next) {
	// console.log('Writing koa middleware yeh?');
	yield next;
});

app.use(serve('public'));

app.use(function* (next) {
	yield next;
	this.set('Access-Control-Allow-Origin', '*');
	this.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST');
	this.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
	this.set('Content-Type', 'application/json');
});



app.use(body({formLimit:'10mb'}));



app.use(routing(app));

require('./routes/api')(app, db);
require('./routes/glossarise')(app, db);
require('./routes/special')(app, db);

app.route('/publish')
	.all(function* (next) {
		console.log('Publishing...');
		fs.copySync(__dirname + '/../content.json', __dirname + '/../../api/content.json');
		var options = {
	    	url: 'http://localhost:3000/reload-content',
		    headers: { 'User-Agent': 'request' }
		};
		var response = yield request(options);
		var info = JSON.parse(response.body);
		this.redirect('/?alert=publish-success');
		yield next;
	})

// Anything else gets routed back home
app.route('*')
	.all(function* (next) {
		this.set('Content-Type', 'application/html');
		this.redirect('/');
		yield next;
	})

app.listen(env.NODE_PORT || 2500, env.NODE_IP || 'localhost', function () {});
