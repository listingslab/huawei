"use strict";

function route(app, db) {
	app
		.route('/api')
		
		// GET /api endpoint returns a list of all content docs
		.get(function* (next) {
			var result = db.getCollection('content').data;
			this.body = {
				endpoint: '/api',
				description: 'List all docs of all content types',
				method: 'GET',
				docs: result
			};
			this.status = 200;
			yield next;
		})

		// POST /api/:slug Creates a new document
		.post(function* (next) {
			var slug = this.request.body.fields.slug;
			this.body = {
				description: 'Create new doc',
				slug: slug
			}
			var content = db.getCollection('content');
			var exists = content.find ({slug:slug});
			if (exists.length === 0){
				var doc = this.request.body.fields;
				content.insert (doc);	
				db.saveDatabase();
				this.body.status = 'success';
				this.body.doc = doc;
			}else{
				this.body.status = 'fail';
				this.body.errorCode = '001';
			}
			this.status = 200;
			yield next;
		})

		.nested('/:slug')

			// GET /api/:slug .Returns the doc for given slug
			.get(function* (next) {
				var content = db.getCollection('content');
				var slug = this.params.slug;
				var data = content.find ({slug:slug});
				this.body = {
					description: 'GET doc by slug',
					slug: slug,
					doc: data
				}
				yield next;
			})

			// DELETE /api/:slug .Deletes the doc for given slug
			.delete(function* (next) {
				var slug = this.params.slug;
				var content = db.getCollection('content');
				content.removeWhere ({slug:slug});
				db.saveDatabase();
				this.body = {
					description: 'DELETE doc by slug ',
					slug: slug,
					status: 'success'
				}
				yield next;
			})

			// PUT /api/:slug .Updates the doc for given slug
			.put(function* (next) {
				
				var slug = this.request.body.fields.oldSlug;
				this.body = {
					description: 'UPDATE doc'
				}
				var content = db.getCollection('content');
				var doc = content.findObject ({slug:slug});
				if (doc !== null){
					if (this.request.body.fields.title != undefined){
						doc.title = this.request.body.fields.title;
					}
					if (this.request.body.fields.title_zh != undefined){
						doc.title_zh = this.request.body.fields.title_zh;
					};
					if (this.request.body.fields.slug != undefined){
						doc.slug = this.request.body.fields.slug;
					}
					if (this.request.body.fields.type != undefined){
						doc.type = this.request.body.fields.type;
					}
					if (this.request.body.fields.preview != undefined){
						doc.preview = this.request.body.fields.preview;
					}
					if (this.request.body.fields.process != undefined){
						doc.process = this.request.body.fields.process;
					}
					if (this.request.body.fields.showlink != undefined){
						doc.showlink = this.request.body.fields.showlink;
					}
					if (this.request.body.fields.en != undefined){
						doc.en = this.request.body.fields.en;
					}
					if (this.request.body.fields.zh != undefined){
						doc.zh = this.request.body.fields.zh;
					}
					if (this.request.body.fields.hint_en != undefined){
						doc.hint_en = this.request.body.fields.hint_en;
					}
					if (this.request.body.fields.hint_zh != undefined){
						doc.hint_zh = this.request.body.fields.hint_zh;
					}
					if (this.request.body.fields.context_en != undefined){
						doc.context_en = this.request.body.fields.context_en;
					}
					if (this.request.body.fields.context_zh != undefined){
						doc.context_zh = this.request.body.fields.context_zh;
					}
					if (this.request.body.fields.background_en != undefined){
						doc.background_en = this.request.body.fields.background_en;
					}
					if (this.request.body.fields.background_zh != undefined){
						doc.background_zh = this.request.body.fields.background_zh;
					}
					if (this.request.body.fields.definition_en != undefined){
						doc.definition_en = this.request.body.fields.definition_en;
					}
					if (this.request.body.fields.definition_zh != undefined){
						doc.definition_zh = this.request.body.fields.definition_zh;
					}
					content.update (doc);
					db.saveDatabase();
					this.body.slug =  doc.slug;
					this.body.status =  'success';
				}else{
					this.body.status =  'fail';
					this.body.errorCode = '002';
				}		
				yield next;
			})

		.all(function* (next) {
			this.status = 404;
			this.body = {
				response: 'Not Found'
			}
			yield next;
		})
		
}

module.exports = route;
